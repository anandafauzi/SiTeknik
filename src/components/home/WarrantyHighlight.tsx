import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function WarrantyHighlight() {
  const policies = [
    {
      title: "Instalasi Listrik",
      duration: "Garansi 30 - 90 Hari",
      points: [
        "Perbaikan ulang gratis jika sambungan kendur/rusak",
        "Garansi fungsi instalasi MCB dan panel",
        "Inspeksi tegangan dan grounding aman",
      ],
    },
    {
      title: "Servis & Cuci AC",
      duration: "Garansi 30 Hari",
      points: [
        "Bebas keluhan netes air indoor pasca cuci",
        "Garansi kerapian instalasi dan sambungan pipa",
        "Tekanan freon dicek dengan manifold digital",
      ],
    },
    {
      title: "Pengeboran Sumur",
      duration: "Garansi Debit Air 90 Hari",
      points: [
        "Jaminan debit air tawar layak pakai",
        "Garansi instalasi pipa casing 6 bulan",
        "Pengeboran ulang jika debit air drop",
      ],
    },
  ];

  return (
    <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3.5 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>Jaminan Kualitas Nyata</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-3 font-heading">
            Garansi Resmi untuk Ketenangan Pikiran Anda
          </h2>
          <p className="text-slate-300 mt-3 text-sm sm:text-base leading-relaxed">
            Kami mengutamakan integritas dan hubungan jangka panjang. Seluruh pekerjaan memiliki garansi terdata di sistem kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {policies.map((p, idx) => (
            <div
              key={idx}
              className="bg-navy-800/80 rounded-2xl p-6 sm:p-7 border border-navy-700/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-brand-accent tracking-wide uppercase">
                  {p.title}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 mb-4 font-heading">
                  {p.duration}
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  {p.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-navy-700/70">
                <Link
                  href="/tentang-kami#garansi"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-accent hover:text-orange-400 transition-colors"
                >
                  <span>Baca Ketentuan Klaim Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
