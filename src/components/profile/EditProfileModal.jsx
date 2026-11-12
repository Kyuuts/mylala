import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, Check, User, AtSign, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PRESET_AVATARS, compressImageFile } from '../../utils/avatars';

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAppStore();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fileInputRef = useRef(null);

  // Initialize fields when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setSelectedAvatarUrl(user.avatarUrl || '');
      setError(null);
      setSuccessMsg(null);
      setIsUploading(false);
      setIsSaving(false);
    }
  }, [isOpen, user]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  // Handle image file selection & compression
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      // Compress to compact WebP (max 256x256, ~15-25KB)
      const compressedDataUrl = await compressImageFile(file, 256, 256);
      setSelectedAvatarUrl(compressedDataUrl);
    } catch (err) {
      console.error('Compress image failed:', err);
      setError(err.message || 'Gagal memproses gambar. Gunakan file JPG, PNG, atau WebP.');
    } finally {
      setIsUploading(false);
      // Reset input value so user can re-upload same file if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Submit profile updates
  const handleSave = async (e) => {
    e?.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanName = (name || '').trim();
    const cleanUser = (username || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (!cleanName || cleanName.length < 2) {
      setError('Silakan masukkan nama minimal 2 karakter.');
      return;
    }
    if (!cleanUser || cleanUser.length < 3) {
      setError('Username minimal 3 karakter (hanya huruf, angka, dan garis bawah tanpa spasi).');
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateProfile({
        name: cleanName,
        username: cleanUser,
        avatarUrl: selectedAvatarUrl || null,
      });

      if (!res.success) {
        setError(res.error || 'Gagal menyimpan profil.');
        setIsSaving(false);
        return;
      }

      setSuccessMsg('Profil dan foto berhasil diperbarui!');
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Update profile error:', err);
      setError('Terjadi kendala saat menyimpan. Coba lagi.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Kustomisasi Akun</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Edit Profil & Avatar</h2>
          <p className="text-xs text-indigo-100/80 mt-1">
            Sesuaikan username dan foto profil Anda untuk ditampilkan di Klasemen Liga MyLala.
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. HERO AVATAR PREVIEW & UPLOAD TRIGGER */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-indigo-600 shadow-lg bg-slate-100 flex items-center justify-center transition group-hover:scale-105">
                {selectedAvatarUrl ? (
                  <img
                    src={selectedAvatarUrl}
                    alt="Preview Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>

              {/* Camera Upload Badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Pilih foto dari perangkat"
                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md border-2 border-white transition active:scale-95 cursor-pointer"
              >
                {isUploading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="text-center mt-3">
              <p className="text-sm font-bold text-slate-800">{name || 'Nama Kamu'}</p>
              <p className="text-xs text-indigo-600 font-semibold">@{username || 'username'}</p>
            </div>
          </div>

          {/* 2. OPTION: UPLOAD USER PHOTO BUTTON */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">Upload Foto Sendiri</p>
                <p className="text-[11px] text-slate-500">Gunakan foto profil dari galeri HP/laptop</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-indigo-600 font-bold text-xs shadow-2xs transition active:scale-95 shrink-0 cursor-pointer"
            >
              {isUploading ? 'Mengompres...' : 'Pilih File'}
            </button>
          </div>

          {/* 3. OPTION: 5 PRESET CHARACTER AVATARS */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>Atau Pilih 5 Karakter Avatar:</span>
              </label>
              {selectedAvatarUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedAvatarUrl('')}
                  className="text-[11px] text-slate-400 hover:text-rose-600 font-medium transition"
                >
                  Reset Default
                </button>
              )}
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {PRESET_AVATARS.map((avatar) => {
                const isSelected = selectedAvatarUrl === avatar.svgDataUri;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatarUrl(avatar.svgDataUri)}
                    className={`relative flex flex-col items-center p-2 rounded-2xl border-2 transition active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-200'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-slate-200/80 mb-1">
                      <img
                        src={avatar.svgDataUri}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center leading-tight">
                      {avatar.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-400">{avatar.emoji}</span>

                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. NAME & USERNAME FIELDS */}
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap / Panggilan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Imam Syafei"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username Akun (Unik di Klasemen)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="imam_syafei"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Gunakan huruf kecil, angka, atau underscore. Ditampilkan di kartu dan klasemen rank.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
