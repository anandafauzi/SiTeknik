"use client";

import React, { useState, useEffect } from "react";
import { SiteSettings } from "@/lib/types";
import { Settings, Save, Check, Phone, MapPin, Mail, Clock, Globe, Lock, User } from "lucide-react";

export default function AdminPengaturanPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        if (data.adminUsername) setAdminUsername(data.adminUsername);
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    // Validate password if provided
    setPasswordError("");
    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      return;
    }

    try {
      const payload: Record<string, unknown> = { ...settings };
      if (newUsername.trim()) payload.newUsername = newUsername.trim();
      if (newPassword.trim()) payload.newPassword = newPassword.trim();

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.adminUsername) setAdminUsername(data.adminUsername);
        setNewPassword("");
        setConfirmPassword("");
        setNewUsername("");
        setSuccessMsg("Pengaturan website berhasil diperbarui!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings", err);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-slate-500">Memuat pengaturan...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 font-heading">
          Pengaturan Bisnis & Website
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Ubah nama usaha, nomor WhatsApp pemesanan, alamat operasional, dan wilayah jangkauan pelayanan Tangsel.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Bisnis */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 font-heading flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-brand-accent" />
            <span>Identitas Bisnis & Hero Homepage</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Usaha:
              </label>
              <input
                type="text"
                required
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Slogan / Tagline Bisnis:
              </label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Headline Utama (Hero Section):
            </label>
            <input
              type="text"
              required
              value={settings.heroHeadline}
              onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subheadline (Hero Section):
            </label>
            <textarea
              rows={2}
              required
              value={settings.heroSubheadline}
              onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs"
            />
          </div>
        </div>

        {/* WhatsApp & Kontak */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 font-heading flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Integrasi WhatsApp & Kontak Operasional</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp Admin (Format 62... tanpa tanda + atau spasi):
              </label>
              <input
                type="text"
                required
                placeholder="6281234567890"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Digunakan untuk seluruh tombol pesan wa.me di website.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tampilan Nomor di Website:
              </label>
              <input
                type="text"
                required
                placeholder="0812-3456-7890"
                value={settings.phoneDisplay}
                onChange={(e) => setSettings({ ...settings, phoneDisplay: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Dukungan:
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jam Operasional Panggilan:
              </label>
              <input
                type="text"
                required
                value={settings.operatingHours}
                onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alamat Kantor / Workshop di Tangerang Selatan:
            </label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>
        </div>

        {/* Wilayah Layanan */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 font-heading flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-cyan-600" />
            <span>Kecamatan & Wilayah Cakupan Tangsel</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Daftar Area Layanan (Pisahkan dengan tanda koma):
            </label>
            <textarea
              rows={3}
              value={settings.serviceAreas.join(", ")}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  serviceAreas: e.target.value
                    .split(",")
                    .map((a) => a.trim())
                    .filter((a) => a !== ""),
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Area ini akan otomatis muncul pada dropdown kalkulator, footer, dan kartu jangkauan wilayah.
            </p>
          </div>
        </div>

        {/* Keamanan Akun */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 font-heading flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-4 h-4 text-rose-500" />
            <span>Keamanan Akun Admin</span>
          </h2>
          <p className="text-xs text-slate-500">
            Username saat ini:{" "}
            <span className="font-mono font-bold text-navy-900">{adminUsername || "admin"}</span>
            {" "}— Kosongkan field di bawah jika tidak ingin mengubah password atau username.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Username Admin Baru:
              </label>
              <input
                type="text"
                placeholder="Biarkan kosong jika tidak diubah"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Password Baru:
              </label>
              <input
                type="password"
                placeholder="Min. 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Konfirmasi Password Baru:
              </label>
              <input
                type="password"
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-xs text-rose-600 font-medium">{passwordError}</p>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-accent to-orange-500 text-white shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Seluruh Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
}

