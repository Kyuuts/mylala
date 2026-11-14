import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Eye, Edit3, Sparkles, FileText, Upload, AlertCircle, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MarkdownViewer from '../components/modules/MarkdownViewer';

export default function CreateModulePage() {
  const navigate = useNavigate();
  const createCustomModule = useAppStore((state) => state.createCustomModule);

  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'bulk'
  const [category, setCategory] = useState('Grammar');
  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [formError, setFormError] = useState(null);

  // Flashcards state
  const [flashcards, setFlashcards] = useState([
    { front_text: '', back_text: '', example_sentence: '' },
  ]);

  // Bulk Import state
  const [bulkText, setBulkText] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddCard = () => {
    setFlashcards((prev) => [
      ...prev,
      { front_text: '', back_text: '', example_sentence: '' },
    ]);
  };

  const handleRemoveCard = (index) => {
    if (flashcards.length === 1) return;
    setFlashcards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCardChange = (index, field, value) => {
    setFlashcards((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Parse bulk text: "Front | Back | Example" per line
  const handleParseBulk = () => {
    setBulkError('');
    if (!bulkText.trim()) {
      setBulkError('Masukkan teks flashcard terlebih dahulu.');
      return;
    }

    try {
      // Check if user pasted JSON
      if (bulkText.trim().startsWith('[') && bulkText.trim().endsWith(']')) {
        const parsed = JSON.parse(bulkText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((item) => ({
            front_text: item.front_text || item.front || '',
            back_text: item.back_text || item.back || '',
            example_sentence: item.example_sentence || item.example || '',
          }));
          setFlashcards(formatted);
          setActiveTab('manual');
          return;
        }
      }

      // Parse line-by-line: "Front | Back | Example" or Tab-delimited
      const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);
      const newCards = [];

      for (const line of lines) {
        let parts = line.split('|');
        if (parts.length < 2) {
          parts = line.split('\t'); // Try tab separator
        }

        if (parts.length >= 2) {
          newCards.push({
            front_text: parts[0]?.trim() || '',
            back_text: parts[1]?.trim() || '',
            example_sentence: parts[2]?.trim() || '',
          });
        }
      }

      if (newCards.length === 0) {
        setBulkError('Format tidak dikenali. Gunakan format: Depan | Belakang | Contoh Kalimat');
        return;
      }

      setFlashcards(newCards);
      setActiveTab('manual');
    } catch (e) {
      setBulkError('Gagal memproses data bulk: ' + e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError(null);

    if (!title.trim()) {
      setFormError('Judul modul wajib diisi sebelum menyimpan!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Filter valid cards
    const validCards = flashcards.filter(
      (c) => c.front_text.trim() && c.back_text.trim()
    );

    if (validCards.length === 0) {
      setFormError('Tambahkan minimal 1 flashcard dengan Sisi Depan dan Sisi Belakang terisi!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      const defaultMarkdown =
        markdownContent.trim() ||
        `# ${title.trim()}\n\n## Rangkuman Materi\nMateri pembelajaran aktif 1 halaman untuk kategori **${category}**.\n\n### Poin Kunci\n* Silakan pelajari kartu flashcard yang terpasang di bawah untuk menguji retensi memori Anda.`;

      const result = await createCustomModule({
        moduleData: {
          category,
          title: title.trim(),
          content_markdown: defaultMarkdown,
        },
        flashcardsData: validCards,
      });

      if (result.success) {
        navigate(`/module/${result.moduleId}`);
      }
    } catch (err) {
      setFormError('Gagal menyimpan modul: ' + err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-2">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-indigo-600" />
          <span>Buat Modul &amp; Flashcard Baru</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Tambahkan ringkasan materi 1 halaman dan kartu active recall khusus untuk target belajar Anda.
        </p>
      </div>

      {/* In-app Validation Error Banner */}
      {formError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
          <button
            type="button"
            onClick={() => setFormError(null)}
            className="p-1 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Module Metadata Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Informasi Dasar Modul
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Grammar">Grammar (Tata Bahasa)</option>
                <option value="Vocab">Vocab (Kosakata/Idiom)</option>
                <option value="Templates">Templates (Percakapan)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Judul Modul</label>
              <input
                type="text"
                placeholder="Contoh: Collocations with 'Make' and 'Do'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {/* Markdown Content Editor */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Isi Cheat Sheet (Markdown 1 Halaman)</span>
              </label>

              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isPreview ? 'Edit Teks' : 'Pratinjau'}</span>
              </button>
            </div>

            {isPreview ? (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 min-h-[160px]">
                <MarkdownViewer
                  content={
                    markdownContent ||
                    '*Belum ada teks markdown. Klik tombol "Edit Teks" untuk menulis rumus dan tips.*'
                  }
                />
              </div>
            ) : (
              <textarea
                rows={6}
                placeholder="# Judul Rangkuman&#10;&#10;## 1. Aturan Penggunaan&#10;* Poin 1...&#10;* Poin 2...&#10;&#10;| Kolom 1 | Kolom 2 |&#10;| --- | --- |&#10;| Make | A mistake |"
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 leading-relaxed"
              ></textarea>
            )}
            <p className="text-[11px] text-slate-400">
              Mendukung format heading (#), tabel (| a | b |), poin (*), dan teks tebal (**tebal**).
            </p>
          </div>
        </div>

        {/* Flashcards Builder Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                2. Kartu Flashcard Active Recall ({flashcards.length})
              </h2>
              <p className="text-xs text-slate-500">Pasangan pertanyaan bahasa Inggris dan terjemahan bahasa Indonesia.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'manual' ? 'bulk' : 'manual')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>{activeTab === 'manual' ? 'Import Cepat (Bulk)' : 'Mode Manual'}</span>
              </button>
            </div>
          </div>

          {/* BULK IMPORT VIEW */}
          {activeTab === 'bulk' && (
            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 space-y-3 animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Paste / Tempel Kartu Sekaligus
              </h3>
              <p className="text-xs text-slate-600">
                Format per baris: <code>Depan (English) | Belakang (Arti) | Contoh Kalimat</code> (atau format JSON Array).
              </p>
              <textarea
                rows={5}
                placeholder="Make a decision | Mengambil keputusan | She finally made a decision.&#10;Do your best | Lakukan yang terbaik | Always do your best in exams."
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              ></textarea>

              {bulkError && <p className="text-xs text-rose-600 font-semibold">{bulkError}</p>}

              <button
                type="button"
                onClick={handleParseBulk}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-700 transition"
              >
                Konversi Menjadi Kartu
              </button>
            </div>
          )}

          {/* MANUAL LIST VIEW */}
          <div className="space-y-4">
            {flashcards.map((card, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100/60 px-2.5 py-0.5 rounded-full">
                    Kartu #{idx + 1}
                  </span>

                  {flashcards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Sisi Depan (English Active Recall) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Call off"
                      value={card.front_text}
                      onChange={(e) => handleCardChange(idx, 'front_text', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Sisi Belakang (Arti / Penjelasan) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Membatalkan (Cancel)"
                      value={card.back_text}
                      onChange={(e) => handleCardChange(idx, 'back_text', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">
                    Contoh Kalimat / Konteks (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The meeting was called off due to heavy snow."
                    value={card.example_sentence}
                    onChange={(e) => handleCardChange(idx, 'example_sentence', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddCard}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Tambah Kartu Berikutnya
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{submitting ? 'Menyimpan...' : 'Simpan Modul & Flashcards'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

