import React from "react";
import { getDb } from "@/lib/db";
import HeroSection from "@/components/home/HeroSection";
import AdvantagesSection from "@/components/home/AdvantagesSection";
import ServicesSummary from "@/components/home/ServicesSummary";
import CoverageAreasSection from "@/components/home/CoverageAreasSection";
import WarrantyHighlight from "@/components/home/WarrantyHighlight";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CalculatorContainer from "@/components/calculator/CalculatorContainer";
import Link from "next/link";
import { Calculator, ArrowRight, ShieldAlert, PhoneCall } from "lucide-react";

export const metadata = {
  title: "SiTeknik Tangerang Selatan — Jasa Instalasi Listrik, AC & Bor Sumur Bergaransi",
  description:
    "Layanan panggilan teknisi rumah profesional di Tangerang Selatan: Instalasi listrik standar SNI, servis & cuci AC bersih, dan pengeboran sumur air bersih. Melayani Ciputat, Pamulang, Bintaro, BSD City, Serpong.",
};

export default function HomePage() {
  const db = getDb();
  const settings = db.settings;
  const services = db.services;

  const waEmergencyUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Halo Admin SiTeknik, saya butuh bantuan teknisi darurat untuk penanganan kelistrikan / AC di wilayah Tangerang Selatan."
  )}`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection
        headline={settings.heroHeadline}
        subheadline={settings.heroSubheadline}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* 2. Keunggulan Layanan */}
      <AdvantagesSection />

      {/* 3. Ringkasan Layanan Utama */}
      <ServicesSummary services={services} whatsappNumber={settings.whatsappNumber} />

      {/* 4. Interactive Cost Estimator Quick Teaser */}
      <section className="py-20 bg-slate-100/70 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
              Kalkulator Online
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-3 font-heading">
              Hitung Perkiraan Biaya Sebelum Memesan
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
              Cek estimasi biaya instalasi listrik, cuci/pasang AC, atau pengeboran sumur secara transparan berdasarkan harga database resmi kami.
            </p>
          </div>

          <CalculatorContainer
            initialServiceAreas={settings.serviceAreas}
            whatsappNumber={settings.whatsappNumber}
          />
        </div>
      </section>

      {/* 5. Jaminan Garansi Resmi */}
      <WarrantyHighlight />

      {/* 6. Wilayah Pelayanan Tangerang Selatan */}
      <CoverageAreasSection whatsappNumber={settings.whatsappNumber} />

      {/* 7. Ulasan Pelanggan Tangsel */}
      <TestimonialsSection />

      {/* 8. Emergency / Quick Consultation Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full">
            <ShieldAlert className="w-4 h-4" />
            <span>Panggilan Siaga Tangerang Selatan</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading max-w-2xl mx-auto leading-tight">
            Butuh Teknisi Datang Hari Ini ke Rumah Anda?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Sampaikan kendala instalasi listrik, AC kurang dingin, atau masalah air sumur Anda sekarang. Admin kami siap membantu penjadwalan tercepat.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waEmergencyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm bg-brand-accent hover:bg-orange-600 text-white shadow-xl shadow-brand-accent/30 transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Chat WhatsApp Admin Sekarang</span>
            </a>

            <Link
              href="/galeri"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm bg-navy-800 hover:bg-navy-700 text-white border border-slate-700 transition-colors"
            >
              <span>Lihat Bukti Dokumentasi Pekerjaan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

