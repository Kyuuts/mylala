import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { Lock, User, Mail, ArrowRight, AlertCircle, Eye, EyeOff, UserPlus, LogIn, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Logo from '../components/common/Logo';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, register } = useAppStore();

  const [mode, setMode] = useState(
    searchParams.get('mode') === 'register' || location.state?.mode === 'register'
      ? 'register'
      : 'login'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (mode === 'register') {
        result = await register({ email, username, name, password });
      } else {
        // In login mode, username field holds either email or username
        result = await login({ identifier: username, password });
      }

      if (result && result.success) {
        const destination = location.state?.from?.pathname || '/dashboard';
        navigate(destination, { replace: true });
      } else {
        setError(result?.error || 'Gagal melakukan autentikasi. Silakan periksa kembali data Anda.');
      }
    } catch (err) {
      setError('Terjadi kendala pada sistem. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D4F63D] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-3 border-black shadow-[8px_8px_0px_#000] space-y-6">
        <div className="flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#D4F63D] transition active:translate-x-0.5 active:translate-y-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" /> Beranda MyLala
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-1.5 rounded-2xl bg-[#D4F63D] border-2.5 border-black shadow-[3px_3px_0px_#000]">
              <Logo size="lg" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase flex items-center justify-center gap-2">
              <span>MyLala</span>
              <span className="px-2 py-0.5 rounded-lg bg-[#FF85C0] border-2 border-black shadow-[1px_1px_0px_#000] text-xs font-black">
                PWA
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-black/70 font-bold mt-1">
              Active Recall Flashcards &amp; Multi-Language Mastery
            </p>
          </div>
        </div>

        {/* Tab Switcher: Masuk vs Daftar */}
        <div className="grid grid-cols-2 p-1.5 bg-[#F8FAFC] rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] gap-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#D4F63D] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-black/60 hover:text-black bg-transparent border-2 border-transparent'
            }`}
          >
            <LogIn className="w-4 h-4 stroke-[2.5]" />
            <span>Masuk</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#FF85C0] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-black/60 hover:text-black bg-transparent border-2 border-transparent'
            }`}
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Daftar Akun</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FF5252] border-2 border-black shadow-[3px_3px_0px_#000] text-white text-xs sm:text-sm font-black flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Nama Lengkap / Panggilan
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-black stroke-[2.5] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Sarah Kirana, Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[4px_4px_0px_#000] transition"
                    required={mode === 'register'}
                  />
                </div>
              </div>

              {/* Email Address for Supabase Auth */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black block">
                  Alamat Email Aktif
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-black stroke-[2.5] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="e.g. sarah@gmail.com, budi@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[4px_4px_0px_#000] transition"
                    required={mode === 'register'}
                  />
                </div>
              </div>
            </>
          )}

          {/* Username or Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-black block">
              {mode === 'register' ? 'Username' : 'Username atau Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-black stroke-[2.5] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={
                  mode === 'register'
                    ? 'e.g. sarah123, budi_k'
                    : 'Masukkan username atau email Anda'
                }
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[4px_4px_0px_#000] transition"
                required
              />
            </div>
          </div>

          {/* Password with Eye Toggle */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Password
              </label>
              {mode === 'register' && (
                <span className="text-[10px] font-bold text-black/60">Min. 6 karakter</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-black stroke-[2.5] absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'register' ? 'Minimal 6 karakter' : 'Masukkan password Anda'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[4px_4px_0px_#000] transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-black hover:scale-110 transition cursor-pointer"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4 stroke-[2.5]" /> : <Eye className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FF85C0] hover:bg-[#D4F63D] text-black font-black text-sm uppercase tracking-wider border-2.5 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : mode === 'register' ? (
              <>
                <span>Buat Akun &amp; Mulai Belajar</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div className="pt-2 border-t-2 border-black/10 flex items-center justify-center gap-1.5 text-black/60 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          <span>Cloud sync Supabase &bull; 100% Offline PWA</span>
        </div>
      </div>
    </div>
  );
}
