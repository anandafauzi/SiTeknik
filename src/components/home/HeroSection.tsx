import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Sparkles,
  Zap,
  Wind,
  Droplet,
} from "lucide-react";

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  whatsappNumber?: string;
}

export default function HeroSection({
  headline = "Solusi Instalasi dan Perawatan Rumah yang Aman, Profesional, dan Bergaransi.",
  subheadline = "Melayani instalasi listrik, pemasangan dan perawatan AC, serta pengeboran sumur untuk kebutuhan rumah dan bangunan di Tangerang Selatan dan sekitarnya.",
  whatsappNumber = "6281234567890",
}: HeroSectionProps) {
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Halo Admin SiTeknik, saya ingin berkonsultasi mengenai layanan perbaikan dan instalasi rumah di Tangerang Selatan."
  )}`;

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white overflow-hidden">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E3E6215_1px,transparent_1px),linear-gradient(to_bottom,#1E3E6215_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Decorative Glow Orb */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Col */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badges */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/80 border border-brand-accent/40 text-brand-accent text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teknisi Berpengalaman Tangerang Selatan</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] font-heading">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {subheadline}
            </p>

            {/* Key Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Garansi Resmi Pekerjaan</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Harga Jujur & Transparan</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Standar K3 & SOP Rapi</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-accent to-orange-500 text-white shadow-lg shadow-brand-accent/30 hover:from-orange-500 hover:to-orange-600 transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Konsultasi via WhatsApp</span>
              </a>

              <Link
                href="#layanan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-navy-800/90 hover:bg-navy-700 text-white border border-slate-700/80 transition-all hover:border-slate-500"
              >
                <span>Lihat Layanan</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </Link>
            </div>

            {/* Coverage Tag */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-brand-accent" />
              <span>Area: Ciputat, Pamulang, Bintaro, BSD City, Serpong, Setu & sekitarnya</span>
            </div>
          </div>

          {/* Right Image / Tech Hero Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Photo Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-navy-700/60 aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop"
                  alt="Teknisi SiTeknik sedang melakukan pekerjaan perbaikan kelistrikan dan pendingin di rumah"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />

                {/* Floating Service Badges */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-medium text-white/95 bg-navy-900/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-brand-accent" />
                    Listrik
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-sky-400" />
                    AC
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                    Bor Sumur
                  </span>
                </div>
              </div>

              {/* Floating Trust Card Badge */}
              <div className="absolute -top-5 -left-4 sm:-left-6 bg-white text-navy-900 rounded-xl p-3 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold font-heading">Garansi Hingga 90 Hari</div>
                  <p className="text-[10px] text-slate-500">Jaminan bebas biaya perbaikan ulang</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

