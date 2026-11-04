"use client";

import React, { useState, useEffect } from "react";
import { KnowledgeItem, ChatbotConfig } from "@/lib/types";
import { Bot, Plus, Edit2, Trash2, Check, X, Sparkles, Key, HelpCircle } from "lucide-react";

export default function AdminChatbotPage() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(null);
  const [geminiKey, setGeminiKey] = useState("");
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [newItem, setNewItem] = useState<Partial<KnowledgeItem>>({
    category: "umum",
    topic: "",
    content: "",
    keywords: [],
  });

  useEffect(() => {
    fetchKnowledgeData();
    fetchSettings();
  }, []);

  const fetchKnowledgeData = async () => {
    try {
      const res = await fetch("/api/admin/knowledge");
      if (res.ok) {
        const data = await res.json();
        setKnowledge(data.knowledge || []);
        if (data.chatbotConfig) setChatbotConfig(data.chatbotConfig);
      }
    } catch (err) {
      console.error("Failed to load knowledge", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setGeminiKey(data.settings?.geminiApiKey || "");
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatbotConfig) return;

    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "config", config: chatbotConfig }),
      });

      // Also save Gemini API Key to settings
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiApiKey: geminiKey }),
      });

      if (res.ok) {
        showSuccess("Pengaturan chatbot & API Key berhasil disimpan!");
      }
    } catch (err) {
      console.error("Save config failed", err);
    }
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        showSuccess("Dokumen pengetahuan RAG baru berhasil ditambahkan!");
        setIsCreatingDoc(false);
        setNewItem({
          category: "umum",
          topic: "",
          content: "",
          keywords: [],
        });
        fetchKnowledgeData();
      }
    } catch (err) {
      console.error("Create doc failed", err);
    }
  };

  const handleUpdateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        showSuccess("Dokumen pengetahuan berhasil diperbarui!");
        setEditingItem(null);
        fetchKnowledgeData();
      }
    } catch (err) {
      console.error("Update doc failed", err);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm("Hapus dokumen pengetahuan ini dari basis data RAG?")) return;

    try {
      const res = await fetch(`/api/admin/knowledge?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showSuccess("Dokumen berhasil dihapus!");
        fetchKnowledgeData();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 font-heading">
          Manajemen Chatbot AI & Basis Pengetahuan RAG
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Chatbot AI SiTeknik mempelajari data dari basis pengetahuan ini untuk menjawab pertanyaan pelanggan secara cerdas dan akurat tanpa halusinasi.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Configuration Box */}
      {chatbotConfig && (
        <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-navy-900 font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span>Konfigurasi Respon & API Key Chatbot</span>
            </h2>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white transition-colors"
            >
              Simpan Pengaturan Chatbot
            </button>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teks Sapaan Otomatis (Saat widget dibuka pertama kali):
              </label>
              <textarea
                rows={2}
                value={chatbotConfig.greeting}
                onChange={(e) =>
                  setChatbotConfig({ ...chatbotConfig, greeting: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pertanyaan Cepat Populer (Quick Questions, pisahkan dengan koma):
                </label>
                <textarea
                  rows={3}
                  value={chatbotConfig.quickQuestions.join("\n")}
                  onChange={(e) =>
                    setChatbotConfig({
                      ...chatbotConfig,
                      quickQuestions: e.target.value.split("\n").filter((q) => q.trim() !== ""),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Google Gemini API Key (Opsional, untuk Model AI Eksternal):</span>
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy... (kosongkan untuk menggunakan built-in RAG engine)"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  *Sistem dilengkapi mesin RAG bawaan cerdas yang selalu aktif tanpa perlu API key berbayar.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Knowledge Base Header & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy-900 font-heading">
            Daftar Dokumen Pengetahuan Bisnis ({knowledge.length} Dokumen)
          </h2>
          <p className="text-xs text-slate-500">
            Informasi di bawah ini diambil oleh AI ketika pelanggan menanyakan topik terkait.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingDoc(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-accent hover:bg-orange-600 text-white shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumen RAG</span>
        </button>
      </div>

      {/* Knowledge Documents List */}
      <div className="space-y-4">
        {knowledge.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  {item.category}
                </span>
                <h3 className="font-bold text-navy-900 text-sm font-heading">{item.topic}</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {item.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setEditingItem({ ...item })}
                className="p-1.5 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg"
                title="Edit Dokumen"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDeleteDoc(item.id)}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                title="Hapus Dokumen"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Document Modal */}
      {(isCreatingDoc || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 bg-navy-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base font-heading">
                {isCreatingDoc ? "Tambah Dokumen Pengetahuan RAG" : "Edit Dokumen Pengetahuan"}
              </h3>
              <button
                onClick={() => {
                  setIsCreatingDoc(false);
                  setEditingItem(null);
                }}
                className="p-1 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isCreatingDoc ? handleCreateDoc : handleUpdateDoc}
              className="flex-1 overflow-y-auto p-6 space-y-4 text-sm"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topik / Pertanyaan:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Perbedaan Pompa Jet Pump vs Submersible di Tangsel"
                  value={isCreatingDoc ? newItem.topic : editingItem?.topic}
                  onChange={(e) =>
                    isCreatingDoc
                      ? setNewItem({ ...newItem, topic: e.target.value })
                      : editingItem && setEditingItem({ ...editingItem, topic: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Pengetahuan:
                </label>
                <select
                  value={isCreatingDoc ? newItem.category : editingItem?.category}
                  onChange={(e) =>
                    isCreatingDoc
                      ? setNewItem({ ...newItem, category: e.target.value as any })
                      : editingItem && setEditingItem({ ...editingItem, category: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs"
                >
                  <option value="listrik">Instalasi Listrik</option>
                  <option value="ac">Instalasi & Cuci AC</option>
                  <option value="bor-sumur">Pengeboran Sumur</option>
                  <option value="garansi">Ketentuan Garansi</option>
                  <option value="wilayah">Wilayah Pelayanan</option>
                  <option value="umum">Umum & Prosedur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Jawaban Fakta / Pengetahuan Bisnis:
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan jawaban atau panduan faktual yang akan dipelajari AI..."
                  value={isCreatingDoc ? newItem.content : editingItem?.content}
                  onChange={(e) =>
                    isCreatingDoc
                      ? setNewItem({ ...newItem, content: e.target.value })
                      : editingItem && setEditingItem({ ...editingItem, content: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Kunci Pencarian (Keywords, pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  placeholder="pompa, jet pump, submersible, sumur dalam, pamulang"
                  value={
                    isCreatingDoc
                      ? newItem.keywords?.join(", ")
                      : editingItem?.keywords.join(", ")
                  }
                  onChange={(e) => {
                    const kws = e.target.value.split(",").map((k) => k.trim().toLowerCase());
                    if (isCreatingDoc) {
                      setNewItem({ ...newItem, keywords: kws });
                    } else if (editingItem) {
                      setEditingItem({ ...editingItem, keywords: kws });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingDoc(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-accent hover:bg-orange-600 text-white shadow"
                >
                  {isCreatingDoc ? "Tambah Dokumen" : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

