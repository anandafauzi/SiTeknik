"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GalleryItem } from "@/lib/types";
import { Image as ImageIcon, Plus, Edit2, Trash2, Check, X, MapPin, Calendar } from "lucide-react";

export default function AdminGaleriPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    title: "",
    category: "listrik",
    imageUrl: "",
    beforeImageUrl: "",
    afterImageUrl: "",
    jobType: "",
    location: "Serpong, Tangerang Selatan",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setGallery(data.gallery || []);
      }
    } catch (err) {
      console.error("Failed to fetch gallery", err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        showSuccess("Dokumentasi galeri baru berhasil ditambahkan!");
        setIsCreating(false);
        setNewItem({
          title: "",
          category: "listrik",
          imageUrl: "",
          beforeImageUrl: "",
          afterImageUrl: "",
          jobType: "",
          location: "Serpong, Tangerang Selatan",
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
        fetchGallery();
      }
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        showSuccess("Dokumentasi galeri berhasil diperbarui!");
        setEditingItem(null);
        fetchGallery();
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dokumentasi ini?")) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showSuccess("Dokumentasi galeri berhasil dihapus!");
        fetchGallery();
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 font-heading">
            Manajemen Galeri Dokumentasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola foto asli hasil pekerjaan teknisi, perbandingan sebelum/sesudah, dan lokasi di Tangsel.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-accent hover:bg-orange-600 text-white shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumentasi Foto</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative h-44 w-full bg-slate-100">
              <Image
                src={item.afterImageUrl || item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 bg-navy-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                {item.category.replace("-", " ")}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-navy-900 text-sm font-heading">{item.title}</h3>
                <p className="text-xs text-brand-accent font-semibold mt-0.5">{item.jobType}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-accent" />
                  <span className="truncate max-w-[120px]">{item.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingItem({ ...item })}
                className="p-1.5 text-slate-600 hover:text-navy-900 hover:bg-slate-200 rounded-lg"
                title="Edit Dokumentasi"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                title="Hapus Dokumentasi"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 bg-navy-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base font-heading">
                {isCreating ? "Tambah Dokumentasi Pekerjaan" : "Edit Dokumentasi"}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className="p-1 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isCreating ? handleCreate : handleUpdate}
              className="flex-1 overflow-y-auto p-6 space-y-4 text-sm"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Pekerjaan:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penggantian MCB Schneider Rumah 2 Lantai"
                  value={isCreating ? newItem.title : editingItem?.title}
                  onChange={(e) =>
                    isCreating
                      ? setNewItem({ ...newItem, title: e.target.value })
                      : editingItem && setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori:
                  </label>
                  <select
                    value={isCreating ? newItem.category : editingItem?.category}
                    onChange={(e) =>
                      isCreating
                        ? setNewItem({ ...newItem, category: e.target.value as any })
                        : editingItem && setEditingItem({ ...editingItem, category: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  >
                    <option value="listrik">Instalasi Listrik</option>
                    <option value="ac">Instalasi AC</option>
                    <option value="cuci-ac">Cuci AC</option>
                    <option value="bor-sumur">Bor Sumur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Spesifikasi Pekerjaan:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pasang 4 Group MCB"
                    value={isCreating ? newItem.jobType : editingItem?.jobType}
                    onChange={(e) =>
                      isCreating
                        ? setNewItem({ ...newItem, jobType: e.target.value })
                        : editingItem && setEditingItem({ ...editingItem, jobType: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Foto Utama / Hasil Akhir:
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... atau URL foto"
                  value={
                    isCreating
                      ? newItem.imageUrl || newItem.afterImageUrl
                      : editingItem?.imageUrl || editingItem?.afterImageUrl
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isCreating) {
                      setNewItem({ ...newItem, imageUrl: val, afterImageUrl: val });
                    } else if (editingItem) {
                      setEditingItem({ ...editingItem, imageUrl: val, afterImageUrl: val });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Foto Sebelum / Before (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="URL foto sebelum pengerjaan"
                  value={isCreating ? newItem.beforeImageUrl : editingItem?.beforeImageUrl}
                  onChange={(e) =>
                    isCreating
                      ? setNewItem({ ...newItem, beforeImageUrl: e.target.value })
                      : editingItem && setEditingItem({ ...editingItem, beforeImageUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lokasi Pekerjaan Tangsel:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BSD City, Serpong"
                    value={isCreating ? newItem.location : editingItem?.location}
                    onChange={(e) =>
                      isCreating
                        ? setNewItem({ ...newItem, location: e.target.value })
                        : editingItem && setEditingItem({ ...editingItem, location: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pengerjaan:
                  </label>
                  <input
                    type="date"
                    required
                    value={isCreating ? newItem.date : editingItem?.date}
                    onChange={(e) =>
                      isCreating
                        ? setNewItem({ ...newItem, date: e.target.value })
                        : editingItem && setEditingItem({ ...editingItem, date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Hasil Pengerjaan:
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan kendala awal pelanggan dan bagaimana teknisi menyelesaikannya..."
                  value={isCreating ? newItem.description : editingItem?.description}
                  onChange={(e) =>
                    isCreating
                      ? setNewItem({ ...newItem, description: e.target.value })
                      : editingItem && setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
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
                  {isCreating ? "Simpan Foto" : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
