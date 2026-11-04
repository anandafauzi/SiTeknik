export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: "listrik" | "ac" | "bor-sumur";
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image: string;
  features: string[];
  jobTypes: string[];
  processSteps: { step: number; title: string; description: string }[];
  warrantyInfo: string;
  estimatedTime: string;
  startingPrice: number;
}

export interface PricingItem {
  id: string;
  category: "listrik" | "ac" | "bor-sumur";
  code: string;
  name: string;
  unit: string;
  basePrice: number;
  description: string;
  isAddon?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "listrik" | "ac" | "cuci-ac" | "bor-sumur";
  imageUrl: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  jobType: string;
  location: string;
  date: string;
  description: string;
}

export interface WarrantyPolicy {
  id: string;
  serviceCategory: "listrik" | "ac" | "bor-sumur";
  title: string;
  duration: string;
  coverage: string[];
  claimTerms: string[];
  exclusions: string[];
}

export interface KnowledgeItem {
  id: string;
  category: "listrik" | "ac" | "bor-sumur" | "umum" | "garansi" | "wilayah";
  topic: string;
  content: string;
  keywords: string[];
}

export interface ChatbotConfig {
  greeting: string;
  quickQuestions: string[];
  disclaimer: string;
  fallbackMessage: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  whatsappNumber: string; // e.g. "6281234567890"
  phoneDisplay: string;  // e.g. "0812-3456-7890"
  email: string;
  address: string;
  city: string;
  operatingHours: string;
  heroHeadline: string;
  heroSubheadline: string;
  serviceAreas: string[];
  geminiApiKey?: string;
}

export interface CalculationResult {
  category: "listrik" | "ac" | "bor-sumur";
  jobTitle: string;
  breakdown: { item: string; qty: number; unit: string; price: number; subtotal: number }[];
  additionalFees: { item: string; price: number }[];
  subtotal: number;
  total: number;
  location: string;
  notes: string;
  waMessage: string;
}

