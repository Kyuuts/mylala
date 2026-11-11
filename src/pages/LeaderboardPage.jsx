import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Flame, Sparkles, Clock, ArrowUpCircle, ShieldAlert, BookOpen, Layers, Award, Radio } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { getTierFromXP, getTimeUntilWeeklyReset, TIERS } from '../utils/rankSystem';

export default function LeaderboardPage() {
  const { weeklyXp, fetchLeaderboard, streak, user, isSupabaseReady } = useAppStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const [countdown, setCountdown] = useState(getTimeUntilWeeklyReset());
  const [loading, setLoading] = useState(true);

  const currentTier = getTierFromXP(weeklyXp || 0);

  const loadLeaderboardData = async () => {
    try {
      const data = await fetchLeaderboard();
      setLeaderboard(data || []);
    } catch (err) {
      console.warn('Leaderboard load warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();

    // Setup Supabase Realtime WebSocket listener
    let channel;
    if (isSupabaseReady && isSupabaseConfigured()) {
      try {
        channel = supabase
          .channel('realtime_leaderboard_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'user_weekly_stats' },
            () => {
              loadLeaderboardData();
            }
          )
          .subscribe();
      } catch (e) {
        console.warn('Realtime channel subscribe notice:', e);
      }
    }

    // Update countdown timer every minute
    const interval = setInterval(() => {
      setCountdown(getTimeUntilWeeklyReset());
    }, 60000);

    return () => {
      clearInterval(interval);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [weeklyXp, isSupabaseReady]);

  const userEntry = leaderboard.find((item) => item.isCurrentUser) || {
    rank: 1,
    weeklyXp: weeklyXp || 0,
    streak: streak || 1,
  };

  // Progress to next tier
  const xpNeededForNext = currentTier.maxXp !== Infinity ? currentTier.maxXp - (weeklyXp || 0) : 0;
  const progressPercent =
    currentTier.maxXp !== Infinity
      ? Math.min(100, Math.max(0, (((weeklyXp || 0) - currentTier.minXp) / (currentTier.maxXp - currentTier.minXp)) * 100))
      : 100;

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* 1. HERO LEAGUE BANNER */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${currentTier.gradient} text-white p-6 sm:p-8 shadow-lg`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Reset Mingguan: {countdown.formatted} lagi (Minggu 23:59 WIB)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl">{currentTier.badge}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {currentTier.name}
                </h1>
                <p className="text-xs sm:text-sm text-white/80">
                  Liga Pembelajar Bahasa Inggris Mingguan • Musim 2026
                </p>
              </div>
            </div>
          </div>

          {/* User Quick Stats in Banner */}
          <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 flex items-center gap-5 shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Peringkat</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">#{userEntry.rank}</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">XP Mingguan</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{weeklyXp || 0}</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Streak</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-orange-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-current" /> {streak || 1}
              </p>
            </div>
          </div>
        </div>

        {/* Next Tier Progress Bar */}
        {currentTier.nextTier && (
          <div className="relative z-10 mt-6 pt-5 border-t border-white/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Menuju {currentTier.nextTier}</span>
              <span>{xpNeededForNext > 0 ? `${xpNeededForNext} XP lagi` : 'Siap Promosi!'}</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-300 to-yellow-400 h-2.5 rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. LEADERBOARD TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Klasemen Liga Bahasa Inggris</span>
              </h2>
              {isSupabaseReady && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Realtime Live
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Top 5 akan naik ke liga berikutnya saat reset minggu malam (Minggu 23:59 WIB).
            </p>
          </div>

          <Link
            to="/flashcards/all"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition shadow-xs self-start sm:self-auto"
          >
            <Layers className="w-4 h-4" />
            <span>Latihan Tambah XP</span>
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {leaderboard.map((contestant, index) => {
            const isTop3 = contestant.rank <= 3;
            const isPromoBoundary = contestant.rank === 5;
            const isRelegationBoundary = contestant.rank === 7 && currentTier.id !== 'Bronze';

            return (
              <React.Fragment key={contestant.id}>
                <div
                  className={`flex items-center justify-between p-4 sm:px-6 transition ${
                    contestant.isCurrentUser
                      ? 'bg-indigo-50/70 border-l-4 border-indigo-600 shadow-xs'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-8 flex items-center justify-center font-extrabold text-sm sm:text-base">
                      {contestant.rank === 1 ? (
                        <span className="text-xl">🥇</span>
                      ) : contestant.rank === 2 ? (
                        <span className="text-xl">🥈</span>
                      ) : contestant.rank === 3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-slate-400 font-bold">#{contestant.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <span className="text-2xl sm:text-3xl select-none">{contestant.avatar}</span>

                    {/* Name & Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-bold text-sm sm:text-base truncate ${contestant.isCurrentUser ? 'text-indigo-900 font-extrabold' : 'text-slate-900'}`}>
                          {contestant.name}
                        </p>
                        {contestant.isCurrentUser && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shrink-0">
                            Kamu
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1 text-orange-500 font-medium">
                          <Flame className="w-3 h-3 fill-current" /> {contestant.streak} hari
                        </span>
                        <span>•</span>
                        <span>{contestant.cardsReviewed} kartu</span>
                      </div>
                    </div>
                  </div>

                  {/* XP Score */}
                  <div className="text-right shrink-0">
                    <p className="text-base sm:text-lg font-extrabold text-slate-900">
                      {contestant.weeklyXp} <span className="text-xs font-bold text-indigo-600">XP</span>
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {contestant.tier.name}
                    </span>
                  </div>
                </div>

                {/* Promotion Line Divider */}
                {isPromoBoundary && (
                  <div className="bg-emerald-50 px-4 sm:px-6 py-2 border-y border-emerald-200/80 flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                    <span>⬆️ ZONA PROMOSI KE LIGA BERIKUTNYA (TOP 5)</span>
                  </div>
                )}

                {/* Relegation Line Divider */}
                {isRelegationBoundary && (
                  <div className="bg-rose-50 px-4 sm:px-6 py-2 border-y border-rose-200/80 flex items-center gap-2 text-xs font-bold text-rose-800">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>⬇️ ZONA DEGRADASI</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. CARA MENGUMPULKAN XP (RULES CARD) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>Cara Cepat Naik Rank &amp; Kumpulkan XP</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-indigo-900 text-sm">
              <span>Review Flashcard</span>
              <span className="text-indigo-600">+5 s/d +15 XP</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Tekan 'Mudah' (+15 XP), 'Lumayan' (+10 XP), atau 'Sulit' (+5 XP) pada setiap kartu review harian.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-emerald-900 text-sm">
              <span>Selesaikan Cheat Sheet</span>
              <span className="text-emerald-700">+20 XP</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Buka dan baca modul cheat sheet 1 lembar sampai tuntas untuk mendapatkan reward pemahaman teori.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-amber-900 text-sm">
              <span>Pertahankan Streak</span>
              <span className="text-amber-700">Multiplier XP</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Belajar setiap hari berturut-turut untuk meningkatkan bonus multiplier XP di setiap sesi latihan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

