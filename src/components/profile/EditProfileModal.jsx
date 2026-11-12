import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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

  // Lock body scroll when modal is open to prevent background scrolling
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
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

  if (!isOpen || typeof document === 'undefined') return null;

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

  // Render directly to document.body via Portal to escape any parent sticky/backdrop-blur containing blocks
  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/75 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150">
      
      {/* Click outside backdrop to close */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => { if (!isSaving) onClose(); }} 
      />

      {/* Modal Dialog Card - Strictly centered horizontally & vertically */}
      <div className="relative w-full max-w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150 flex flex-col">
        
        {/* Minimalist Top Bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Edit Profil</h2>
            <p className="text-[11px] text-slate-500">Ubah foto atau nama tampilan</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Form Body */}
        <form onSubmit={handleSave} className="p-4 space-y-3.5">
          {error && (
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. COMPACT AVATAR PREVIEW + CAMERA BUTTON */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-600 shadow-sm bg-slate-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition group"
                title="Klik untuk upload foto"
              >
                {selectedAvatarUrl ? (
                  <img
                    src={selectedAvatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-slate-400" />
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Camera Badge Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Pilih foto dari galeri"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs border border-white flex items-center justify-center transition cursor-pointer"
              >
                {isUploading ? (
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                ) : (
                  <Camera className="w-2.5 h-2.5" />
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
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
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
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 2. FIVE PRESET AVATARS (MINIMALIST CIRCLE ROW) */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
              Atau Pilih Avatar:
            </label>

            <div className="flex items-center justify-center gap-2">
              {PRESET_AVATARS.map((avatar) => {
                const isSelected = selectedAvatarUrl === avatar.svgDataUri;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatarUrl(avatar.svgDataUri)}
                    title={avatar.name}
                    className={`relative w-8 h-8 rounded-full overflow-hidden transition active:scale-95 cursor-pointer shrink-0 border-2 ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500 ring-offset-1 scale-105'
                        : 'border-slate-200 hover:border-slate-400 bg-slate-50'
                    }`}
                  >
                    <img
                      src={avatar.svgDataUri}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-900/25 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. NAME & USERNAME FIELDS */}
          <div className="space-y-2.5 pt-0.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <AtSign className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="username_kamu"
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Minimalist Bottom Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
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
        </form>

      </div>
    </div>,
    document.body
  );
}
