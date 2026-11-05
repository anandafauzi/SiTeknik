"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GalleryItem } from "@/lib/types";
import { MapPin, Calendar, ZoomIn, Eye, Sparkles, Filter, X } from "lucide-react";

interface GalleryGridProps {
  initialItems: GalleryItem[];
  whatsappNumber?: string;
}

export default function GalleryGrid({
  initialItems,
  whatsappNumber = "6281234567890",
}: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);
  const [activeCompareMode, setActiveCompareMode] = useState<"after" | "before">("after");

  const categories = [
    { id: "all", label: "Semua Kategori" },
    { id: "listrik", label: "Instalasi Listrik" },
    { id: "ac", label: "Instalasi AC" },
    { id: "cuci-ac", label: "Cuci AC" },
    { id: "bor-sumur", label: "Bor Sumur" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? initialItems
      : initialItems.filter((item) => item.category === selectedCategory);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === cat.id
                ? "bg-navy-900 text-white shadow-md shadow-navy-900/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setActiveModalItem(item);
              setActiveCompareMode("after");
            }}
            className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
          >
            {/* Image Frame */}
            <div className="relative h-56 w-full overflow-hidden bg-slate-100">
              <Image
                src={item.afterImageUrl || item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 bg-navy-900/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                <span className="capitalize">{item.category.replace("-", " ")}</span>
              </div>

              {item.beforeImageUrl && (
                <div className="absolute top-3 right-3 bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Before / After
                </div>
              )}

              {/* Hover overlay hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <span className="inline-flex items-center gap-1.5 bg-white text-navy-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Lihat Dokumentasi
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-navy-900 text-base font-heading group-hover:text-brand-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-accent font-semibold mt-1">
                  {item.jobType}
                </p>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                  <span className="truncate max-w-[150px]">{item.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 shrink-0" />
                  {item.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-16 text-center text-slate-500">
          Belum ada dokumentasi untuk kategori ini.
        </div>
      )}

      {/* Modal Zoom & Before/After Comparison */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-navy-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base sm:text-lg font-heading">
                  {activeModalItem.title}
                </h3>
                <p className="text-xs text-slate-300">{activeModalItem.jobType}</p>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Before/After Toggle if present */}
              {activeModalItem.beforeImageUrl && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <button
                    onClick={() => setActiveCompareMode("before")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeCompareMode === "before"
                        ? "bg-amber-500 text-white shadow"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Foto Sebelum (Before)
                  </button>
                  <button
                    onClick={() => setActiveCompareMode("after")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeCompareMode === "after"
                        ? "bg-emerald-600 text-white shadow"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Foto Hasil Akhir (After)
                  </button>
                </div>
              )}

              {/* Main Photo Frame */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900">
                <Image
                  src={
                    activeCompareMode === "before" && activeModalItem.beforeImageUrl
                      ? activeModalItem.beforeImageUrl
                      : activeModalItem.afterImageUrl || activeModalItem.imageUrl
                  }
                  alt={activeModalItem.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Details & Specs */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                  <span className="flex items-center gap-1 font-semibold text-navy-900">
                    <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                    Lokasi: {activeModalItem.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Tanggal Pengerjaan: {activeModalItem.date}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed pt-1">
                  {activeModalItem.description}
                </p>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Tertarik dengan pekerjaan serupa untuk rumah Anda?
              </span>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Halo Admin SiTeknik, saya melihat dokumentasi "${activeModalItem.title}" di ${activeModalItem.location}. Saya ingin menanyakan layanan yang sama untuk rumah saya.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-accent hover:bg-orange-600 text-white shadow transition-colors"
              >
                <span>Pesan Layanan Serupa via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

