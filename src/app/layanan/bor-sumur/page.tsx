import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/lib/db";
import {
  Droplet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  Check,
  Calculator,
  Compass,
  Layers,
} from "lucide-react";

export const metadata = {
  title: "Jasa Bor Sumur Tangerang Selatan (Jet Pump & Submersible) — SiTeknik",
  description:
    "Jasa pengeboran sumur air bersih di Tangerang Selatan (Pamulang, Ciputat, BSD, Serpong). Berpengalaman memahami lapisan tanah Tangsel, garansi debit air 90 hari & pipa AW.",
};

export default function WellDrillingServicePage() {
  const db = getDb();
  const service = db.services.find((s) => s.category === "bor-sumur") || db.services[2];
  const warranty = db.warranties.find((w) => w.serviceCategory === "bor-sumur");
  const whatsappNumber = db.settings.whatsappNumber;

  const waBookingUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Halo Admin SiTeknik, saya ingin memesan Layanan Pengeboran Sumur untuk wilayah Tangerang Selatan.\n\nDetail Rencana: [Misal: Buat sumur bor submersible 35 meter / pasang pompa]\nLokasi Properti: [Alamat/Kecamatan]\n\nMohon informasi survei titik dan penawaran biaya. Terima kasih."
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
            <span>Bor Sumur Tangsel</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                <Droplet className="w-4 h-4" />
                <span>Pakar Akuifer & Lapisan Tanah Tangsel</span>
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
                  Garansi Debit Air 90 Hari
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-brand-accent" />
                  Waktu Pengerjaan: {service.estimatedTime}
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
                <span>Pesan Jasa Bor Sumur via WhatsApp</span>
              </a>

              <Link
                href="/kalkulator"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-navy-800 hover:bg-navy-700 text-white border border-slate-700 transition-colors text-center"
              >
                <Calculator className="w-4 h-4 text-brand-accent" />
                <span>Simulasi Biaya Bor Sumur di Kalkulator</span>
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
              {/* Geotechnical & Depth Guide */}
              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-navy-900 font-bold font-heading text-lg">
                  <Layers className="w-5 h-5 text-cyan-600" />
                  <span>Karakteristik Tanah & Rekomendasi Kedalaman Tangsel</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700 pt-2">
                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <h4 className="font-bold text-navy-900 text-sm mb-1">
                      Kawasan Lempung Merah (Ciputat & Pamulang)
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Kedalaman rata-rata 24 - 36 meter. Cukup menggunakan mesin Jet Pump dengan mata jet ganda atau Submersible 0.33 HP untuk hasil air jernih bebas bau.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <h4 className="font-bold text-navy-900 text-sm mb-1">
                      Kawasan Pasir Berbatu (Serpong, BSD & Setu)
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Kedalaman rata-rata 35 - 50+ meter menembus lapisan padas/batuan. Sangat direkomendasikan pompa celup submersible agar air bebas zat besi dan tidak kuning.
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Types Grid */}
              <div>
                <h2 className="text-2xl font-bold text-navy-900 font-heading mb-6">
                  Cakupan Pekerjaan Pengeboran & Pompa Air
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.jobTypes.map((job, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-cyan-500 hover:shadow-sm transition-all flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
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
                  Tahapan & Proses Pengeboran
                </h2>
                <div className="space-y-4">
                  {service.processSteps.map((step) => (
                    <div
                      key={step.step}
                      className="flex gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
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
                    <span>Garansi Debit Air & Pipa ({warranty.duration})</span>
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
                      <h4 className="font-semibold text-slate-900 mb-1">Ketentuan Klaim:</h4>
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
                <h3 className="text-lg font-bold font-heading">Survei Titik Air Bersih</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dapatkan analisa titik bor terbaik di lahan rumah Anda bebas kontaminasi septictank dengan debit air stabil sepanjang tahun.
                </p>
                <div className="pt-2">
                  <a
                    href={waBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-brand-accent hover:bg-orange-600 text-white shadow-lg transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Konsultasi Bor Sumur via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
