"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  DollarSign,
  Image as ImageIcon,
  ShieldCheck,
  Bot,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Manajemen Layanan", href: "/admin/layanan", icon: Wrench },
    { label: "Manajemen Harga", href: "/admin/harga", icon: DollarSign },
    { label: "Dokumentasi Galeri", href: "/admin/galeri", icon: ImageIcon },
    { label: "Ketentuan Garansi", href: "/admin/garansi", icon: ShieldCheck },
    { label: "Chatbot AI & RAG", href: "/admin/chatbot", icon: Bot },
    { label: "Pengaturan Website", href: "/admin/pengaturan", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/portal-admin");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden bg-navy-950 text-white p-4 border-b border-navy-800 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-accent to-amber-500 flex items-center justify-center text-white font-bold">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-sm font-heading">
            Si<span className="text-brand-accent">Teknik</span> Admin
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-navy-900"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-full md:h-screen w-64 bg-navy-950 text-slate-300 flex flex-col justify-between border-r border-navy-800 shrink-0 transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-navy-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-accent to-amber-500 flex items-center justify-center text-white font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-sm font-heading">
                  SiTeknik <span className="text-brand-accent text-xs">Admin</span>
                </span>
                <p className="text-[10px] text-slate-400">Dashboard Pengelolaan</p>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs sm:text-sm overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                    isActive
                      ? "bg-brand-accent text-white font-semibold shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-navy-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-navy-800 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
          >
            <span>Lihat Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}
