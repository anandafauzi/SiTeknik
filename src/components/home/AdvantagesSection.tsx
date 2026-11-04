import React from "react";
import {
  UserCheck,
  Award,
  ShieldCheck,
  Receipt,
  MessagesSquare,
  MapPin,
} from "lucide-react";

export default function AdvantagesSection() {
  const advantages = [
    {
      icon: UserCheck,
      title: "Teknisi Berpengalaman",
      description: "Dikerjakan oleh teknisi terlatih dengan jam terbang tinggi, memahami instalasi rumahan hingga bangunan bertingkat.",
    },
    {
      icon: Award,
      title: "Pekerjaan Profesional & Rapi",
      description: "Menerapkan standar SOP ketat, perlindungan dinding & lantai, serta penggunaan alat ukur dan perkakas modern.",
    },
    {
      icon: ShieldCheck,
      title: "Garansi Sesuai Ketentuan",
      description: "Jaminan rasa aman dengan garansi pekerjaan resmi. Perbaikan ulang gratis jika terjadi kendala pada titik yang dikerjakan.",
    },
    {
      icon: Receipt,
      title: "Harga Jujur & Transparan",
      description: "Tanpa biaya tersembunyi. Pelanggan mendapatkan rincian tarif sebelum pengerjaan dimulai dan dapat dicek di kalkulator.",
    },
    {
      icon: MessagesSquare,
      title: "Konsultasi Sebelum Pengerjaan",
      description: "Konsultasikan kendala atau rencana instalasi Anda terlebih dahulu via WhatsApp atau asisten AI kami tanpa komitmen.",
    },
    {
      icon: MapPin,
      title: "Fokus Tangerang Selatan",
      description: "Respon cepat untuk wilayah Ciputat, Pamulang, Bintaro, BSD City, Serpong, Setu, dan area perbatasan sekitarnya.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
            Standar Mutu SiTeknik
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 font-heading">
            Mengapa Mempercayakan Rumah Anda Kepada Kami?
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            Komitmen kami adalah memberikan hasil kerja yang tahan lama, aman bagi keluarga, dan transparan sejak awal konsultasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-accent/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-50 group-hover:bg-brand-accent/10 text-navy-900 group-hover:text-brand-accent flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading group-hover:text-navy-900">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

