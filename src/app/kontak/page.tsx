"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [service, setService] = useState("Instalasi Listrik");
  const [location, setLocation] = useState("Serpong");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Halo Admin SiTeknik, saya ingin memesan layanan teknisi.\n\nNama: ${name || "[Pelanggan]"}\nJenis Layanan: ${service}\nLokasi: Kecamatan ${location}, Tangerang Selatan\nDetail Kebutuhan: ${message || "Mohon informasi ketersediaan jadwal teknisi."}\n\nTerima kasih.`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800 text-brand-accent text-xs font-bold border border-brand-accent/30">
            <MessageSquare className="w-4 h-4" />
            <span>Layanan Panggilan Tangsel</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading">
            Hubungi Teknisi SiTeknik
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Pusat informasi, pemesanan jadwal teknisi panggilan, dan layanan darurat perbaikan instalasi rumah di Tangerang Selatan.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
                Kontak Cepat
              </span>
              <h2 className="text-2xl font-bold text-navy-900 font-heading mt-3">
                Informasi Kantor & Jam Layanan
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Seluruh konsultasi dan konfirmasi jadwal pengerjaan dilakukan langsung melalui WhatsApp Admin agar terdokumentasi rapi.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">Alamat Operasional</h4>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    Jl. Raya Serpong No. 88, Tangerang Selatan, Banten 15310
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    (Posko teknisi tersebar di Pamulang, Ciputat, BSD, dan Bintaro)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">WhatsApp & Telepon Admin</h4>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-600 hover:underline mt-1 block"
                  >
                    0812-3456-7890 (Klik untuk Chat)
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Respon cepat: Rata-rata 5 - 15 menit
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">Jam Operasional Panggilan</h4>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    Senin - Minggu: 07.30 - 20.00 WIB
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    *Tersedia teknisi siaga darurat (korsleting/pompa mati total)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">Email Resmi</h4>
                  <p className="text-slate-600 text-xs mt-1">
                    layanan@siteknik.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
              <h3 className="text-xl font-bold text-navy-900 font-heading mb-2">
                Formulir Pemesanan Teknisi
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Isi data berikut untuk langsung terhubung dengan Admin WhatsApp dan mendapatkan jadwal kunjungan teknisi.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Ahmad / Ibu Maria"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kategori Layanan:
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-slate-900"
                    >
                      <option value="Instalasi Listrik">Instalasi Listrik</option>
                      <option value="Cuci / Servis AC">Cuci / Servis AC</option>
                      <option value="Pengeboran Sumur">Pengeboran Sumur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kecamatan / Area Tangsel:
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-slate-900"
                    >
                      <option value="Serpong">Serpong</option>
                      <option value="BSD City">BSD City</option>
                      <option value="Ciputat">Ciputat</option>
                      <option value="Ciputat Timur">Ciputat Timur</option>
                      <option value="Pamulang">Pamulang</option>
                      <option value="Pondok Aren">Pondok Aren</option>
                      <option value="Bintaro">Bintaro Jaya</option>
                      <option value="Serpong Utara">Serpong Utara</option>
                      <option value="Setu">Setu</option>
                      <option value="Pondok Cabe">Pondok Cabe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Detail Kerusakan / Kebutuhan:
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Contoh: AC kamar bocor air netes ke lantai, butuh cuci dan dicek jalur freonnya besok pagi..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-accent to-orange-500 text-white shadow-lg shadow-brand-accent/30 hover:from-orange-500 hover:to-orange-600 transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim & Hubungi WhatsApp Admin</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

