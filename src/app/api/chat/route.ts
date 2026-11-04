import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { askBusinessChatbot } from "@/lib/rag";
import { generateBookingWaUrl } from "@/lib/whatsapp";

export async function GET() {
  const db = getDb();
  return NextResponse.json({
    config: db.chatbotConfig,
    settings: {
      businessName: db.settings.businessName,
      whatsappNumber: db.settings.whatsappNumber,
      phoneDisplay: db.settings.phoneDisplay,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    const { reply, relevantDocs, isAiGenerated } = await askBusinessChatbot(message, history || []);

    const db = getDb();
    const waUrl = generateBookingWaUrl({
      serviceCategory: "Konsultasi Layanan via Chatbot",
      jobDetails: `Pertanyaan Pelanggan: "${message}"`,
      location: "Tangerang Selatan",
      chatbotSummary: reply.length > 250 ? reply.slice(0, 250) + "..." : reply,
    });

    return NextResponse.json({
      reply,
      relevantDocs,
      isAiGenerated,
      waUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
