import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard — SiTeknik Tangerang Selatan",
  description: "Panel pengelolaan konten, harga, galeri dokumentasi, dan chatbot AI.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      {/* On mobile: add top padding for the sticky mobile header (56px).
          On md+: add left margin for the fixed 256px (w-64) sidebar. */}
      <main className="pt-14 md:pt-0 md:ml-64 min-h-screen p-4 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

