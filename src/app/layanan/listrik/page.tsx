import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/lib/db";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  Check,
  AlertTriangle,
  ArrowRight,
  Calculator,
} from "lucide-react";

export const metadata = {
  title: "Jasa Instalasi Listrik Tangerang Selatan Bergaransi — SiTeknik",
  description:
    "Jasa teknisi listrik panggilan terpercaya di Tangerang Selatan. Pasang titik lampu, stop kontak, MCB, penggantian kabel SNI, dan perbaikan korsleting bergaransi 30-90 hari.",
};

export default function ElectricityServicePage() {
  const db = getDb();
  const service = db.services.find((s) => s.category === "listrik") || db.services[0];
  const warranty = db.warranties.find((w) => w.serviceCategory === "listrik");
  const whatsappNumber = db.settings.whatsappNumber;

  const waBookingUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Halo Admin SiTeknik, saya ingin memesan Layanan Instalasi Listrik untuk wilayah Tangerang Selatan.\n\nDetail Pekerjaan: [Sebutkan jenis pekerjaan, misal: Tambah titik lampu / Ganti MCB]\nLokasi: [Alamat/Kecamatan]\n\nMohon informasi jadwal teknisi dan konfirmasi lebih lanjut. Terima kasih."
  )}`;

  return (
    <div className="pt-24 pb-20">
      {/* Hero Service Header */}
      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-accent mb-3">
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/#layanan" className="hover:underline">
              Layanan
            </Link>
            <span>/</span>
            <span>Instalasi Listrik</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-accent/20 text-brand-accent text-xs font-bold border border-brand-accent/30">
                <Zap className="w-4 h-4" />
                <span>Standar Keamanan SNI & PUIL</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white leading-tight">
                {service.title}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {service.fullDescription}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Garansi hingga 90 Hari
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-brand-accent" />
                  Estimasi Pengerjaan: {service.estimatedTime}
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <a
                href={waBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-accent to-orange-500 text-white shadow-xl shadow-brand-accent/30 hover:from-orange-500 hover:to-orange-600 transition-all text-center"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Pesan Jasa Listrik via WhatsApp</span>
              </a>

              <Link
                href="/kalkulator"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-navy-800 hover:bg-navy-700 text-white border border-slate-700 transition-colors text-center"
              >
                <Calculator className="w-4 h-4 text-brand-accent" />
                <span>Hitung Estimasi Biaya di Kalkulator</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 8 Cols */}
            <div className="lg:col-span-8 space-y-12">
              {/* Job Types Grid */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 font-heading mb-6">
                  Cakupan Jenis Pekerjaan Kelistrikan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.jobTypes.map((job, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-brand-accent/40 hover:shadow-sm transition-all flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-navy-100 text-navy-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 leading-snug">
                        {job}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOP Workflow Steps */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 font-heading mb-6">
                  Alur & Standar Prosedur Operasional (SOP)
                </h2>
                <div className="space-y-4">
                  {service.processSteps.map((step) => (
                    <div
                      key={step.step}
                      className="flex gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-accent text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-900 text-base font-heading">
                          {step.title}
                        </h3>
                        <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warranty Policy Details */}
              {warranty && (
                <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold font-heading text-lg">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    <span>Ketentuan Garansi Resmi ({warranty.duration})</span>
                  </div>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Cakupan Garansi:</h4>
                      <ul className="space-y-1 pl-4 list-disc text-slate-600 text-xs sm:text-sm">
                        {warranty.coverage.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Syarat Klaim Mudah:</h4>
                      <ul className="space-y-1 pl-4 list-disc text-slate-600 text-xs sm:text-sm">
                        {warranty.claimTerms.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Photo Showcase */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Booking Action Box */}
              <div className="bg-navy-900 text-white rounded-2xl p-6 shadow-xl border border-navy-800 space-y-4">
                <h3 className="text-lg font-bold font-heading">Siap Memesan Teknisi?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Konsultasikan keluhan kelistrikan atau kebutuhan renovasi instalasi rumah Anda. Respon cepat langsung dari WhatsApp Admin.
                </p>
                <div className="pt-2">
                  <a
                    href={waBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-brand-accent hover:bg-orange-600 text-white shadow-lg transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Pesan Layanan via WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Safety Alert Note */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Keamanan Utama:</strong> Jangan memaksakan perbaikan mandiri pada panel tegangan tinggi tanpa perlengkapan K3 yang memadai. Biarkan teknisi bersertifikat kami menanganinya dengan aman.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

