import React from "react";
import { MapPin, Navigation, PhoneCall, HelpCircle } from "lucide-react";

interface CoverageAreasSectionProps {
  whatsappNumber?: string;
}

export default function CoverageAreasSection({
  whatsappNumber = "6281234567890",
}: CoverageAreasSectionProps) {
  const areas = [
    { name: "Ciputat", detail: "Ciputat, Cipayung, Sawah Lama, Sawah Baru, Serua" },
    { name: "Ciputat Timur", detail: "Cireundeu, Pisangan, Pondok Ranji, Rempoa, Rengas" },
    { name: "Pamulang", detail: "Pamulang Barat & Timur, Benda Baru, Pondok Benda, Kedaung" },
    { name: "Pondok Aren", detail: "Jurang Mangu, Pondok Betung, Pondok Kacang, Parigi" },
    { name: "Serpong", detail: "Buaran, Ciater, Cilenggang, Lengkong Gudang, Rawa Buntu" },
    { name: "Serpong Utara", detail: "Jelupang, Paku Jaya, Pakualam, Pakulonan, Pondok Jagung" },
    { name: "Setu", detail: "Babakan, Bakti Jaya, Kademangan, Keranggan, Muncul, Setu" },
    { name: "Pondok Cabe", detail: "Pondok Cabe Ilir & Udik, Lapangan Terbang & sekitarnya" },
    { name: "Bintaro Jaya", detail: "Bintaro Sektor 1 s/d 9, Graha Raya, Discovery Bintaro" },
    { name: "BSD City", detail: "Foresta, Greenwich, De Park, The Icon, Eminent, Vanya Park" },
  ];

  const checkWaUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Halo Admin SiTeknik, saya ingin menanyakan apakah alamat rumah saya di [Tuliskan Alamat / Kecamatan] masuk dalam jangkauan panggilan teknisi hari ini? Terima kasih."
  )}`;

  return (
    <section className="py-20 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
            <Navigation className="w-3.5 h-3.5" />
            <span>Jangkauan Wilayah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-3 font-heading">
            Wilayah Layanan di Tangerang Selatan
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
            Tim teknisi kami siap melayani panggilan ke perumahan, ruko, apartemen, maupun kantor di seluruh kecamatan Kota Tangerang Selatan.
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {areas.map((area, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-brand-accent/50 shadow-sm transition-all hover:shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-navy-900 font-bold text-sm sm:text-base font-heading">
                  <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>{area.name}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug line-clamp-2">
                  {area.detail}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-600 font-medium">
                <span>Teknisi Tersedia</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          ))}
        </div>

        {/* Notice & Consultation Action */}
        <div className="mt-10 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-navy-900 font-heading">
                Lokasi Anda Berada di Perbatasan atau Belum Yakin Terjangkau?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Ketersediaan teknisi dan estimasi waktu perjalanan bergantung pada lokasi pekerjaan. Tim kami juga melayani perbatasan Jakarta Selatan, Depok, dan Kabupaten Tangerang.
              </p>
            </div>
          </div>

          <a
            href={checkWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-navy-900 hover:bg-navy-800 text-white shadow-md transition-colors shrink-0"
          >
            <PhoneCall className="w-4 h-4 text-brand-accent" />
            <span>Cek Jangkauan Alamat Saya</span>
          </a>
        </div>
      </div>
    </section>
  );
}
