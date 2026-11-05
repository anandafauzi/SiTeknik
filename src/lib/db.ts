/**
 * db.ts — SiTeknik Database Layer
 *
 * Priority:
 *  1. Supabase (if SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is set)
 *  2. Local JSON file (dev) → /tmp JSON (Vercel serverless fallback)
 *
 * All public exports keep the same interface as before so no other files need changing.
 */

import fs from "fs";
import path from "path";
import {
  ServiceItem,
  PricingItem,
  GalleryItem,
  WarrantyPolicy,
  KnowledgeItem,
  ChatbotConfig,
  SiteSettings,
} from "./types";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────
export interface DatabaseSchema {
  services: ServiceItem[];
  pricing: PricingItem[];
  gallery: GalleryItem[];
  warranties: WarrantyPolicy[];
  knowledge: KnowledgeItem[];
  chatbotConfig: ChatbotConfig;
  settings: SiteSettings;
  adminUsers: { id: string; username: string; passwordHash: string; name: string }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase row → app type mappers
// ─────────────────────────────────────────────────────────────────────────────
function mapService(row: Record<string, unknown>): ServiceItem {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as ServiceItem["category"],
    shortDescription: row.short_description as string,
    fullDescription: row.full_description as string,
    icon: row.icon as string,
    image: row.image as string,
    features: (row.features as string[]) || [],
    jobTypes: (row.job_types as string[]) || [],
    processSteps: (row.process_steps as ServiceItem["processSteps"]) || [],
    warrantyInfo: row.warranty_info as string,
    estimatedTime: row.estimated_time as string,
    startingPrice: row.starting_price as number,
  };
}

function mapPricing(row: Record<string, unknown>): PricingItem {
  return {
    id: row.id as string,
    category: row.category as PricingItem["category"],
    code: row.code as string,
    name: row.name as string,
    unit: row.unit as string,
    basePrice: row.base_price as number,
    description: row.description as string,
    isAddon: Boolean(row.is_addon),
  };
}

function mapGallery(row: Record<string, unknown>): GalleryItem {
  return {
    id: row.id as string,
    title: row.title as string,
    category: row.category as GalleryItem["category"],
    imageUrl: row.image_url as string,
    beforeImageUrl: (row.before_image_url as string) || undefined,
    afterImageUrl: (row.after_image_url as string) || undefined,
    jobType: row.job_type as string,
    location: row.location as string,
    date: row.date as string,
    description: row.description as string,
  };
}

function mapWarranty(row: Record<string, unknown>): WarrantyPolicy {
  return {
    id: row.id as string,
    serviceCategory: row.service_category as WarrantyPolicy["serviceCategory"],
    title: row.title as string,
    duration: row.duration as string,
    coverage: (row.coverage as string[]) || [],
    claimTerms: (row.claim_terms as string[]) || [],
    exclusions: (row.exclusions as string[]) || [],
  };
}

function mapKnowledge(row: Record<string, unknown>): KnowledgeItem {
  return {
    id: row.id as string,
    category: row.category as KnowledgeItem["category"],
    topic: row.topic as string,
    content: row.content as string,
    keywords: (row.keywords as string[]) || [],
  };
}

function mapSettings(row: Record<string, unknown>): SiteSettings {
  return {
    businessName: row.business_name as string,
    tagline: row.tagline as string,
    whatsappNumber: row.whatsapp_number as string,
    phoneDisplay: row.phone_display as string,
    email: row.email as string,
    address: row.address as string,
    city: row.city as string,
    operatingHours: row.operating_hours as string,
    heroHeadline: row.hero_headline as string,
    heroSubheadline: row.hero_subheadline as string,
    serviceAreas: (row.service_areas as string[]) || [],
    geminiApiKey: (row.gemini_api_key as string) || "",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase read — loads full DatabaseSchema
// ─────────────────────────────────────────────────────────────────────────────
async function loadFromSupabase(): Promise<DatabaseSchema | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;

  try {
    const [
      { data: services },
      { data: pricing },
      { data: gallery },
      { data: warranties },
      { data: knowledge },
      { data: chatbotRows },
      { data: settingsRows },
      { data: adminUsers },
    ] = await Promise.all([
      sb.from("services").select("*").order("created_at"),
      sb.from("pricing").select("*").order("category").order("created_at"),
      sb.from("gallery").select("*").order("date", { ascending: false }),
      sb.from("warranties").select("*"),
      sb.from("knowledge").select("*").order("created_at"),
      sb.from("chatbot_config").select("*").eq("id", 1).single(),
      sb.from("site_settings").select("*").eq("id", 1).single(),
      sb.from("admin_users").select("id, username, password_hash, name"),
    ]);

    if (!settingsRows || !chatbotRows) return null; // essential tables missing

    const chatbot = chatbotRows as Record<string, unknown>;
    const settingsRow = settingsRows as Record<string, unknown>;

    return {
      services: (services || []).map((r) => mapService(r as Record<string, unknown>)),
      pricing: (pricing || []).map((r) => mapPricing(r as Record<string, unknown>)),
      gallery: (gallery || []).map((r) => mapGallery(r as Record<string, unknown>)),
      warranties: (warranties || []).map((r) => mapWarranty(r as Record<string, unknown>)),
      knowledge: (knowledge || []).map((r) => mapKnowledge(r as Record<string, unknown>)),
      chatbotConfig: {
        greeting: chatbot.greeting as string,
        quickQuestions: (chatbot.quick_questions as string[]) || [],
        disclaimer: chatbot.disclaimer as string,
        fallbackMessage: chatbot.fallback_message as string,
      },
      settings: mapSettings(settingsRow),
      adminUsers: (adminUsers || []).map((u: Record<string, unknown>) => ({
        id: u.id as string,
        username: u.username as string,
        passwordHash: u.password_hash as string,
        name: u.name as string,
      })),
    };
  } catch (err) {
    console.warn("[db] Supabase load error, falling back to file:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase write helpers
// ─────────────────────────────────────────────────────────────────────────────
async function saveSettingsToSupabase(settings: SiteSettings): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  await sb.from("site_settings").upsert({
    id: 1,
    business_name: settings.businessName,
    tagline: settings.tagline,
    whatsapp_number: settings.whatsappNumber,
    phone_display: settings.phoneDisplay,
    email: settings.email,
    address: settings.address,
    city: settings.city,
    operating_hours: settings.operatingHours,
    hero_headline: settings.heroHeadline,
    hero_subheadline: settings.heroSubheadline,
    service_areas: settings.serviceAreas,
    gemini_api_key: settings.geminiApiKey || "",
  });
}

async function saveAdminUserToSupabase(user: { id: string; username: string; passwordHash: string; name: string }): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  await sb.from("admin_users").upsert({
    id: user.id,
    username: user.username,
    password_hash: user.passwordHash,
    name: user.name,
  });
}

async function saveServicesToSupabase(services: ServiceItem[]): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  for (const s of services) {
    await sb.from("services").upsert({
      id: s.id, slug: s.slug, title: s.title, category: s.category,
      short_description: s.shortDescription, full_description: s.fullDescription,
      icon: s.icon, image: s.image, features: s.features, job_types: s.jobTypes,
      process_steps: s.processSteps, warranty_info: s.warrantyInfo,
      estimated_time: s.estimatedTime, starting_price: s.startingPrice,
      updated_at: new Date().toISOString(),
    });
  }
}

async function savePricingToSupabase(pricing: PricingItem[]): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  for (const p of pricing) {
    await sb.from("pricing").upsert({
      id: p.id, category: p.category, code: p.code, name: p.name,
      unit: p.unit, base_price: p.basePrice, description: p.description,
      is_addon: p.isAddon || false, updated_at: new Date().toISOString(),
    });
  }
}

async function saveGalleryToSupabase(gallery: GalleryItem[]): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  for (const g of gallery) {
    await sb.from("gallery").upsert({
      id: g.id, title: g.title, category: g.category, image_url: g.imageUrl,
      before_image_url: g.beforeImageUrl || null, after_image_url: g.afterImageUrl || null,
      job_type: g.jobType, location: g.location, date: g.date, description: g.description,
      updated_at: new Date().toISOString(),
    });
  }
}

async function saveGalleryDeleteToSupabase(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  await sb.from("gallery").delete().eq("id", id);
}

async function saveKnowledgeToSupabase(knowledge: KnowledgeItem[]): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  for (const k of knowledge) {
    await sb.from("knowledge").upsert({
      id: k.id, category: k.category, topic: k.topic, content: k.content,
      keywords: k.keywords, updated_at: new Date().toISOString(),
    });
  }
}

async function savePricingDeleteToSupabase(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  await sb.from("pricing").delete().eq("id", id);
}

async function saveKnowledgeDeleteToSupabase(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  await sb.from("knowledge").delete().eq("id", id);
}

async function saveWarrantiesToSupabase(warranties: WarrantyPolicy[]): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  for (const w of warranties) {
    await sb.from("warranties").upsert({
      id: w.id, service_category: w.serviceCategory, title: w.title,
      duration: w.duration, coverage: w.coverage, claim_terms: w.claimTerms,
      exclusions: w.exclusions, updated_at: new Date().toISOString(),
    });
  }
}

async function saveChatbotConfigToSupabase(config: ChatbotConfig): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  await sb.from("chatbot_config").upsert({
    id: 1,
    greeting: config.greeting,
    quick_questions: config.quickQuestions,
    disclaimer: config.disclaimer,
    fallback_message: config.fallbackMessage,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Local JSON File Fallback (dev + Vercel /tmp)
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: SiteSettings = {
  businessName: "SiTeknik Tangerang Selatan",
  tagline: "Solusi Instalasi & Perawatan Rumah Aman, Profesional, dan Bergaransi",
  whatsappNumber: "6281234567890",
  phoneDisplay: "0812-3456-7890",
  email: "layanan@siteknik.com",
  address: "Jl. Raya Serpong No. 88, Tangerang Selatan, Banten 15310",
  city: "Tangerang Selatan",
  operatingHours: "Senin - Minggu: 07.30 - 20.00 WIB (Layanan Darurat Siaga)",
  heroHeadline: "Solusi Instalasi dan Perawatan Rumah yang Aman, Profesional, dan Bergaransi.",
  heroSubheadline: "Melayani instalasi listrik, pemasangan dan perawatan AC, serta pengeboran sumur untuk kebutuhan rumah dan bangunan di Tangerang Selatan dan sekitarnya.",
  serviceAreas: ["Ciputat","Ciputat Timur","Pamulang","Pondok Aren","Serpong","Serpong Utara","Setu","Pondok Cabe","Bintaro","BSD City"],
  geminiApiKey: "",
};

function getDbFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "siteknik_db.json");
  }
  return path.join(process.cwd(), "data", "siteknik_db.json");
}

let memoryDb: DatabaseSchema | null = null;

function loadFromFile(): DatabaseSchema | null {
  if (memoryDb) return memoryDb;
  const paths = [getDbFilePath(), path.join(process.cwd(), "data", "siteknik_db.json")];
  for (const p of paths) {
    try {
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, "utf-8"));
        memoryDb = data;
        return memoryDb;
      }
    } catch {}
  }
  return null;
}

function saveToFile(data: DatabaseSchema): void {
  memoryDb = data;
  const p = getDbFilePath();
  try {
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const tmp = `${p}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tmp, p);
  } catch (err) {
    console.warn("[db] Could not persist to file:", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase cache (per process, refreshed each getDb() call when Supabase is on)
// ─────────────────────────────────────────────────────────────────────────────
let supabaseCache: DatabaseSchema | null = null;
let supabaseCacheAt = 0;
const CACHE_TTL_MS = 5000; // 5 seconds — balance freshness vs. request count

// ─────────────────────────────────────────────────────────────────────────────
// Public API: getDb() — synchronous, returns cached data
// ─────────────────────────────────────────────────────────────────────────────
export function getDb(): DatabaseSchema {
  // If Supabase cache is fresh, use it
  if (supabaseCache && Date.now() - supabaseCacheAt < CACHE_TTL_MS) {
    return supabaseCache;
  }

  // Otherwise fall back to file/memory
  const fileData = loadFromFile();
  if (fileData) return fileData;

  // Ultimate fallback: empty defaults
  const defaults: DatabaseSchema = {
    services: [], pricing: [], gallery: [], warranties: [], knowledge: [],
    chatbotConfig: { greeting: "Halo! Saya Asisten Virtual SiTeknik.", quickQuestions: [], disclaimer: "", fallbackMessage: "" },
    settings: DEFAULT_SETTINGS,
    adminUsers: [{ id: "adm-01", username: "admin", passwordHash: "$2a$10$n4j7tLhF0YQhWvM5Z0vBTeNn5qQo3l3gK0YgK9u7WnL6U2f3C6Qh6", name: "Admin SiTeknik" }],
  };
  memoryDb = defaults;
  return defaults;
}

/**
 * refreshDbFromSupabase() — call at the top of each API route handler.
 * Loads fresh data from Supabase and updates the in-process cache.
 * Falls back gracefully to existing file/memory data if Supabase is unavailable.
 */
export async function refreshDbFromSupabase(): Promise<DatabaseSchema> {
  if (isSupabaseConfigured()) {
    const fresh = await loadFromSupabase();
    if (fresh) {
      supabaseCache = fresh;
      supabaseCacheAt = Date.now();
      memoryDb = fresh; // keep file cache in sync
      return fresh;
    }
  }
  return getDb();
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API: saveDb() — persists to Supabase + file
// ─────────────────────────────────────────────────────────────────────────────
export function saveDb(data: DatabaseSchema): void {
  memoryDb = data;
  supabaseCache = data;
  supabaseCacheAt = Date.now();
  saveToFile(data);
  // Kick off async Supabase writes (non-blocking)
  saveDbToSupabaseAsync(data);
}

async function saveDbToSupabaseAsync(data: DatabaseSchema): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await Promise.all([
      saveSettingsToSupabase(data.settings),
      data.adminUsers.length > 0 ? saveAdminUserToSupabase(data.adminUsers[0]) : Promise.resolve(),
    ]);
  } catch (err) {
    console.warn("[db] Supabase async save error:", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Granular Supabase save helpers (exported for direct API route use)
// ─────────────────────────────────────────────────────────────────────────────
export {
  saveSettingsToSupabase,
  saveAdminUserToSupabase,
  saveServicesToSupabase,
  savePricingToSupabase,
  savePricingDeleteToSupabase,
  saveGalleryToSupabase,
  saveGalleryDeleteToSupabase,
  saveKnowledgeToSupabase,
  saveKnowledgeDeleteToSupabase,
  saveWarrantiesToSupabase,
  saveChatbotConfigToSupabase,
  refreshDbFromSupabase as loadFromSupabaseExport,
};
