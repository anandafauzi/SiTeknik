import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { KnowledgeItem, ChatbotConfig } from "@/lib/types";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  return NextResponse.json({
    knowledge: db.knowledge,
    chatbotConfig: db.chatbotConfig,
  });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: KnowledgeItem = await req.json();
    const db = getDb();

    if (!body.topic || !body.content) {
      return NextResponse.json({ error: "Topik dan isi informasi wajib diisi" }, { status: 400 });
    }

    const newItem: KnowledgeItem = {
      ...body,
      id: body.id || `kn-${Date.now()}`,
      keywords: body.keywords && body.keywords.length > 0 ? body.keywords : body.topic.toLowerCase().split(" "),
    };

    db.knowledge.push(newItem);
    saveDb(db);

    return NextResponse.json({ success: true, item: newItem });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const db = getDb();

    // Check if it's updating ChatbotConfig or KnowledgeItem
    if (body.type === "config") {
      const config: ChatbotConfig = body.config;
      db.chatbotConfig = { ...db.chatbotConfig, ...config };
      saveDb(db);
      return NextResponse.json({ success: true, chatbotConfig: db.chatbotConfig });
    }

    const item: KnowledgeItem = body;
    const idx = db.knowledge.findIndex((k) => k.id === item.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Item pengetahuan tidak ditemukan" }, { status: 404 });
    }

    db.knowledge[idx] = { ...db.knowledge[idx], ...item };
    saveDb(db);

    return NextResponse.json({ success: true, item: db.knowledge[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib disertakan" }, { status: 400 });

  const db = getDb();
  db.knowledge = db.knowledge.filter((k) => k.id !== id);
  saveDb(db);

  return NextResponse.json({ success: true });
}

