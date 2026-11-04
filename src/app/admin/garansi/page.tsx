"use client";

import React, { useState, useEffect } from "react";
import { WarrantyPolicy } from "@/lib/types";
import { ShieldCheck, Edit2, Check, X, Plus, Trash2 } from "lucide-react";

export default function AdminGaransiPage() {
  const [warranties, setWarranties] = useState<WarrantyPolicy[]>([]);
  const [editingPolicy, setEditingPolicy] = useState<WarrantyPolicy | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchWarranties();
  }, []);

  const fetchWarranties = async () => {
    try {
      const res = await fetch("/api/admin/warranty");
      if (res.ok) {
        const data = await res.json();
        setWarranties(data.warranties || []);
      }
    } catch (err) {
      console.error("Failed to load warranties", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPolicy) return;

    try {
      const res = await fetch("/api/admin/warranty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPolicy),
      });

      if (res.ok) {
        setSuccessMsg("Kebijakan garansi berhasil diperbarui!");
        setTimeout(() => setSuccessMsg(""), 3000);
        setEditingPolicy(null);
        fetchWarranties();
      }
    } catch (err) {
      console.error("Failed to update warranty", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 font-heading">
          Manajemen Ketentuan Garansi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Atur durasi, butir cakupan garansi, syarat klaim, dan batasan pengecualian untuk ketiga kategori layanan.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Warranties Grid */}
      <div className="space-y-6">
        {warranties.map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900 text-lg font-heading">{w.title}</h3>
                  <span className="text-xs text-brand-accent font-semibold capitalize">
                    Layanan: {w.serviceCategory.replace("-", " ")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                  Durasi: {w.duration}
                </span>
                <button
                  onClick={() => setEditingPolicy({ ...w })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Garansi</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Cakupan Garansi:</h4>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4 text-xs">
                  {w.coverage.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Syarat & Klaim:</h4>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4 text-xs">
                  {w.claimTerms.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Pengecualian:</h4>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4 text-xs">
                  {w.exclusions.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPolicy && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 bg-navy-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base font-heading">
                Edit Garansi: {editingPolicy.title}
              </h3>
              <button
                onClick={() => setEditingPolicy(null)}
                className="p-1 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Garansi:
                </label>
                <input
                  type="text"
                  required
                  value={editingPolicy.title}
                  onChange={(e) =>
                    setEditingPolicy({ ...editingPolicy, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Durasi / Jangka Waktu Garansi:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 30 Hari Kalender / 90 Hari"
                  value={editingPolicy.duration}
                  onChange={(e) =>
                    setEditingPolicy({ ...editingPolicy, duration: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Butir Cakupan Garansi (Satu per baris):
                </label>
                <textarea
                  rows={4}
                  value={editingPolicy.coverage.join("\n")}
                  onChange={(e) =>
                    setEditingPolicy({
                      ...editingPolicy,
                      coverage: e.target.value.split("\n").filter((l) => l.trim() !== ""),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ketentuan & Cara Klaim (Satu per baris):
                </label>
                <textarea
                  rows={4}
                  value={editingPolicy.claimTerms.join("\n")}
                  onChange={(e) =>
                    setEditingPolicy({
                      ...editingPolicy,
                      claimTerms: e.target.value.split("\n").filter((l) => l.trim() !== ""),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hal-hal yang Tidak Ditanggung (Satu per baris):
                </label>
                <textarea
                  rows={4}
                  value={editingPolicy.exclusions.join("\n")}
                  onChange={(e) =>
                    setEditingPolicy({
                      ...editingPolicy,
                      exclusions: e.target.value.split("\n").filter((l) => l.trim() !== ""),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPolicy(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-accent hover:bg-orange-600 text-white shadow"
                >
                  Simpan Kebijakan Garansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
