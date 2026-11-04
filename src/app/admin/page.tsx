import React from "react";
import Link from "next/link";
import { getDb } from "@/lib/db";
import {
  Wrench,
  DollarSign,
  Image as ImageIcon,
  Bot,
  ShieldCheck,
  Settings,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const db = getDb();

  const stats = [
    {
      label: "Layanan Aktif",
      value: db.services.length,
      desc: "Listrik, AC, & Bor Sumur",
      icon: Wrench,
      href: "/admin/layanan",
      color: "bg-blue-500",
    },
    {
      label: "Item Harga Jasa",
      value: db.pricing.length,
      desc: "Tersambung ke kalkulator",
      icon: DollarSign,
      href: "/admin/harga",
      color: "bg-emerald-500",
    },
    {
      label: "Foto Dokumentasi",
      value: db.gallery.length,
      desc: "Before/After & proses kerja",
      icon: ImageIcon,
      href: "/admin/galeri",
      color: "bg-amber-500",
    },
    {
      label: "Dokumen Pengetahuan RAG",
      value: db.knowledge.length,
      desc: "FAQ & basis data AI",
      icon: Bot,
      href: "/admin/chatbot",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-navy-800">
        <div>
          <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
            Selamat Datang di Panel Kendali
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading mt-1">
            {db.settings.businessName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kelola seluruh konten, harga, foto dokumentasi, dan respon AI tanpa menyentuh kode program.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-navy-900 border border-navy-800 px-4 py-2 rounded-xl text-xs">
            <span className="text-slate-400 block">Nomor WhatsApp Aktif:</span>
            <span className="font-bold text-white text-sm">{db.settings.phoneDisplay}</span>
          </div>
          <Link
            href="/admin/pengaturan"
            className="p-2.5 rounded-xl bg-brand-accent hover:bg-orange-600 text-white transition-colors"
            title="Edit Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              href={s.href}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {s.label}
                  </span>
                  <div className={`w-9 h-9 rounded-xl ${s.color} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-navy-900 font-heading">
                  {s.value}
                </div>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-accent group-hover:text-orange-600">
                <span>Kelola Data</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chatbot Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900 font-heading flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              <span>Status Asisten AI & Database RAG</span>
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Sistem Aktif
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Chatbot SiTeknik menjawab pertanyaan pelanggan secara otomatis berdasarkan {db.knowledge.length} dokumen pengetahuan bisnis dan daftar harga resmi.
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Gemini AI API Key:</span>
              <span className="font-semibold text-navy-900">
                {db.settings.geminiApiKey ? "Terkonfigurasi (Kustom)" : "Built-in Smart RAG Active"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Pertanyaan Populer:</span>
              <span className="font-semibold text-navy-900">
                {db.chatbotConfig.quickQuestions.length} Pertanyaan
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/chatbot"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900"
            >
              <span>Buka Manajemen Chatbot & FAQ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Kalkulator & WhatsApp Sync */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900 font-heading flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-600" />
              <span>Integrasi Pemesanan WhatsApp</span>
            </h3>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              wa.me Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Seluruh pesanan dari halaman utama, kalkulator estimasi, dan chatbot AI langsung diteruskan ke WhatsApp Admin: <strong>{db.settings.phoneDisplay}</strong>.
          </p>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Format pesan pesanan otomatis terisi rincian biaya</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Kalkulator biaya otomatis menghitung berdasarkan database harga</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/harga"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              <span>Atur Harga & Parameter Kalkulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

