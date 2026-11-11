import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="text-center py-16 space-y-4">
      <h1 className="text-6xl font-black text-indigo-600">404</h1>
      <h2 className="text-xl font-bold text-slate-800">Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">
        Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
      >
        <Home className="w-4 h-4" /> Kembali ke Beranda
      </Link>
    </div>
  );
}

