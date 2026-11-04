"use client";

import React, { useState, useEffect } from "react";
import { PricingItem } from "@/lib/types";
import { DollarSign, Plus, Edit2, Trash2, Check, X, Filter } from "lucide-react";

export default function AdminHargaPage() {
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [newItem, setNewItem] = useState<Partial<PricingItem>>({
    category: "listrik",
    code: "",
    name: "",
    unit: "titik",
    basePrice: 50000,
    description: "",
    isAddon: false,
  });

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/admin/pricing");
      if (res.ok) {
        const data = await res.json();
        setPricing(data.pricing || []);
      }
    } catch (err) {
      console.error("Failed to load pricing", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        showSuccess("Item harga berhasil diperbarui!");
        setEditingItem(null);
        fetchPricing();
      }
    } catch (err) {
      console.error("Failed to update pricing item", err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        showSuccess("Item harga baru berhasil ditambahkan!");
        setIsCreating(false);
        setNewItem({
          category: "listrik",
          code: "",
          name: "",
          unit: "titik",
          basePrice: 50000,
          description: "",
          isAddon: false,
        });
        fetchPricing();
      }
    } catch (err) {
      console.error("Failed to create pricing item", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item harga ini?")) return;

    try {
      const res = await fetch(`/api/admin/pricing?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showSuccess("Item harga berhasil dihapus!");
        fetchPricing();
      }
    } catch (err) {
      console.error("Failed to delete pricing item", err);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filteredPricing =
    filterCategory === "all"
      ? pricing
      : pricing.filter((p) => p.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 font-heading">
            Manajemen Harga & Kalkulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar harga ini digunakan secara langsung oleh kalkulator estimasi dan basis data AI.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-accent hover:bg-orange-600 text-white shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item Harga</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["all", "listrik", "ac", "bor-sumur"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filterCategory === cat
                ? "bg-navy-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            {cat === "all" ? "Semua Kategori" : cat.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Pricing Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Item / Pekerjaan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Satuan</th>
                <th className="py-3 px-4">Harga Dasar</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPricing.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{item.name}</span>
                    <span className="text-[11px] text-slate-500">{item.description}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                      {item.category.replace("-", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{item.unit}</td>
                  <td className="py-3 px-4 font-bold text-navy-900">
                    Rp{item.basePrice.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4">
                    {item.isAddon ? (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">
                        Biaya Tambahan
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold">
                        Jasa Pokok
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingItem({ ...item })}
                        className="p-1.5 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-lg"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Hapus Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-navy-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base font-heading">
                {isCreating ? "Tambah Item Harga Baru" : "Edit Item Harga"}
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
              className="p-6 space-y-4 text-sm"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pekerjaan:
                </label>
                <input
                  type="text"
                  required
                  value={isCreating ? newItem.name : editingItem?.name}
                  onChange={(e) =>
                    isCreating
                      ? setNewItem({ ...newItem, name: e.target.value })
                      : editingItem && setEditingItem({ ...editingItem, name: e.target.value })
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
                    <option value="ac">Instalasi & Cuci AC</option>
                    <option value="bor-sumur">Bor Sumur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Satuan:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="titik, unit, meter, paket"
                    value={isCreating ? newItem.unit : editingItem?.unit}
                    onChange={(e) =>
                      isCreating
                        ? setNewItem({ ...newItem, unit: e.target.value })
                        : editingItem && setEditingItem({ ...editingItem, unit: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Harga Dasar (Rp):
                </label>
                <input
                  type="number"
                  required
                  value={isCreating ? newItem.basePrice : editingItem?.basePrice}
                  onChange={(e) =>
                    isCreating
                      ? setNewItem({ ...newItem, basePrice: parseInt(e.target.value) || 0 })
                      : editingItem &&
                        setEditingItem({ ...editingItem, basePrice: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Singkat:
                </label>
                <input
                  type="text"
                  value={isCreating ? newItem.description : editingItem?.description}
                  onChange={(e) =>
                    isCreating
                      ? setNewItem({ ...newItem, description: e.target.value })
                      : editingItem &&
                        setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={isCreating ? newItem.isAddon : editingItem?.isAddon}
                    onChange={(e) =>
                      isCreating
                        ? setNewItem({ ...newItem, isAddon: e.target.checked })
                        : editingItem &&
                          setEditingItem({ ...editingItem, isAddon: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
                  />
                  <span>Tandai sebagai Biaya Tambahan (Add-on opsional di kalkulator)</span>
                </label>
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
                  {isCreating ? "Tambah Item" : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
