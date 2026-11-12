import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers, Zap, Clock, Sparkles } from 'lucide-react';
import Logo from '../components/common/Logo';

export default function HomePage() {
  return (
    <div className="space-y-10 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-5 max-w-2xl mx-auto pt-4">
        <div className="flex justify-center mb-2">
          <Logo size="xl" className="shadow-lg hover:scale-105 transition-transform" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>MyLala &bull; Micro-Learning &amp; Active Recall</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Kuasai Bahasa Asing Lebih Cepat dengan <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">MyLala</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          PWA modular untuk mempelajari Grammar, Vocabulary, dan Templates berbagai bahasa secara terstruktur. Dilengkapi flashcard spaced repetition dan siap dipakai kapan saja secara offline.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition active:scale-95"
          >
            Buka Dashboard Belajar <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/flashcards/all"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 rounded-2xl border border-slate-300 transition active:scale-95 shadow-xs"
          >
            <Layers className="w-4 h-4 text-indigo-600" /> Mulai Flashcards
          </Link>
        </div>
      </section>

      {/* 3 Main Pillars Section */}
      <section className="space-y-4 pt-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Ekosistem Belajar 3 Pilar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kombinasi teori ringkas, arena latihan intensif, dan bacaan kontekstual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/dashboard"
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition">
                1. Belajar (Teori CEFR)
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Materi 1-page ringkas Grammar, Kosakata, &amp; Konjungsi berjenjang A1 s/d C1, lengkap dengan Tes Penempatan Level.
            </p>
          </Link>

          <Link
            to="/practice"
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-orange-600 transition">
                2. Latihan (6 Mode)
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Arena pengasahan skill: Kartu Hafalan SRS, Kesalahan Umum, Dikte, Dialog, Menulis, dan Konjungsi.
            </p>
          </Link>

          <Link
            to="/reading"
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-sky-600 transition">
                3. Bacaan (Graded Readers)
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Artikel kontekstual sesuai level CEFR. Ketuk kata sulit untuk melihat arti dan menyimpannya langsung ke kartu hafalan.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
