import React from "react";
import { getDb } from "@/lib/db";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { Camera, ShieldCheck, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galeri Dokumentasi Pekerjaan Asli di Tangerang Selatan — SiTeknik",
  description:
    "Dokumentasi asli hasil pekerjaan teknisi SiTeknik: Instalasi listrik, panel MCB, cuci dan pemasangan AC, serta pengeboran sumur di BSD City, Bintaro, Pamulang, Ciputat, dan sekitarnya.",
};

export default function GalleryPage() {
  const db = getDb();
  const galleryItems = db.gallery;

  return (
    <div className="pt-24 pb-20 bg-white">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800 text-brand-accent text-xs font-bold border border-brand-accent/30">
            <Camera className="w-4 h-4" />
            <span>Dokumentasi Nyata Lapangan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading">
            Galeri & Bukti Pengerjaan Teknisi
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Kumpulan dokumentasi foto sebelum, proses, dan hasil akhir pekerjaan teknisi SiTeknik di berbagai perumahan dan properti wilayah Tangerang Selatan.
          </p>
        </div>
      </section>

      {/* Grid Container */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryGrid initialItems={galleryItems} />
      </section>
    </div>
  );
}

