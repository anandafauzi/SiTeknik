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
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}

