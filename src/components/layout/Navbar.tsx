"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  Menu,
  X,
  ChevronDown,
  Zap,
  Wind,
  PhoneCall,
  ShieldCheck,
  Droplet,
} from "lucide-react";

interface NavbarProps {
  whatsappNumber?: string;
}

export default function Navbar({ whatsappNumber = "6281234567890" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "/" },
    {
      label: "Layanan",
      href: "#layanan",
      isDropdown: true,
      subItems: [
        { label: "Instalasi Listrik", href: "/layanan/listrik", icon: Zap, desc: "Instalasi baru, MCB, & perbaikan" },
        { label: "Instalasi & Cuci AC", href: "/layanan/ac", icon: Wind, desc: "Cuci, pasang baru, & relokasi" },
        { label: "Pengeboran Sumur", href: "/layanan/bor-sumur", icon: Droplet, desc: "Bor air bersih jet pump & submersible" },
      ],
    },
    { label: "Galeri", href: "/galeri" },
    { label: "Estimasi Biaya", href: "/kalkulator" },
    { label: "Tentang Kami", href: "/tentang-kami" },
    { label: "Kontak", href: "/kontak" },
  ];

  const waOrderUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Halo Admin SiTeknik, saya ingin memesan layanan teknisi untuk wilayah Tangerang Selatan. Mohon informasi jadwal dan ketersediaan teknisi. Terima kasih."
  )}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-navy-900/95 backdrop-blur-md shadow-lg shadow-navy-950/20 py-3"
          : "bg-navy-900 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-accent/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-heading">
                  Si<span className="text-brand-accent">Teknik</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-brand-accent/20 text-brand-accent border border-brand-accent/30">
                  Tangsel
                </span>
              </div>
              <p className="text-[11px] text-slate-300 -mt-0.5">Jasa Teknik & Perawatan Rumah</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setServicesDropdown(true)}
                    onMouseLeave={() => setServicesDropdown(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                        pathname.startsWith("/layanan")
                          ? "text-brand-accent font-semibold"
                          : "text-slate-200 hover:text-white hover:bg-navy-800/60"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          servicesDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {servicesDropdown && (
                      <div className="absolute top-full left-0 w-72 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="bg-white rounded-xl shadow-xl ring-1 ring-black/5 p-2 border border-slate-100">
                          {link.subItems?.map((sub) => {
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setServicesDropdown(false)}
                                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                              >
                                <div className="w-9 h-9 rounded-lg bg-navy-50 group-hover:bg-brand-accent/10 flex items-center justify-center text-navy-800 group-hover:text-brand-accent transition-colors shrink-0">
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 group-hover:text-brand-accent">
                                    {sub.label}
                                  </div>
                                  <p className="text-xs text-slate-500 mt-0.5">{sub.desc}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-brand-accent font-semibold bg-navy-800/80"
                      : "text-slate-200 hover:text-white hover:bg-navy-800/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={waOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-accent to-orange-500 text-white shadow-md shadow-brand-accent/25 hover:from-orange-500 hover:to-orange-600 transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Pesan Sekarang</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden bg-navy-900 border-t border-navy-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800 hover:text-white"
            >
              Beranda
            </Link>

            <div className="py-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Layanan Utama
              </p>
              <div className="mt-1 space-y-1 pl-2">
                <Link
                  href="/layanan/listrik"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-navy-800 hover:text-white"
                >
                  <Zap className="w-4 h-4 text-brand-accent" />
                  Instalasi Listrik
                </Link>
                <Link
                  href="/layanan/ac"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-navy-800 hover:text-white"
                >
                  <Wind className="w-4 h-4 text-brand-accent" />
                  Instalasi & Cuci AC
                </Link>
                <Link
                  href="/layanan/bor-sumur"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-navy-800 hover:text-white"
                >
                  <Droplet className="w-4 h-4 text-brand-accent" />
                  Pengeboran Sumur
                </Link>
              </div>
            </div>

            <Link
              href="/galeri"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800 hover:text-white"
            >
              Galeri Dokumentasi
            </Link>

            <Link
              href="/kalkulator"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800 hover:text-white"
            >
              Kalkulator Estimasi Biaya
            </Link>

            <Link
              href="/tentang-kami"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800 hover:text-white"
            >
              Tentang Kami & Garansi
            </Link>

            <Link
              href="/kontak"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800 hover:text-white"
            >
              Kontak
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-navy-800">
            <a
              href={waOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-brand-accent text-white shadow-md shadow-brand-accent/30"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Pesan Sekarang via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
