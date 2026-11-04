import React from "react";
import Link from "next/link";
import {
  Wrench,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  Wind,
  Droplet,
  ExternalLink,
  Lock,
} from "lucide-react";

interface FooterProps {
  settings?: {
    businessName: string;
    tagline: string;
    whatsappNumber: string;
    phoneDisplay: string;
    email: string;
    address: string;
    operatingHours: string;
    serviceAreas: string[];
  };
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const phone = settings?.whatsappNumber || "6281234567890";
  const displayPhone = settings?.phoneDisplay || "0812-3456-7890";
  const address = settings?.address || "Jl. Raya Serpong No. 88, Tangerang Selatan, Banten 15310";
  const hours = settings?.operatingHours || "Senin - Minggu: 07.30 - 20.00 WIB";
  const areas = settings?.serviceAreas || [
    "Ciputat",
    "Ciputat Timur",
    "Pamulang",
    "Pondok Aren",
    "Serpong",
    "Serpong Utara",
    "Setu",
    "Pondok Cabe",
    "Bintaro",
    "BSD City",
  ];

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Halo Admin SiTeknik, saya ingin bertanya seputar layanan teknik rumah di Tangerang Selatan."
  )}`;

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-8 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-800/80">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-accent to-amber-500 flex items-center justify-center text-white shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-heading">
                  Si<span className="text-brand-accent">Teknik</span>
                </span>
                <span className="text-[10px] ml-1.5 font-semibold uppercase px-1.5 py-0.5 rounded bg-brand-accent/20 text-brand-accent">
                  Tangsel
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Penyedia jasa instalasi listrik bergaransi, servis dan cuci AC, serta pengeboran sumur profesional terpercaya di Tangerang Selatan dan sekitarnya.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
                <span>Seluruh Layanan Bergaransi Resmi</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Layanan Utama
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/layanan/listrik"
                  className="flex items-center gap-2 text-slate-400 hover:text-brand-accent transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-brand-accent" />
                  Instalasi Listrik Bergaransi
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan/ac"
                  className="flex items-center gap-2 text-slate-400 hover:text-brand-accent transition-colors"
                >
                  <Wind className="w-3.5 h-3.5 text-brand-accent" />
                  Instalasi & Cuci AC Bersih
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan/bor-sumur"
                  className="flex items-center gap-2 text-slate-400 hover:text-brand-accent transition-colors"
                >
                  <Droplet className="w-3.5 h-3.5 text-brand-accent" />
                  Pengeboran Sumur Tangsel
                </Link>
              </li>
              <li className="pt-2 border-t border-navy-800">
                <Link
                  href="/kalkulator"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Kalkulator Estimasi Biaya
                </Link>
              </li>
              <li>
                <Link
                  href="/galeri"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Galeri & Dokumentasi Kerja
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang-kami"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Ketentuan Garansi Kerja
                </Link>
              </li>
            </ul>
          </div>

          {/* Coverage Areas */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Wilayah Layanan Tangsel
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Melayani panggilan teknisi ke rumah & gedung di area:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {areas.map((area) => (
                <span
                  key={area}
                  className="text-xs bg-navy-900 border border-navy-800 text-slate-300 px-2 py-1 rounded-md"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              *Tersedia juga untuk kawasan sekitar perbatasan Tangsel.
            </p>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Hubungi Kami
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-brand-accent shrink-0" />
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {displayPhone} (WhatsApp)
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <span>{hours}</span>
              </li>
            </ul>
            <div className="mt-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              >
                <span>Chat WhatsApp Admin</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {currentYear} SiTeknik Tangerang Selatan. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <Link href="/tentang-kami" className="hover:text-white transition-colors">
              Tentang Kami
            </Link>
            <Link href="/kontak" className="hover:text-white transition-colors">
              Kontak
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-1 text-slate-400 hover:text-brand-accent transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
