"use client";

import React, { useState, useEffect } from "react";
import { ServiceItem } from "@/lib/types";
import { Wrench, Edit2, Plus, Trash2, Check, X, ShieldCheck } from "lucide-react";

export default function AdminLayananPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setEditingService(null);
        fetchServices();
      }
    } catch (err) {
      console.error("Failed to update service", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 font-heading">
            Manajemen Layanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola judul, deskripsi, foto, cakupan pekerjaan, dan harga dasar ketiga layanan utama.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Perubahan data layanan berhasil disimpan!</span>
        </div>
      )}

      {/* Services List Grid */}
      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold px-2.5 py-1 rounded-lg bg-navy-100 text-navy-900">
                  {service.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Slug: /{service.slug}
                </span>
              </div>
              <h3 className="text-xl font-bold text-navy-900 font-heading">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {service.shortDescription}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                <span>
                  Harga Mulai:{" "}
                  <strong className="text-navy-900">
                    Rp{service.startingPrice.toLocaleString("id-ID")}
                  </strong>
                </span>
                <span>•</span>
                <span>{service.jobTypes.length} Jenis Pekerjaan Terdaftar</span>
                <span>•</span>
                <span>Garansi: {service.warrantyInfo}</span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => setEditingService({ ...service })}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Layanan</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 bg-navy-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base font-heading">
                Edit Layanan: {editingService.title}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Layanan:
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Singkat (Ringkasan):
                </label>
                <textarea
                  rows={2}
                  value={editingService.shortDescription}
                  onChange={(e) =>
                    setEditingService({ ...editingService, shortDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Lengkap (Halaman Detail):
                </label>
                <textarea
                  rows={4}
                  value={editingService.fullDescription}
                  onChange={(e) =>
                    setEditingService({ ...editingService, fullDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Harga Mulai (Rp):
                  </label>
                  <input
                    type="number"
                    value={editingService.startingPrice}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        startingPrice: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimasi Waktu Pengerjaan:
                  </label>
                  <input
                    type="text"
                    value={editingService.estimatedTime}
                    onChange={(e) =>
                      setEditingService({ ...editingService, estimatedTime: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Foto Ilustrasi:
                </label>
                <input
                  type="text"
                  value={editingService.image}
                  onChange={(e) =>
                    setEditingService({ ...editingService, image: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-accent hover:bg-orange-600 text-white shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
