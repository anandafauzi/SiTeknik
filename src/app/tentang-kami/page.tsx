import React from "react";
import { getDb } from "@/lib/db";
import {
  ShieldCheck,
  Award,
  Users,
  HardHat,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Zap,
  Wind,
  Droplet,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tentang Kami & Ketentuan Garansi Resmi — SiTeknik Tangerang Selatan",
  description:
    "Profil usaha, standar keselamatan K3, profesionalitas teknisi, dan kebijakan garansi resmi SiTeknik untuk jasa listrik, AC, dan bor sumur di Tangerang Selatan.",
};

export default function AboutPage() {
  const db = getDb();
  const settings = db.settings;
  const warranties = db.warranties;

  const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Halo Admin SiTeknik, saya ingin bertanya lebih lanjut mengenai komitmen dan layanan SiTeknik di Tangerang Selatan."
  )}`;

  return (
    <div className="pt-24 pb-20 bg-white">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800 text-brand-accent text-xs font-bold border border-brand-accent/30">
            <Award className="w-4 h-4" />
            <span>Mengenal SiTeknik Tangsel</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading">
            Mitra Terpercaya Perawatan & Teknik Rumah
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Menghadirkan solusi teknis rumah tinggal yang aman, berstandar mutu tinggi, serta didukung teknisi berpengalaman dan kebijakan garansi yang transparan.
          </p>
        </div>
      </section>

      {/* Profile & Vision */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
              Profil Usaha
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-heading">
              Dedikasi Kami untuk Keamanan dan Kenyamanan Hunian Anda
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <strong>SiTeknik</strong> berawal dari komitmen untuk mengatasi keresahan pemilik properti di Tangerang Selatan terhadap layanan teknik rumah yang sering kali tidak memiliki standar jelas, harga yang melambung tanpa rincian, atau hilangnya tanggung jawab teknisi pasca pengerjaan.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Kami memadukan keahlian teknisi lapangan tersertifikasi dengan keterbukaan sistem modern: estimasi biaya di muka, dokumentasi asli, dan penerbitan nota garansi resmi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-navy-900 text-sm mb-1">Visi Kami</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Menjadi penyedia jasa teknik rumah paling terpercaya dan berstandar mutu tertinggi di wilayah Tangerang Selatan.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-navy-900 text-sm mb-1">Misi Kami</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Memberikan layanan yang jujur, aman sesuai SOP K3, respon tepat waktu, dan purna jual bergaransi nyata.
                </p>
              </div>
            </div>
          </div>

          {/* Pillars Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <Users className="w-8 h-8 text-brand-accent mb-3" />
              <h3 className="font-bold text-navy-900 text-base font-heading">
                Teknisi Terseleksi
              </h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                Setiap teknisi melalui uji kompetensi teknis, pembekalan etika komunikasi, dan verifikasi identitas resmi.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <HardHat className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-navy-900 text-base font-heading">
                Standar Keselamatan K3
              </h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                Peralatan kerja berinsulasi standar PLN, sepatu pengaman, dan kepatuhan penuh terhadap standar keselamatan PUIL.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-base font-heading">
                Garansi Transparan
              </h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                Bukan janji lisan. Syarat, durasi, dan tata cara klaim dijelaskan terbuka tanpa biaya tersembunyi.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <Award className="w-8 h-8 text-navy-800 mb-3" />
              <h3 className="font-bold text-navy-900 text-base font-heading">
                Material Standar SNI
              </h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                Hanya menggunakan kabel tembaga murni, pipa freon tebal, dan pipa casing PVC tipe AW berkualitas tinggi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Garansi Detail */}
      <section id="garansi" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Pusat Informasi Garansi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-3 font-heading">
              Ketentuan Garansi Resmi Berdasarkan Layanan
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
              Berikut rincian durasi, cakupan, dan pengecualian garansi pekerjaan yang kami terapkan untuk melindungi kepentingan pelanggan.
            </p>
          </div>

          <div className="space-y-8">
            {warranties.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center font-bold">
                      {w.serviceCategory === "listrik" ? (
                        <Zap className="w-5 h-5 text-brand-accent" />
                      ) : w.serviceCategory === "ac" ? (
                        <Wind className="w-5 h-5 text-sky-500" />
                      ) : (
                        <Droplet className="w-5 h-5 text-cyan-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-navy-900 font-heading">
                        {w.title}
                      </h3>
                      <p className="text-xs text-slate-500 capitalize">
                        Kategori: {w.serviceCategory.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Masa Berlaku: {w.duration}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs sm:text-sm">
                  {/* Coverage */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Cakupan Garansi:</span>
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      {w.coverage.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Claim Terms */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-navy-800" />
                      <span>Ketentuan & Prosedur Klaim:</span>
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      {w.claimTerms.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-navy-700 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Hal Tidak Termasuk Garansi:</span>
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      {w.exclusions.map((e, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Consultation */}
          <div className="mt-12 text-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm bg-navy-900 hover:bg-navy-800 text-white shadow-xl transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-brand-accent" />
              <span>Konsultasi Syarat Garansi via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

