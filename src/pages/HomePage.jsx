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

      {/* Feature Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">1-Page Cheat Sheets</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Materi ringkas terstruktur (Grammar, Vocab, Templates) yang dapat dibaca tuntas dan dipahami dalam hitungan menit.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Spaced Repetition (SRS)</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Algoritma SM-2 teruji (Hard, Good, Easy) untuk memastikan memori kosakata dan tata bahasa bertahan jangka panjang.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">PWA &amp; Offline Ready</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Dapat di-install ke layar beranda HP / Desktop layaknya aplikasi native dan tetap dapat diakses tanpa koneksi internet.
          </p>
        </div>
      </section>
    </div>
  );
}
