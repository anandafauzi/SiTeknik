import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { CalculationResult } from "@/lib/types";
import { generateBookingWaUrl } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, params, location, notes } = body;

    const db = getDb();
    const pricingMap = new Map(db.pricing.map((p) => [p.code, p]));

    const breakdown: CalculationResult["breakdown"] = [];
    const additionalFees: CalculationResult["additionalFees"] = [];
    let jobTitle = "";

    if (category === "listrik") {
      jobTitle = "Estimasi Instalasi Listrik";
      const {
        installationType = "outbow", // 'outbow' or 'inbow'
        lightPoints = 0,
        socketPoints = 0,
        cableLength = 0,
        includeMcb = false,
        includeGrounding = false,
      } = params || {};

      const lightItemCode = installationType === "inbow" ? "EL_TITIK_LAMPU_BOBOK" : "EL_TITIK_LAMPU";
      const lightPricing = pricingMap.get(lightItemCode);
      if (lightPoints > 0 && lightPricing) {
        breakdown.push({
          item: lightPricing.name,
          qty: Number(lightPoints),
          unit: lightPricing.unit,
          price: lightPricing.basePrice,
          subtotal: Number(lightPoints) * lightPricing.basePrice,
        });
      }

      const socketPricing = pricingMap.get("EL_STOP_KONTAK");
      if (socketPoints > 0 && socketPricing) {
        breakdown.push({
          item: socketPricing.name,
          qty: Number(socketPoints),
          unit: socketPricing.unit,
          price: socketPricing.basePrice,
          subtotal: Number(socketPoints) * socketPricing.basePrice,
        });
      }

      const cablePricing = pricingMap.get("EL_KABEL_METER");
      if (cableLength > 0 && cablePricing) {
        breakdown.push({
          item: cablePricing.name,
          qty: Number(cableLength),
          unit: cablePricing.unit,
          price: cablePricing.basePrice,
          subtotal: Number(cableLength) * cablePricing.basePrice,
        });
      }

      if (includeMcb) {
        const mcbPricing = pricingMap.get("EL_PASANG_MCB");
        if (mcbPricing) {
          additionalFees.push({
            item: mcbPricing.name,
            price: mcbPricing.basePrice,
          });
        }
      }

      if (includeGrounding) {
        const groundingPricing = pricingMap.get("EL_GROUNDING");
        if (groundingPricing) {
          additionalFees.push({
            item: groundingPricing.name,
            price: groundingPricing.basePrice,
          });
        }
      }
    } else if (category === "ac") {
      jobTitle = "Estimasi Layanan AC";
      const {
        serviceType = "cuci", // 'cuci', 'pasang', 'bongkar-pasang'
        capacity = "1pk", // '0.5pk', '1pk', '1.5pk', '2pk'
        units = 1,
        includeFreon = false,
        extraPiping = 0,
      } = params || {};

      const isLargeUnit = capacity === "1.5pk" || capacity === "2pk";

      if (serviceType === "cuci") {
        const itemCode = isLargeUnit ? "AC_CUCI_15_20" : "AC_CUCI_05_10";
        const pricing = pricingMap.get(itemCode);
        if (pricing) {
          breakdown.push({
            item: `${pricing.name} (${capacity.toUpperCase()})`,
            qty: Number(units),
            unit: pricing.unit,
            price: pricing.basePrice,
            subtotal: Number(units) * pricing.basePrice,
          });
        }
      } else if (serviceType === "pasang") {
        const itemCode = isLargeUnit ? "AC_PASANG_15_20" : "AC_PASANG_05_10";
        const pricing = pricingMap.get(itemCode);
        if (pricing) {
          breakdown.push({
            item: `${pricing.name} (${capacity.toUpperCase()})`,
            qty: Number(units),
            unit: pricing.unit,
            price: pricing.basePrice,
            subtotal: Number(units) * pricing.basePrice,
          });
        }
      } else if (serviceType === "bongkar-pasang") {
        const pricing = pricingMap.get("AC_BONGKAR_PASANG");
        if (pricing) {
          breakdown.push({
            item: `${pricing.name} (${capacity.toUpperCase()})`,
            qty: Number(units),
            unit: pricing.unit,
            price: pricing.basePrice,
            subtotal: Number(units) * pricing.basePrice,
          });
        }
      }

      if (includeFreon) {
        const freonPricing = pricingMap.get("AC_TAMBAH_FREON_R32");
        if (freonPricing) {
          additionalFees.push({
            item: `${freonPricing.name} (${units} unit)`,
            price: freonPricing.basePrice * Number(units),
          });
        }
      }

      if (extraPiping > 0) {
        const pipePricing = pricingMap.get("AC_PIPA_TEMBAGA");
        if (pipePricing) {
          additionalFees.push({
            item: `${pipePricing.name} (${extraPiping} m)`,
            price: pipePricing.basePrice * Number(extraPiping),
          });
        }
      }
    } else if (category === "bor-sumur") {
      jobTitle = "Estimasi Pengeboran Sumur";
      const {
        depthTier = "20-30", // '20-30', '30-45', '50-60'
        pumpType = "none", // 'none', 'jetpump', 'submersible'
        pipeDistance = 0,
        includeKuras = false,
      } = params || {};

      let depthCode = "SM_BOR_20_30M";
      if (depthTier === "30-45") depthCode = "SM_BOR_30_45M";
      if (depthTier === "50-60") depthCode = "SM_BOR_50_60M";

      const depthPricing = pricingMap.get(depthCode);
      if (depthPricing) {
        breakdown.push({
          item: depthPricing.name,
          qty: 1,
          unit: depthPricing.unit,
          price: depthPricing.basePrice,
          subtotal: depthPricing.basePrice,
        });
      }

      if (pumpType === "jetpump") {
        const pumpPricing = pricingMap.get("SM_PASANG_POMPA_JET");
        if (pumpPricing) {
          additionalFees.push({
            item: pumpPricing.name,
            price: pumpPricing.basePrice,
          });
        }
      } else if (pumpType === "submersible") {
        const pumpPricing = pricingMap.get("SM_PASANG_SUBMERSIBLE");
        if (pumpPricing) {
          additionalFees.push({
            item: pumpPricing.name,
            price: pumpPricing.basePrice,
          });
        }
      }

      if (pipeDistance > 0) {
        const pipePricing = pricingMap.get("SM_PIPA_INSTALASI");
        if (pipePricing) {
          additionalFees.push({
            item: `${pipePricing.name} (${pipeDistance} m)`,
            price: pipePricing.basePrice * Number(pipeDistance),
          });
        }
      }

      if (includeKuras) {
        const kurasPricing = pricingMap.get("SM_KURAS_SUMUR");
        if (kurasPricing) {
          additionalFees.push({
            item: kurasPricing.name,
            price: kurasPricing.basePrice,
          });
        }
      }
    }

    const subtotal = breakdown.reduce((acc, curr) => acc + curr.subtotal, 0);
    const additionalTotal = additionalFees.reduce((acc, curr) => acc + curr.price, 0);
    const total = subtotal + additionalTotal;

    const formattedBreakdownText = [
      ...breakdown.map((b) => `- ${b.item} (${b.qty} ${b.unit}): Rp${b.subtotal.toLocaleString("id-ID")}`),
      ...additionalFees.map((a) => `- ${a.item}: Rp${a.price.toLocaleString("id-ID")}`),
    ].join("\n");

    const waUrl = generateBookingWaUrl({
      serviceCategory: category === "listrik" ? "Instalasi Listrik" : category === "ac" ? "Servis/Instalasi AC" : "Pengeboran Sumur",
      jobDetails: `${jobTitle}\n${formattedBreakdownText}`,
      location: location || "Tangerang Selatan",
      estimatedCost: `Rp${total.toLocaleString("id-ID")}`,
      notes: notes || "Pemesanan melalui fitur Kalkulator Estimasi Website",
    });

    const result: CalculationResult = {
      category,
      jobTitle,
      breakdown,
      additionalFees,
      subtotal,
      total,
      location: location || "Tangerang Selatan",
      notes: notes || "",
      waMessage: waUrl,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to calculate estimate" }, { status: 500 });
  }
}
