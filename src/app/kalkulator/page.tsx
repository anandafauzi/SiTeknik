import React from "react";
import { getDbAsync } from "@/lib/db";
import CalculatorContainer from "@/components/calculator/CalculatorContainer";
import { Calculator, ShieldCheck, HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kalkulator Prakiraan Biaya Layanan Teknik Tangerang Selatan — SiTeknik",
  description:
    "Hitung simulasi dan estimasi biaya instalasi listrik, tarif cuci & pasang AC, serta biaya bor sumur di Tangerang Selatan secara transparan dan akurat.",
};

export default async function CalculatorPage() {
  const db = await getDbAsync();
  const settings = db.settings;

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800 text-brand-accent text-xs font-bold border border-brand-accent/30">
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Transparan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading">
            Kalkulator Estimasi Biaya Jasa
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Pilih kategori layanan, tentukan spesifikasi atau jumlah titik, dan dapatkan rincian estimasi biaya secara otomatis sebelum teknisi datang.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CalculatorContainer
          initialServiceAreas={settings.serviceAreas}
          whatsappNumber={settings.whatsappNumber}
        />
      </section>
    </div>
  );
}

