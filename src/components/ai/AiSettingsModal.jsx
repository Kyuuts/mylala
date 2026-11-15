import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Server,
  Zap,
  ShieldCheck,
  Check,
  Globe,
  Sliders,
  ChevronDown,
  ChevronUp,
  Cpu,
  BookOpen,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AI_PROVIDERS } from '../../services/aiService';

export default function AiSettingsModal({ isOpen, onClose }) {
  const user = useAppStore((state) => state.user);
  const aiConfig = useAppStore((state) => state.aiConfig);
  const systemAiConfig = useAppStore((state) => state.systemAiConfig);
  const setAiConfig = useAppStore((state) => state.setAiConfig);
  const testAiConnection = useAppStore((state) => state.testAiConnection);
  const saveGlobalAiConfigToSupabase = useAppStore((state) => state.saveGlobalAiConfigToSupabase);

  const isAdmin =
    user?.role === 'admin' ||
    (user?.username || '').toLowerCase() === 'kyuut' ||
    (user?.username || '').toLowerCase() === 'imam';

  // Local form state
  const [provider, setProvider] = useState('groq');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('llama-3.3-70b-versatile');
  const [baseUrl, setBaseUrl] = useState('https://api.groq.com/openai/v1');
  const [isEnabled, setIsEnabled] = useState(true);
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Testing & Save feedback
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success, latencyMs, reply, error }
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      const activeKeySource = isAdmin ? systemAiConfig : aiConfig;
      const initialProvider = activeKeySource?.provider || systemAiConfig?.provider || 'groq';
      const providerInfo = AI_PROVIDERS[initialProvider] || AI_PROVIDERS.groq;

      setProvider(initialProvider);
      setApiKey((isAdmin ? systemAiConfig?.apiKey : aiConfig?.apiKey) || '');
      setModel(activeKeySource?.model || systemAiConfig?.model || providerInfo.defaultModel);
      setBaseUrl(activeKeySource?.baseUrl || systemAiConfig?.baseUrl || providerInfo.baseUrl);
      setIsEnabled(aiConfig?.isEnabled !== undefined ? aiConfig.isEnabled : true);
      setUseCustomKey(Boolean(aiConfig?.useCustomKey));
      setTestResult(null);
      setIsSaved(false);
      setIsSaving(false);
      setIsTesting(false);
    }
  }, [isOpen, aiConfig, systemAiConfig, isAdmin]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isTesting && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isTesting, isSaving, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const currentProviderInfo = AI_PROVIDERS[provider] || AI_PROVIDERS.custom;
  const isGlobalKeyAvailable = Boolean(systemAiConfig?.apiKey);
  const hasActiveKey = isGlobalKeyAvailable || Boolean(aiConfig?.apiKey);

  // Provider change handler
  const handleSelectProvider = (newProvider) => {
    const info = AI_PROVIDERS[newProvider] || AI_PROVIDERS.custom;
    setProvider(newProvider);
    setBaseUrl(info.baseUrl);
    setModel(info.defaultModel);
    setTestResult(null);
  };

  // Test connection handler
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const targetConfig = {
      provider,
      apiKey: apiKey.trim(),
      model: model.trim(),
      baseUrl: baseUrl.trim(),
      isEnabled: true,
    };

    try {
      const res = await testAiConnection(targetConfig);
      setTestResult(res);
    } catch (err) {
      setTestResult({
        success: false,
        error: err.message || 'Gagal terhubung ke penyedia AI',
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Save changes
  const handleSave = async (e) => {
    e?.preventDefault();
    setIsSaving(true);

    try {
      if (isAdmin) {
        // Admin saves centrally to Supabase Cloud so all users get it automatically!
        await saveGlobalAiConfigToSupabase({
          provider,
          apiKey: apiKey.trim(),
          model: model.trim(),
          baseUrl: baseUrl.trim(),
        });
      } else {
        // Regular user saves their preference
        setAiConfig({
          isEnabled,
          useCustomKey,
          ...(useCustomKey
            ? {
                provider,
                apiKey: apiKey.trim(),
                model: model.trim(),
                baseUrl: baseUrl.trim(),
              }
            : {}),
        });
      }

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsSaving(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error('Save failed:', err);
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  {isAdmin ? 'Pengaturan Lala AI (Admin Master Panel) 👑' : 'Asisten Belajar Lala AI ⚡'}
                </h3>
              </div>
              <p className="text-[11px] text-indigo-100 leading-tight">
                {isAdmin
                  ? 'Konfigurasikan Kunci API Terpusat untuk Semua Siswa'
                  : 'Bantuan Pintar Terjemahan & Tata Bahasa Otomatis'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status Box for Regular Users */}
          {!isAdmin && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                hasActiveKey
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  hasActiveKey ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                {hasActiveKey ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-xs block">
                  {hasActiveKey
                    ? '🟢 Lala AI Siap Digunakan (Disediakan oleh MyLala)'
                    : '⏳ Menunggu Konfigurasi Admin'}
                </span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {hasActiveKey
                    ? 'Fitur kecerdasan buatan telah disediakan langsung oleh sistem MyLala. Kamu tidak perlu memasukkan kunci atau melakukan registrasi apapun!'
                    : 'Lala AI sedang disiapkan oleh pengelola aplikasi. Segera aktif untuk membantumu belajar.'}
                </p>
              </div>
            </div>
          )}

          {/* Master Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="block font-bold text-slate-800 text-xs sm:text-sm">
                Aktifkan Asisten Lala AI
              </span>
              <span className="block text-[11px] text-slate-500">
                Tampilkan tombol tanya Lala AI pada Flashcard dan Latihan
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Capabilities Highlights for Users */}
          {!isAdmin && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col items-center text-center">
                <Zap className="w-4 h-4 text-amber-500 mb-1" />
                <span className="font-bold text-slate-800 text-[11px]">Respon Instan</span>
                <span className="text-[10px] text-slate-500">Ditenagai model ultra-cepat</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col items-center text-center">
                <BookOpen className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="font-bold text-slate-800 text-[11px]">Sesuai Level</span>
                <span className="text-[10px] text-slate-500">
                  Adaptif level {user?.cefrLevel || 'A1'} kamu
                </span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col items-center text-center">
                <Sparkles className="w-4 h-4 text-purple-600 mb-1" />
                <span className="font-bold text-slate-800 text-[11px]">Contoh Kalimat</span>
                <span className="text-[10px] text-slate-500">Percakapan natural sehari-hari</span>
              </div>
            </div>
          )}

          {/* ADMIN MASTER PANEL / ADVANCED USER FORM */}
          {(isAdmin || showAdvanced) && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {isAdmin && (
                <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-indigo-900 leading-snug">
                    <strong>Pusat Konfigurasi Admin:</strong> Kunci yang Anda simpan di sini akan otomatis disinkronkan ke <strong>Supabase Cloud</strong> sehingga <strong>SEMUA</strong> pengguna MyLala di perangkat mana pun dapat langsung menggunakan Lala AI tanpa registrasi.
                  </p>
                </div>
              )}

              {!isAdmin && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100">
                  <span className="text-[11px] font-bold text-slate-700">
                    Gunakan API Key Pribadi Saya Sendiri
                  </span>
                  <input
                    type="checkbox"
                    checked={useCustomKey}
                    onChange={(e) => setUseCustomKey(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
              )}

              {(isAdmin || useCustomKey) && (
                <>
                  {/* Provider Selection */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Pilih Penyedia AI:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(AI_PROVIDERS).map((p) => {
                        const isSelected = provider === p.id;
                        return (
                          <button
                            type="button"
                            key={p.id}
                            onClick={() => handleSelectProvider(p.id)}
                            className={`p-2.5 rounded-xl border text-left transition relative cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span className="font-extrabold text-slate-900 text-xs">
                                {p.name}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 line-clamp-1">
                              {p.tag}
                            </span>
                            {p.id === 'groq' && (
                              <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-black text-amber-700 bg-amber-100/90 px-1.5 py-0.5 rounded-md w-fit">
                                <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                Tercepat & Gratis
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-500 italic">
                      {currentProviderInfo.freeTierInfo}
                    </p>
                  </div>

                  {/* API Key Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">
                        API Key {currentProviderInfo.name}
                      </label>
                      {currentProviderInfo.keyUrl && (
                        <a
                          href={currentProviderInfo.keyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          <span>Dapatkan Kunci Gratis</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Key className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          setTestResult(null);
                        }}
                        placeholder={currentProviderInfo.keyPlaceholder}
                        className="w-full pl-8 pr-9 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Model Selection */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Model LLM
                    </label>
                    {currentProviderInfo.models && currentProviderInfo.models.length > 0 ? (
                      <select
                        value={model}
                        onChange={(e) => {
                          setModel(e.target.value);
                          setTestResult(null);
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60 text-slate-800"
                      >
                        {currentProviderInfo.models.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => {
                          setModel(e.target.value);
                          setTestResult(null);
                        }}
                        placeholder="Contoh: llama3, mistral, deepseek-r1"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60 font-mono"
                      />
                    )}
                  </div>

                  {/* Custom Base URL (Visible for Custom or advanced users) */}
                  {provider === 'custom' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Custom API Base URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                          <Server className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={baseUrl}
                          onChange={(e) => {
                            setBaseUrl(e.target.value);
                            setTestResult(null);
                          }}
                          placeholder="http://localhost:11434/v1"
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Test Connection Button & Result */}
                  <div className="pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTesting || (!apiKey && currentProviderInfo.requiresKey)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 active:scale-95 text-indigo-700 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                      >
                        {isTesting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Menguji Koneksi...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Uji Koneksi AI</span>
                          </>
                        )}
                      </button>

                      <span className="text-[11px] text-slate-400">
                        {isAdmin ? 'Uji respon sebelum disebarkan ke siswa' : 'Verifikasi API Key'}
                      </span>
                    </div>

                    {/* Test Result Banner */}
                    {testResult && (
                      <div
                        className={`mt-2.5 p-2.5 rounded-xl border flex items-start gap-2 ${
                          testResult.success
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}
                      >
                        {testResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div className="text-[11px] leading-tight space-y-0.5">
                          <p className="font-bold">
                            {testResult.success ? 'Koneksi Berhasil!' : 'Koneksi Gagal'}
                          </p>
                          <p>
                            {testResult.success
                              ? `Model ${testResult.model || model} merespon dengan lancar (Latency: ${testResult.latencyMs || 0}ms).`
                              : testResult.error}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Collapsible Trigger for Regular Users */}
          {!isAdmin && (
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full pt-2 text-slate-400 hover:text-slate-600 transition text-[11px] cursor-pointer"
            >
              <span>Opsi Lanjutan / Pengembang (Custom Key)</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Modal Bottom Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || isTesting}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="submit"
              disabled={isTesting || isSaving}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{isAdmin ? 'Tersimpan & Tersebar!' : 'Tersimpan!'}</span>
                </>
              ) : isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan ke Cloud...</span>
                </>
              ) : isAdmin ? (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span>Simpan & Terapkan ke Semua Pengguna</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simpan Pengaturan</span>
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
