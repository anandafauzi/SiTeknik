import { NextRequest, NextResponse } from "next/server";
import { refreshDbFromSupabase, saveDb, saveSettingsToSupabase, saveAdminUserToSupabase } from "@/lib/db";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { SiteSettings } from "@/lib/types";
import { revalidateAllPublicPages } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await refreshDbFromSupabase();
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
    const db = await refreshDbFromSupabase();

    // Handle password change
    if (body.newPassword && body.newPassword.trim() !== "") {
      const newHash = await hashPassword(body.newPassword.trim());
      if (db.adminUsers.length > 0) {
        db.adminUsers[0].passwordHash = newHash;
        if (body.newUsername && body.newUsername.trim() !== "") {
          db.adminUsers[0].username = body.newUsername.trim();
        }
        await saveAdminUserToSupabase(db.adminUsers[0]);
      }
    } else if (body.newUsername && body.newUsername.trim() !== "") {
      if (db.adminUsers.length > 0) {
        db.adminUsers[0].username = body.newUsername.trim();
        await saveAdminUserToSupabase(db.adminUsers[0]);
      }
    }

    const { newPassword, newUsername, ...settingsData } = body;
    db.settings = { ...db.settings, ...settingsData };
    await saveSettingsToSupabase(db.settings);
    saveDb(db); // update local cache
    revalidateAllPublicPages();

    return NextResponse.json({
      success: true,
      settings: db.settings,
      adminUsername: db.adminUsers[0]?.username || "admin",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
