import { NextResponse } from "next/server";
import { refreshDbFromSupabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await refreshDbFromSupabase();
  return NextResponse.json({
    services: db.services,
    warranties: db.warranties,
    settings: {
      businessName: db.settings.businessName,
      whatsappNumber: db.settings.whatsappNumber,
      phoneDisplay: db.settings.phoneDisplay,
      address: db.settings.address,
      email: db.settings.email,
      operatingHours: db.settings.operatingHours,
      serviceAreas: db.settings.serviceAreas,
    },
  });
}
