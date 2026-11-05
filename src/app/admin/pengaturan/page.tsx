"use client";

import React, { useState, useEffect } from "react";
import { SiteSettings } from "@/lib/types";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Mail,
  Clock,
  Globe,
  Lock,
  User,
  Loader2,
} from "lucide-react";

export default function AdminPengaturanPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [serviceAreasText, setServiceAreasText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setServiceAreasText(data.settings.serviceAreas?.join(", ") || "");
        if (data.adminUsername) setAdminUsername(data.adminUsername);
      } else {
        setFeedback({ type: "error", message: "Gagal memuat pengaturan website dari server." });
      }
    } catch (err: any) {
      console.error("Failed to load settings", err);
      setFeedback({ type: "error", message: "Terjadi gangguan jaringan saat memuat data." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setFeedback(null);

    // Validate password if user wants to change it
    const trimmedPass = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();
    if (trimmedPass || trimmedConfirm) {
      if (trimmedPass !== trimmedConfirm) {
        setFeedback({ type: "error", message: "Konfirmasi password baru tidak cocok. Silakan periksa kembali." });
        return;
      }
      if (trimmedPass.length < 6) {
        setFeedback({ type: "error", message: "Password baru minimal 6 karakter." });
        return;
      }
    }

    setIsSaving(true);

    try {
      // Parse service areas from free-form text
      const parsedAreas = serviceAreasText
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      const payload: Record<string, unknown> = {
        ...settings,
        serviceAreas: parsedAreas,
      };

      if (newUsername.trim()) {
        payload.newUsername = newUsername.trim();
      }
      if (trimmedPass) {
        payload.newPassword = trimmedPass;
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        if (data.adminUsername) setAdminUsername(data.adminUsername);
        if (data.settings) {
          setSettings(data.settings);
          setServiceAreasText(data.settings.serviceAreas?.join(", ") || "");
        }
        setNewPassword("");
        setConfirmPassword("");
        setNewUsername("");
        setFeedback({ type: "success", message: "Seluruh pengaturan website berhasil disimpan & diperbarui!" });
        setTimeout(() => setFeedback(null), 6000);
      } else {
        setFeedback({ type: "error", message: data.error || "Gagal menyimpan pengaturan ke database." });
      }
    } catch (err: any) {
      console.error("Failed to save settings", err);
      setFeedback({ type: "error", message: err.message || "Terjadi kendala koneksi ke server." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
        <p className="text-sm font-medium text-slate-500">Memuat data pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-heading">
          Pengaturan Bisnis & Website
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ubah nama usaha, nomor WhatsApp pemesanan, alamat operasional, wilayah jangkauan Tangsel, dan ganti password admin.
        </p>
      </div>

      {/* Top Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="font-medium leading-relaxed">{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Bisnis & Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-navy-900 font-heading flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-brand-accent" />
            <span>Identitas Bisnis & Hero Homepage</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Usaha:
              </label>
              <input
                type="text"
                required
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Slogan / Tagline Bisnis:
              </label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Headline Utama (Hero Section):
            </label>
            <input
              type="text"
              required
              value={settings.heroHeadline}
              onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Subheadline (Hero Section):
            </label>
            <textarea
              rows={2}
              required
              value={settings.heroSubheadline}
              onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 leading-relaxed"
            />
          </div>
        </div>

        {/* WhatsApp & Kontak */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-navy-900 font-heading flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Integrasi WhatsApp & Kontak Operasional</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp Admin (Format 62... tanpa tanda + atau spasi):
              </label>
              <input
                type="text"
                required
                placeholder="6281234567890"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Tersambung ke seluruh tombol pemesanan WhatsApp di website.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tampilan Nomor di Website:
              </label>
              <input
                type="text"
                required
                placeholder="0812-3456-7890"
                value={settings.phoneDisplay}
                onChange={(e) => setSettings({ ...settings, phoneDisplay: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Resmi:
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jam Operasional Panggilan:
              </label>
              <input
                type="text"
                required
                value={settings.operatingHours}
                onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Alamat Kantor / Posko di Tangerang Selatan:
            </label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 font-medium"
            />
          </div>
        </div>

        {/* Wilayah Layanan */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 font-heading flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-cyan-600" />
            <span>Kecamatan & Wilayah Cakupan Tangsel</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Daftar Area Layanan (Pisahkan dengan tanda koma):
            </label>
            <textarea
              rows={3}
              value={serviceAreasText}
              onChange={(e) => setServiceAreasText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Contoh: Ciputat, Pamulang, Pondok Aren, Serpong, BSD City, Bintaro
            </p>
          </div>
        </div>

        {/* Keamanan Akun Admin */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 font-heading flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-4 h-4 text-rose-500" />
            <span>Keamanan Akun Pengelola (Admin)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Username saat ini:{" "}
            <span className="font-mono font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
              {adminUsername || "admin"}
            </span>
            {" "}— Kosongkan kolom di bawah jika tidak ingin mengganti username atau password.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Ganti Username Admin:
              </label>
              <input
                type="text"
                placeholder="Biarkan kosong jika tidak diubah"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Password Baru:
              </label>
              <input
                type="password"
                placeholder="Min. 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Konfirmasi Password Baru:
              </label>
              <input
                type="password"
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            {feedback ? (
              <div
                className={`text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  feedback.type === "success" ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Klik tombol di sebelah kanan untuk menyimpan seluruh perubahan ke database.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-accent to-orange-500 text-white shadow-lg shadow-brand-accent/25 hover:from-orange-500 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Perubahan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Pengaturan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
