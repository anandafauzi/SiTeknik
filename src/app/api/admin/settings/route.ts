import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  return NextResponse.json({
    settings: db.settings,
    adminUsername: db.adminUsers[0]?.username || "admin",
  });
}

export async function PUT(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: Partial<SiteSettings> & { newPassword?: string; newUsername?: string } = await req.json();
    const db = getDb();

    // Handle password change if provided
    if (body.newPassword && body.newPassword.trim() !== "") {
      const newHash = await hashPassword(body.newPassword.trim());
      if (db.adminUsers.length > 0) {
        db.adminUsers[0].passwordHash = newHash;
        if (body.newUsername && body.newUsername.trim() !== "") {
          db.adminUsers[0].username = body.newUsername.trim();
        }
      }
    } else if (body.newUsername && body.newUsername.trim() !== "") {
      if (db.adminUsers.length > 0) {
        db.adminUsers[0].username = body.newUsername.trim();
      }
    }

    // Remove password keys from settings object
    const { newPassword, newUsername, ...settingsData } = body;
    db.settings = { ...db.settings, ...settingsData };
    saveDb(db);

    return NextResponse.json({
      success: true,
      settings: db.settings,
      adminUsername: db.adminUsers[0]?.username || "admin",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

