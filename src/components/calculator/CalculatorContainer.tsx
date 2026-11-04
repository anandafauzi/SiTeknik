"use client";

import React, { useState } from "react";
import { Zap, Wind, Droplet, Calculator, AlertCircle, PhoneCall, Check, ArrowRight } from "lucide-react";
import { CalculationResult } from "@/lib/types";

interface CalculatorContainerProps {
  initialServiceAreas?: string[];
  whatsappNumber?: string;
}

export default function CalculatorContainer({
  initialServiceAreas = [
    "Ciputat",
    "Ciputat Timur",
    "Pamulang",
    "Pondok Aren",
    "Serpong",
    "Serpong Utara",
    "Setu",
    "Pondok Cabe",
    "Bintaro",
    "BSD City",
  ],
  whatsappNumber = "6281234567890",
}: CalculatorContainerProps) {
  const [activeTab, setActiveTab] = useState<"listrik" | "ac" | "bor-sumur">("listrik");
  const [selectedLocation, setSelectedLocation] = useState(initialServiceAreas[0] || "Serpong");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Electrical Form State
  const [elType, setElType] = useState<"outbow" | "inbow">("outbow");
  const [elLightPoints, setElLightPoints] = useState<number>(4);
  const [elSocketPoints, setElSocketPoints] = useState<number>(2);
  const [elCableLength, setElCableLength] = useState<number>(15);
  const [elMcb, setElMcb] = useState<boolean>(false);
  const [elGrounding, setElGrounding] = useState<boolean>(false);

  // AC Form State
  const [acServiceType, setAcServiceType] = useState<"cuci" | "pasang" | "bongkar-pasang">("cuci");
  const [acCapacity, setAcCapacity] = useState<"0.5pk" | "1pk" | "1.5pk" | "2pk">("1pk");
  const [acUnits, setAcUnits] = useState<number>(2);
  const [acFreon, setAcFreon] = useState<boolean>(false);
  const [acExtraPipe, setAcExtraPipe] = useState<number>(0);

  // Well Drilling Form State
  const [smDepth, setSmDepth] = useState<"20-30" | "30-45" | "50-60">("30-45");
  const [smSoil, setSmSoil] = useState<string>("Normal / Lempung Merah (Ciputat, Pamulang)");
  const [smPump, setSmPump] = useState<"none" | "jetpump" | "submersible">("submersible");
  const [smPipeDistance, setSmPipeDistance] = useState<number>(10);
  const [smKuras, setSmKuras] = useState<boolean>(false);

  const calculateEstimate = async (tab: "listrik" | "ac" | "bor-sumur") => {
    setIsCalculating(true);
    let params: any = {};

    if (tab === "listrik") {
      params = {
        installationType: elType,
        lightPoints: elLightPoints,
        socketPoints: elSocketPoints,
        cableLength: elCableLength,
        includeMcb: elMcb,
        includeGrounding: elGrounding,
      };
    } else if (tab === "ac") {
      params = {
        serviceType: acServiceType,
        capacity: acCapacity,
        units: acUnits,
        includeFreon: acFreon,
        extraPiping: acExtraPipe,
      };
    } else if (tab === "bor-sumur") {
      params = {
        depthTier: smDepth,
        soilType: smSoil,
        pumpType: smPump,
        pipeDistance: smPipeDistance,
        includeKuras: smKuras,
      };
    }

    try {
      const res = await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: tab,
          params,
          location: selectedLocation,
          notes: customerNotes,
        }),
      });

      if (res.ok) {
        const data: CalculationResult = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error("Calculation failed", err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Trigger calculation whenever inputs or tabs change
  React.useEffect(() => {
    calculateEstimate(activeTab);
  }, [
    activeTab,
    selectedLocation,
    customerNotes,
    elType,
    elLightPoints,
    elSocketPoints,
    elCableLength,
    elMcb,
    elGrounding,
    acServiceType,
    acCapacity,
    acUnits,
    acFreon,
    acExtraPipe,
    smDepth,
    smSoil,
    smPump,
    smPipeDistance,
    smKuras,
  ]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      {/* Category Tabs Header */}
      <div className="grid grid-cols-3 bg-navy-950 p-2 gap-2 text-center text-xs sm:text-sm font-bold font-heading">
        <button
          onClick={() => setActiveTab("listrik")}
          className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl transition-all ${
            activeTab === "listrik"
              ? "bg-brand-accent text-white shadow-md shadow-brand-accent/30"
              : "text-slate-300 hover:text-white hover:bg-navy-900"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Instalasi Listrik</span>
        </button>

        <button
          onClick={() => setActiveTab("ac")}
          className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl transition-all ${
            activeTab === "ac"
              ? "bg-brand-accent text-white shadow-md shadow-brand-accent/30"
              : "text-slate-300 hover:text-white hover:bg-navy-900"
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Servis & Cuci AC</span>
        </button>

        <button
          onClick={() => setActiveTab("bor-sumur")}
          className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl transition-all ${
            activeTab === "bor-sumur"
              ? "bg-brand-accent text-white shadow-md shadow-brand-accent/30"
              : "text-slate-300 hover:text-white hover:bg-navy-900"
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Bor Sumur</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Input Form Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-navy-900 font-heading flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-accent" />
              <span>Parameter Estimasi {activeTab === "listrik" ? "Listrik" : activeTab === "ac" ? "AC" : "Bor Sumur"}</span>
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
              Tarif Resmi Tangsel
            </span>
          </div>

          {/* Form specific to Listrik */}
          {activeTab === "listrik" && (
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Tipe Jalur Instalasi:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setElType("outbow")}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                      elType === "outbow"
                        ? "border-navy-900 bg-navy-900 text-white shadow-sm"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    Outbow (Tanpa Bobok Tembok)
                  </button>
                  <button
                    type="button"
                    onClick={() => setElType("inbow")}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                      elType === "inbow"
                        ? "border-navy-900 bg-navy-900 text-white shadow-sm"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    Inbow (Bobok & Plester Tembok)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Jumlah Titik Lampu:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={elLightPoints}
                      onChange={(e) => setElLightPoints(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                    <span className="text-xs text-slate-500 shrink-0">titik</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Jumlah Stop Kontak / Saklar:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={elSocketPoints}
                      onChange={(e) => setElSocketPoints(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                    <span className="text-xs text-slate-500 shrink-0">titik</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Perkiraan Kebutuhan Kabel Listrik SNI:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={elCableLength}
                    onChange={(e) => setElCableLength(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                  />
                  <span className="text-xs text-slate-500 shrink-0">meter (NYM 3x2.5mm)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-semibold text-slate-700">Kebutuhan Tambahan:</label>
                <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={elMcb}
                    onChange={(e) => setElMcb(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
                  />
                  <span>Ganti / Tambah Unit MCB Box Panel (Rp120.000)</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={elGrounding}
                    onChange={(e) => setElGrounding(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
                  />
                  <span>Instalasi Grounding / Arde Batang Tembaga Pengaman (Rp250.000)</span>
                </label>
              </div>
            </div>
          )}

          {/* Form specific to AC */}
          {activeTab === "ac" && (
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Jenis Layanan AC:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "cuci", label: "Cuci AC" },
                    { id: "pasang", label: "Pasang Baru" },
                    { id: "bongkar-pasang", label: "Bongkar Pasang" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAcServiceType(s.id as any)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-medium text-center transition-all ${
                        acServiceType === s.id
                          ? "border-navy-900 bg-navy-900 text-white shadow-sm"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Kapasitas Unit AC:
                  </label>
                  <select
                    value={acCapacity}
                    onChange={(e) => setAcCapacity(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 text-sm"
                  >
                    <option value="0.5pk">0.5 PK</option>
                    <option value="1pk">1 PK</option>
                    <option value="1.5pk">1.5 PK</option>
                    <option value="2pk">2 PK</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Jumlah Unit AC:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={acUnits}
                      onChange={(e) => setAcUnits(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                    <span className="text-xs text-slate-500 shrink-0">unit</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Tambahan Pipa Tembaga AC (jika perlu):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={acExtraPipe}
                    onChange={(e) => setAcExtraPipe(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                  />
                  <span className="text-xs text-slate-500 shrink-0">meter (Rp95.000/m)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-semibold text-slate-700">Kebutuhan Tambahan:</label>
                <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acFreon}
                    onChange={(e) => setAcFreon(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
                  />
                  <span>Tambah Freon R32 / R410A (Rp150.000 / unit)</span>
                </label>
              </div>
            </div>
          )}

          {/* Form specific to Bor Sumur */}
          {activeTab === "bor-sumur" && (
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Pilihan Kedalaman Pengeboran:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "20-30", label: "20 - 30 Meter", sub: "Jet Pump" },
                    { id: "30-45", label: "30 - 45 Meter", sub: "Submersible" },
                    { id: "50-60", label: "50 - 60+ Meter", sub: "Deep Well" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSmDepth(d.id as any)}
                      className={`py-2 px-2 rounded-xl border text-center transition-all ${
                        smDepth === d.id
                          ? "border-navy-900 bg-navy-900 text-white shadow-sm"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold">{d.label}</div>
                      <div className="text-[10px] opacity-80">{d.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Jenis Tanah / Karakteristik Geologi:
                </label>
                <select
                  value={smSoil}
                  onChange={(e) => setSmSoil(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 text-sm"
                >
                  <option value="Normal / Lempung Merah (Ciputat, Pamulang)">
                    Tanah Lempung Merah (Ciputat, Pamulang, Bintaro)
                  </option>
                  <option value="Berpasir & Berbatu (Serpong, BSD, Setu)">
                    Tanah Berpasir & Berbatu (Serpong, BSD City, Setu)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Kebutuhan Instalasi Pompa Air:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "none", label: "Tanpa Pompa" },
                    { id: "jetpump", label: "Pompa Jet Pump" },
                    { id: "submersible", label: "Pompa Celup Submersible" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSmPump(p.id as any)}
                      className={`py-2 px-2 rounded-xl border text-xs font-medium text-center transition-all ${
                        smPump === p.id
                          ? "border-navy-900 bg-navy-900 text-white shadow-sm"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Jarak Jalur Pipa PVC ke Toren / Rumah:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={smPipeDistance}
                    onChange={(e) => setSmPipeDistance(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                  />
                  <span className="text-xs text-slate-500 shrink-0">meter (Rp25.000/m Rucika AW)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-semibold text-slate-700">Kebutuhan Tambahan:</label>
                <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smKuras}
                    onChange={(e) => setSmKuras(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
                  />
                  <span>Jasa Kuras Sumur / Spooling Kompresor Tambahan (Rp750.000)</span>
                </label>
              </div>
            </div>
          )}

          {/* Location and Notes */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                Wilayah Tangerang Selatan:
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-navy-900 text-sm"
              >
                {initialServiceAreas.map((area) => (
                  <option key={area} value={area}>
                    Kecamatan {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                Catatan Kondisi Rumah:
              </label>
              <input
                type="text"
                placeholder="Contoh: Rumah 2 lantai, dak beton..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Right Output Breakdown Col */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Rincian Biaya
                </span>
                <h4 className="text-lg font-bold text-navy-900 font-heading">
                  {result?.jobTitle || "Estimasi Pekerjaan"}
                </h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                Lokasi: {selectedLocation}
              </span>
            </div>

            {/* Itemized List */}
            <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
              {result?.breakdown.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between py-1.5 border-b border-slate-100">
                  <div className="pr-2">
                    <span className="font-semibold text-slate-800">{item.item}</span>
                    <span className="block text-[11px] text-slate-500">
                      {item.qty} {item.unit} @ Rp{item.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <span className="font-bold text-navy-900 shrink-0">
                    Rp{item.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}

              {/* Additional Fees */}
              {result?.additionalFees.map((fee, idx) => (
                <div key={idx} className="flex items-start justify-between py-1.5 border-b border-slate-100 text-amber-900">
                  <div className="pr-2">
                    <span className="font-semibold">{fee.item}</span>
                    <span className="block text-[11px] text-amber-700/80">Biaya Tambahan</span>
                  </div>
                  <span className="font-bold shrink-0">
                    +Rp{fee.price.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}

              {(!result || (result.breakdown.length === 0 && result.additionalFees.length === 0)) && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Silakan masukkan parameter di sebelah kiri untuk melihat rincian biaya.
                </div>
              )}
            </div>

            {/* Total Section */}
            {result && result.total > 0 && (
              <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                  <span>Subtotal Jasa & Material:</span>
                  <span>Rp{result.subtotal.toLocaleString("id-ID")}</span>
                </div>
                {result.additionalFees.length > 0 && (
                  <div className="flex items-center justify-between text-sm text-amber-800 mb-1">
                    <span>Tambahan Pilihan:</span>
                    <span>
                      +Rp
                      {result.additionalFees
                        .reduce((acc, f) => acc + f.price, 0)
                        .toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 text-base sm:text-lg font-extrabold text-navy-900 border-t border-slate-200">
                  <span>Total Estimasi Biaya:</span>
                  <span className="text-xl sm:text-2xl text-brand-accent">
                    Rp{result.total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer & WhatsApp Order CTA */}
          <div className="mt-8 space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-[11px] text-amber-900 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Disclaimer:</strong> Biaya yang ditampilkan merupakan estimasi awal. Harga final dapat berubah berdasarkan kondisi lapangan, kebutuhan material, dan hasil pemeriksaan teknisi.
              </span>
            </div>

            {result?.waMessage ? (
              <a
                href={result.waMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-accent to-orange-500 text-white shadow-lg shadow-brand-accent/25 hover:from-orange-500 hover:to-orange-600 transition-all active:scale-95 text-center"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Pesan Berdasarkan Estimasi via WhatsApp</span>
              </a>
            ) : (
              <button
                disabled
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-slate-200 text-slate-500 cursor-not-allowed"
              >
                Pilih Parameter Layanan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

