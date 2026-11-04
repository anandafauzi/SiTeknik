"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingBtn from "@/components/layout/WhatsAppFloatingBtn";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import { SiteSettings } from "@/lib/types";

interface AppShellProps {
  children: React.ReactNode;
  settings: SiteSettings;
}

export default function AppShell({ children, settings }: AppShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar whatsappNumber={settings.whatsappNumber} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
      <WhatsAppFloatingBtn whatsappNumber={settings.whatsappNumber} />
      <ChatbotWidget />
    </>
  );
}

