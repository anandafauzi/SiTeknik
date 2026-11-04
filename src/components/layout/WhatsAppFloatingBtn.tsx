"use client";

import React from "react";
import { MessageSquare, Phone } from "lucide-react";

interface WhatsAppFloatingBtnProps {
  whatsappNumber?: string;
}

export default function WhatsAppFloatingBtn({
  whatsappNumber = "6281234567890",
}: WhatsAppFloatingBtnProps) {
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Halo Admin SiTeknik, saya ingin memesan layanan teknisi atau berkonsultasi mengenai perbaikan rumah di Tangerang Selatan."
  )}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 group">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi WhatsApp Admin"
        className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
      >
        <div className="relative">
          <Phone className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider leading-none">
            Online Sekarang
          </span>
          <span className="text-xs font-bold leading-tight">Chat WhatsApp</span>
        </div>
      </a>
    </div>
  );
}
