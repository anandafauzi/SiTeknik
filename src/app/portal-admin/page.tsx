"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wrench,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function PortalAdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Username atau password yang Anda masukkan salah.");
      }
    } catch (err: any) {
      setError("Terjadi kendala jaringan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-navy-900/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-navy-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-accent to-amber-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-brand-accent/25">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 text-navy-900 text-[11px] font-bold border border-slate-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
                <span>Portal Akses Khusus Pengelola</span>
              </div>
              <h1 className="text-2xl font-extrabold text-navy-900 font-heading">
                Si<span className="text-brand-accent">Teknik</span> Tangsel
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Silakan masuk untuk mengelola layanan, harga, galeri, dan chatbot
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Username Admin:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-slate-900 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-slate-900 text-sm font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-navy-900 to-navy-800 hover:from-navy-800 hover:to-navy-700 disabled:opacity-50 text-white shadow-xl shadow-navy-950/25 transition-all active:scale-95"
              >
                <span>{loading ? "Memverifikasi Akun..." : "Masuk ke Panel Admin"}</span>
                <ArrowRight className="w-4 h-4 text-brand-accent" />
              </button>
            </div>
          </form>

          {/* Footer Card Info */}
          <div className="mt-8 pt-5 border-t border-slate-100 text-center space-y-1">
            <p className="text-[11px] text-slate-500">
              Halaman ini bersifat privat dan hanya dapat diakses oleh pengelola resmi.
            </p>
            <p className="text-[10px] text-slate-400">
              Sesi terenkripsi JWT • Akses 7 hari
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

