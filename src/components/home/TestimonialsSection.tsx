import React from "react";
import { Star, Quote, MapPin } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Bpk. Hendra Gunawan",
      area: "Cluster Foresta, BSD City",
      service: "Instalasi Listrik & Box Panel MCB",
      rating: 5,
      comment:
        "Listrik rumah saya sering jeglek karena beban AC dan water heater gak seimbang. Teknisi SiTeknik datang tepat waktu, pembagian grup MCB-nya sangat rapi dan dijelaskan secara detail. Sangat puas dan bergaransi!",
    },
    {
      name: "Ibu Ratna Dewi",
      area: "Bintaro Sektor 7, Pondok Aren",
      service: "Cuci 3 Unit AC & Tambah Freon",
      rating: 5,
      comment:
        "Tukang AC paling bersih yang pernah saya pakai. Dinding dikasih terpal pelindung jadi gak kotor sama sekali. AC jadi dingin semriwing dan gak ada bau apak lagi. Recommended banget buat warga Tangsel.",
    },
    {
      name: "Bpk. Aditya Prabowo",
      area: "Pamulang Permai 1, Pamulang",
      service: "Pengeboran Sumur 42 Meter (Submersible)",
      rating: 5,
      comment:
        "Air tanah di rumah saya sebelumnya agak kuning berbau besi. Setelah dibor ulang oleh tim SiTeknik sampai kedalaman 42m, airnya sekarang jernih banget dan debitnya melimpah bahkan saat musim kemarau.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
            Ulasan Pelanggan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-3 font-heading">
            Kepercayaan Warga Tangerang Selatan
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Pengalaman nyata dari pemilik rumah dan properti yang telah menggunakan jasa teknisi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/70">
                <div className="font-bold text-navy-900 text-sm font-heading">{t.name}</div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3 h-3 text-brand-accent" />
                  <span>{t.area}</span>
                </div>
                <div className="text-[11px] font-semibold text-brand-accent mt-1">
                  Layanan: {t.service}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

