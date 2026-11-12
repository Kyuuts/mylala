import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Check, User, AtSign, AlertCircle, RefreshCw, Upload, RotateCcw } from 'lucide-react';
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

  // Lock body scroll when modal is open to prevent background scrolling or collisions
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

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
      setError('Nama minimal 2 karakter.');
      return;
    }
    if (!cleanUser || cleanUser.length < 3) {
      setError('Username minimal 3 karakter (huruf, angka, tanpa spasi).');
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

      setSuccessMsg('Profil berhasil diperbarui!');
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error('Update profile error:', err);
      setError('Terjadi kendala saat menyimpan. Coba lagi.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        
        {/* Minimalist Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Edit Profil</h2>
            <p className="text-[11px] text-slate-500">Ubah username dan foto profil Anda</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. COMPACT AVATAR PREVIEW + CAMERA BUTTON */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="relative">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-600 shadow-sm bg-slate-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition group"
                title="Klik untuk upload foto"
              >
                {selectedAvatarUrl ? (
                  <img
                    src={selectedAvatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Badge Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Pilih foto dari perangkat"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm border-2 border-white flex items-center justify-center transition cursor-pointer"
              >
                {isUploading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Camera className="w-3 h-3" />
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

            {/* Upload / Reset Quick Actions */}
            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer text-[11px]"
              >
                <Upload className="w-3 h-3" />
                <span>{isUploading ? 'Mengompres...' : 'Upload Foto'}</span>
              </button>

              {selectedAvatarUrl && (
                <>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => setSelectedAvatarUrl('')}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition cursor-pointer text-[11px]"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 2. FIVE PRESET AVATARS (MINIMALIST CIRCLE ROW) */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
              Pilihan Avatar Karakter
            </label>

            <div className="flex items-center justify-center gap-2.5">
              {PRESET_AVATARS.map((avatar) => {
                const isSelected = selectedAvatarUrl === avatar.svgDataUri;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatarUrl(avatar.svgDataUri)}
                    title={avatar.name}
                    className={`relative w-10 h-10 rounded-full overflow-hidden transition active:scale-95 cursor-pointer shrink-0 border-2 ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500 ring-offset-2 scale-105'
                        : 'border-slate-200 hover:border-slate-400 bg-slate-50'
                    }`}
                  >
                    <img
                      src={avatar.svgDataUri}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. NAME & USERNAME FIELDS */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama tampilan kamu"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <AtSign className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="username_kamu"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60 text-slate-900"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Gunakan huruf kecil, angka, atau underscore (_)
              </p>
            </div>
          </div>
        </form>

        {/* Minimalist Bottom Actions (Sticky) */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
