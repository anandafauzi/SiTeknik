import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDb } from "./db";
import { KnowledgeItem } from "./types";

interface SearchResult {
  item: KnowledgeItem;
  score: number;
}

export function searchKnowledgeBase(query: string, limit = 4): KnowledgeItem[] {
  const db = getDb();
  const lowerQuery = query.toLowerCase();
  const queryTokens = lowerQuery
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scored: SearchResult[] = db.knowledge.map((item) => {
    let score = 0;
    const lowerTopic = item.topic.toLowerCase();
    const lowerContent = item.content.toLowerCase();

    // Exact query match bonus
    if (lowerContent.includes(lowerQuery) || lowerTopic.includes(lowerQuery)) {
      score += 15;
    }

    // Keyword match
    for (const kw of item.keywords) {
      const lowerKw = kw.toLowerCase();
      if (lowerQuery.includes(lowerKw)) {
        score += 10;
      }
    }

    // Token match
    for (const token of queryTokens) {
      if (lowerTopic.includes(token)) score += 5;
      if (lowerContent.includes(token)) score += 2;
    }

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Filter those with meaningful score
  return scored.filter((s) => s.score > 2).slice(0, limit).map((s) => s.item);
}

export function buildSystemPrompt(contextChunks: KnowledgeItem[]): string {
  const db = getDb();
  const settings = db.settings;

  const contextText = contextChunks.length > 0
    ? contextChunks
        .map((c, i) => `[DOKUMEN ${i + 1} - Kategori: ${c.category.toUpperCase()}]\nTopik: ${c.topic}\nInformasi: ${c.content}`)
        .join("\n\n")
    : "Tidak ada dokumen relevan yang ditemukan dalam database.";

  // Include current active pricing summary in prompt context
  const pricingText = db.pricing
    .map((p) => `- ${p.name} (${p.category}): Rp${p.basePrice.toLocaleString("id-ID")} / ${p.unit}`)
    .join("\n");

  return `Anda adalah Asisten Virtual resmi dari "${settings.businessName}", penyedia jasa instalasi listrik, perawatan/cuci AC, dan pengeboran sumur bergaransi di Tangerang Selatan dan sekitarnya.

=== ATURAN KETAT CHATBOT (WAJIB DIPATUHI) ===
1. Seluruh jawaban HARUS berpedoman pada FAKTA & DATABASE berikut. DILARANG MENGARANG harga, biaya tambahan, durasi garansi, atau informasi lainnya di luar database.
2. HARGA RESMI HARUS SELALU DIAMBIL DARI DAFTAR HARGA BERIKUT:
${pricingText}
3. Jika informasi TIDAK DITEMUKAN dalam basis pengetahuan, sampaikan dengan jujur dan ramah bahwa hal tersebut perlu dikonfirmasi langsung ke Admin/Teknisi via WhatsApp. JANGAN MENEBAK!
4. Jika pertanyaan terkait konsultasi kerusakan (misal: AC tidak dingin, listrik sering jeglek, air sumur bau), berikan kemungkinan penyebab teknis umum secara edukatif, namun tegaskan bahwa teknisi harus melakukan pengecekan langsung di lokasi untuk diagnosa pasti.
5. JANGAN menjanjikan hasil pekerjaan atau diagnosa mutlak sebelum teknisi memeriksa fisik di lokasi.
6. Wilayah pelayanan resmi: Tangerang Selatan (Ciputat, Pamulang, Pondok Aren, Serpong, Serpong Utara, Setu, Bintaro, BSD City, Pondok Cabe). Di luar Tangsel, sampaikan perlu konfirmasi jarak transportasi ke admin.
7. Gunakan Bahasa Indonesia yang ramah, santun, profesional, dan solutif.
8. Di akhir jawaban yang relevan, tawarkan kemudahan pemesanan atau konsultasi via WhatsApp Admin (${settings.phoneDisplay}).

=== BASIS PENGETAHUAN BISNIS TERBARU (RAG) ===
${contextText}
`;
}

export async function askBusinessChatbot(userMessage: string, history: { role: "user" | "model"; text: string }[] = []) {
  const db = getDb();
  const relevantDocs = searchKnowledgeBase(userMessage, 4);
  const systemPrompt = buildSystemPrompt(relevantDocs);

  // Check for API key (priority: settings > env)
  const apiKey = db.settings.geminiApiKey || process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== "") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt,
      });

      const formattedHistory = history.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      const response = await chat.sendMessage(userMessage);
      const answer = response.response.text();

      return {
        reply: answer,
        relevantDocs: relevantDocs.map((d) => d.topic),
        isAiGenerated: true,
      };
    } catch (err: any) {
      console.warn("Gemini API call failed, falling back to smart RAG engine:", err?.message || err);
      // Fallback seamlessly to smart RAG response generator
    }
  }

  // Smart Built-in Fallback RAG Engine (Zero failure mode)
  const fallbackReply = generateSmartRagReply(userMessage, relevantDocs);
  return {
    reply: fallbackReply,
    relevantDocs: relevantDocs.map((d) => d.topic),
    isAiGenerated: false,
  };
}

function generateSmartRagReply(query: string, docs: KnowledgeItem[]): string {
  const db = getDb();
  const lower = query.toLowerCase();

  // Price inquiries
  if (lower.includes("harga") || lower.includes("biaya") || lower.includes("tarif") || lower.includes("berapa")) {
    if (lower.includes("cuci ac")) {
      const p1 = db.pricing.find((p) => p.code === "AC_CUCI_05_10");
      const p2 = db.pricing.find((p) => p.code === "AC_CUCI_15_20");
      return `Untuk jasa cuci AC di SiTeknik, biayanya adalah:\n• Kapasitas 0.5 PK - 1 PK: Rp${(p1?.basePrice || 75000).toLocaleString("id-ID")} per unit\n• Kapasitas 1.5 PK - 2 PK: Rp${(p2?.basePrice || 90000).toLocaleString("id-ID")} per unit\n\nPencucian mencakup pembersihan indoor, blower, filter, evaporator, dan outdoor unit dengan water jet bertekanan. Apakah Anda ingin menjadwalkan cuci AC sekarang melalui WhatsApp Admin?`;
    }
    if (lower.includes("pasang ac") || lower.includes("bongkar pasang")) {
      return `Berikut tarif jasa pemasangan AC SiTeknik:\n• Pasang AC baru/lama (0.5 - 1 PK): Rp250.000 / unit\n• Pasang AC (1.5 - 2 PK): Rp320.000 / unit\n• Bongkar pasang AC: Rp375.000 / unit\n(Sudah termasuk proses vakum pipa standar pabrikan).\n\nUntuk estimasi kebutuhan pipa tembaga atau jadwal teknisi, silakan klik tombol Hubungi Admin via WhatsApp.`;
    }
    if (lower.includes("listrik") || lower.includes("lampu") || lower.includes("stop kontak")) {
      return `Untuk jasa instalasi listrik:\n• Pasang titik lampu baru outbow: Rp65.000 / titik\n• Pasang titik lampu baru inbow (bobok): Rp95.000 / titik\n• Pasang stop kontak / saklar: Rp75.000 / titik\n• Penggantian MCB panel: Rp120.000\n• Pelacakan korsleting: Mulai Rp150.000\n\nSeluruh pekerjaan bergaransi hingga 90 hari. Ingin berkonsultasi mengenai kelistrikan rumah Anda?`;
    }
    if (lower.includes("bor") || lower.includes("sumur")) {
      return `Estimasi biaya pengeboran sumur SiTeknik di wilayah Tangerang Selatan:\n• Sumur Jet Pump (20-30 meter): Mulai Rp3.500.000\n• Sumur Submersible (30-45 meter): Mulai Rp6.500.000\n• Sumur Dalam (50-60+ meter): Mulai Rp9.500.000\n\nBiaya sudah termasuk jasa pengeboran dan pipa casing tebal 4 inch tipe AW. Hubungi admin kami untuk survei titik air dan pengecekan lapisan tanah.`;
    }
  }

  // Warranty inquiries
  if (lower.includes("garansi") || lower.includes("klaim")) {
    return `Ya, seluruh layanan SiTeknik memiliki jaminan garansi resmi:\n• Instalasi Listrik: Garansi 30 - 90 hari kalender.\n• Servis & Cuci AC: Garansi 30 hari kalender (termasuk keluhan bocor air indoor).\n• Pengeboran Sumur: Garansi debit air 90 hari & garansi instalasi pipa 6 bulan.\n\nGaransi dijamin tanpa biaya tambahan jika terjadi kendala pada bagian yang dikerjakan oleh teknisi kami.`;
  }

  // Ac not cold inquiry
  if (lower.includes("tidak dingin") || lower.includes("kurang dingin") || lower.includes("bocor")) {
    return `AC yang tidak dingin bisa disebabkan oleh beberapa hal, seperti:\n1. Filter dan evaporator kotor atau tersumbat debu (perlu cuci AC).\n2. Tekanan freon berkurang akibat kebocoran pada nepel sambungan.\n3. Masalah pada kapasitor atau kompresor tidak bekerja normal.\n4. Kesalahan pengaturan remote atau kapasitas PK terlalu kecil untuk ukuran ruangan.\n\nUntuk mengetahui penyebab pastinya, teknisi kami perlu melakukan pemeriksaan langsung di lokasi. Apakah Anda ingin menjadwalkan pemeriksaan dengan admin kami?`;
  }

  // Coverage area inquiries
  if (lower.includes("wilayah") || lower.includes("area") || lower.includes("tangsel") || lower.includes("jangkauan") || lower.includes("ciputat") || lower.includes("pamulang") || lower.includes("bsd") || lower.includes("bintaro") || lower.includes("serpong")) {
    return `SiTeknik melayani seluruh area Tangerang Selatan dan sekitarnya, meliputi:\n• Ciputat & Ciputat Timur\n• Pamulang & Pondok Cabe\n• Pondok Aren & Bintaro Jaya (Sektor 1-9)\n• Serpong & BSD City\n• Serpong Utara & Alam Sutera\n• Setu\n\nKetersediaan teknisi dan waktu perjalanan disesuaikan dengan titik lokasi Anda. Silakan hubungi Admin untuk memastikan jadwal kunjungan terdekat!`;
  }

  // If there are relevant docs from knowledge base
  if (docs.length > 0) {
    const topDoc = docs[0];
    return `${topDoc.content}\n\nApakah ada hal lain mengenai ${topDoc.topic} atau layanan lainnya yang ingin Anda tanyakan? Anda juga dapat langsung berkonsultasi dengan Admin via WhatsApp.`;
  }

  // Default honest fallback
  return `Untuk pertanyaan dengan spesifikasi khusus tersebut, kami perlu mengonfirmasi detail kebutuhan dan kondisi di lapangan terlebih dahulu. Silakan hubungi Admin teknisi kami via WhatsApp agar mendapatkan informasi teknis dan penawaran harga yang lebih akurat.`;
}
