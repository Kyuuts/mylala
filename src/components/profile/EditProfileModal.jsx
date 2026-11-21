import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Camera, Check, User, AtSign, AlertCircle, RefreshCw, Upload, RotateCcw, Sparkles, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PRESET_AVATARS, compressImageFile } from '../../utils/avatars';
import AiSettingsModal from '../ai/AiSettingsModal';

export default function EditProfileModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, updateProfile, aiConfig, logout } = useAppStore();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

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
    setSuccessMsg(null);
    setIsUploading(true);

    try {
      // Compress to compact universal JPEG (192x192 square crop, ~8-15KB)
      const compressedDataUrl = await compressImageFile(file, 192, 192);
      setSelectedAvatarUrl(compressedDataUrl);

      // Instant auto-save so user doesn't have to guess or manually click Save
      const cleanName = (name || user?.name || '').trim();
      const cleanUser = (username || user?.username || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (cleanName && cleanUser) {
        const res = await updateProfile({
          name: cleanName,
          username: cleanUser,
          avatarUrl: compressedDataUrl,
        });
        if (res.success) {
          setSuccessMsg('Foto profil berhasil di-upload & disimpan!');
        }
      }
    } catch (err) {
      console.error('Compress image failed:', err);
      setError(err.message || 'Gagal memproses gambar. Gunakan file JPG, PNG, atau WebP.');
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = '';
      }
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

  const handleLogoutFromModal = () => {
    logout();
    onClose();
    navigate('/login');
  };

  // Render directly to document.body via Portal to escape any parent sticky/backdrop-blur containing blocks
  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/75 p-4 flex items-center justify-center animate-in fade-in duration-150">
      
      {/* Click outside backdrop to close */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => { if (!isSaving) onClose(); }} 
      />

      {/* Modal Dialog Card - Neo-Brutalism Theme */}
      <div className="relative w-full max-w-[360px] bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] overflow-hidden my-auto animate-in zoom-in-95 duration-150 flex flex-col">
        
        {/* Minimalist Top Bar */}
        <div className="px-5 py-3.5 border-b-2.5 border-black flex items-center justify-between shrink-0 bg-[#FF85C0] text-black">
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight text-black">Edit Profil</h2>
            <p className="text-[11px] font-bold text-black/70">Ubah foto atau nama tampilan</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black flex items-center justify-center transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Compact Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-100 border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 stroke-[2.5]" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-[#80ED99] border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-black flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. COMPACT AVATAR PREVIEW + DIRECT NATIVE FILE INPUT */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group cursor-pointer">
              {/* Visual Avatar */}
              <div 
                className="w-16 h-16 rounded-2xl overflow-hidden border-2.5 border-black shadow-[3px_3px_0px_#000] bg-[#D4F63D] flex items-center justify-center hover:opacity-90 transition"
              >
                {selectedAvatarUrl ? (
                  <img
                    src={selectedAvatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-black stroke-[2.5]" />
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Camera className="w-5 h-5 text-white stroke-[2.5]" />
                </div>
              </div>

              {/* Camera Badge Trigger */}
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-xl bg-[#FFD166] text-black shadow-[1.5px_1.5px_0px_#000] border-2 border-black flex items-center justify-center pointer-events-none"
              >
                {isUploading ? (
                  <RefreshCw className="w-3 h-3 animate-spin stroke-[2.5]" />
                ) : (
                  <Camera className="w-3 h-3 stroke-[2.5]" />
                )}
              </div>

              {/* Unclipped native input directly covering the entire circle */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                aria-label="Pilih foto profil"
                onChange={handleFileChange}
                disabled={isUploading || isSaving}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
              />
            </div>

            {/* Upload / Reset Quick Actions */}
            <div className="flex items-center gap-2 mt-2.5 text-[11px]">
              <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-black font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer">
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isUploading ? 'Mengompres...' : 'Pilih Foto dari HP'}</span>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload Foto"
                  onChange={handleFileChange}
                  disabled={isUploading || isSaving}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                />
              </div>

              {selectedAvatarUrl && (
                <>
                  <span className="text-black font-black">•</span>
                  <button
                    type="button"
                    onClick={async () => {
                      setSelectedAvatarUrl('');
                      if (user) {
                        await updateProfile({
                          name: user.name,
                          username: user.username,
                          avatarUrl: null,
                        });
                        setSuccessMsg('Foto profil dihapus.');
                      }
                    }}
                    disabled={isUploading || isSaving}
                    className="inline-flex items-center gap-1 text-black hover:text-rose-600 transition cursor-pointer px-2 py-1 rounded-lg border-2 border-black bg-white shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 font-bold"
                  >
                    <RotateCcw className="w-2.5 h-2.5 stroke-[2.5]" />
                    <span>Hapus</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 2. FIVE PRESET AVATARS */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-black uppercase tracking-wider text-center">
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
                    className={`relative w-9 h-9 rounded-xl overflow-hidden transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0 border-2 border-black ${
                      isSelected
                        ? 'bg-[#D4F63D] shadow-[2px_2px_0px_#000]'
                        : 'hover:bg-slate-100 bg-white shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    <img
                      src={avatar.svgDataUri}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. NAME & USERNAME FIELDS */}
          <div className="space-y-3 pt-0.5">
            <div>
              <label className="block text-[11px] font-black uppercase text-black mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <User className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#D4F63D]/10 bg-white text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-black mb-1">
                Username Akun
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <AtSign className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="username_kamu"
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-[#D4F63D]/10 bg-white text-black"
                />
              </div>
            </div>

            {/* AI Assistant Quick Config */}
            <div className="p-2.5 rounded-2xl bg-[#FFD166]/30 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#D4F63D] border-2 border-black shadow-[1.5px_1.5px_0px_#000] text-black flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-black">Asisten Lala AI</span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-black text-white">
                      {aiConfig?.provider ? aiConfig.provider.toUpperCase() : 'GROQ'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-black/70">
                    {aiConfig?.status === 'ready' ? '🟢 Terhubung & Siap' : '⚡ Kelola API Key gratis'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 text-black text-[11px] font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
              >
                Konfigurasi
              </button>
            </div>
          </div>

          {/* Minimalist Bottom Actions with Mobile Logout Support */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t-2 border-black">
            <button
              type="button"
              onClick={handleLogoutFromModal}
              title="Keluar dari akun Anda di perangkat ini"
              className="px-3 py-2 rounded-xl text-xs font-black bg-rose-200 hover:bg-rose-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Keluar</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-3 py-2 rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="px-3.5 py-2 rounded-xl bg-[#D4F63D] hover:bg-[#c2e42f] text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin stroke-[2.5]" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Simpan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>

      {/* Lala AI Settings Sub-Modal */}
      <AiSettingsModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>,
    document.body
  );
}
