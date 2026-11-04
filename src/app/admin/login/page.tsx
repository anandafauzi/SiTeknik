"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Lock, User, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        setError(data.error || "Login gagal. Silakan periksa kembali username dan password.");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-accent to-amber-500 mx-auto flex items-center justify-center text-white shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900 font-heading">
            Admin SiTeknik Tangsel
          </h1>
          <p className="text-xs text-slate-500">
            Masuk untuk mengelola layanan, harga, galeri, dan chatbot AI
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Username:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white shadow-lg transition-all"
            >
              <span>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Default kredensial demo: <strong className="text-slate-800">admin</strong> /{" "}
            <strong className="text-slate-800">admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
