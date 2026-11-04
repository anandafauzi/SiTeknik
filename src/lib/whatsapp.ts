import { getDb } from "./db";

export interface BookingDetails {
  customerName?: string;
  serviceCategory: string;
  jobDetails: string;
  location: string;
  estimatedCost?: string;
  notes?: string;
  chatbotSummary?: string;
}

export function cleanPhoneNumber(phone: string): string {
  // Strip non-numeric characters
  let clean = phone.replace(/\D/g, "");
  // If starts with 08..., convert to 628...
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  }
  // Default to 6281234567890 if empty
  return clean || "6281234567890";
}

export function generateBookingWaUrl(details: BookingDetails, overridePhone?: string): string {
  const db = getDb();
  const phone = cleanPhoneNumber(overridePhone || db.settings.whatsappNumber);

  let message = `Halo Admin, saya ingin memesan layanan.\n\n`;
  message += `Nama: ${details.customerName || "[Nama Pelanggan]"}\n`;
  message += `Jenis Layanan: ${details.serviceCategory}\n`;
  message += `Detail Pekerjaan: ${details.jobDetails}\n`;
  message += `Lokasi: ${details.location || "Tangerang Selatan"}\n`;

  if (details.estimatedCost) {
    message += `Estimasi Biaya: ${details.estimatedCost}\n`;
  }

  if (details.notes) {
    message += `Catatan Tambahan: ${details.notes}\n`;
  }

  if (details.chatbotSummary) {
    message += `\nRingkasan Konsultasi Chatbot:\n${details.chatbotSummary}\n`;
  }

  message += `\nMohon informasi ketersediaan jadwal teknisi dan konfirmasi lebih lanjut. Terima kasih.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateDirectConsultationWaUrl(customMessage?: string): string {
  const db = getDb();
  const phone = cleanPhoneNumber(db.settings.whatsappNumber);

  const defaultMsg =
    customMessage ||
    `Halo Admin SiTeknik, saya ingin berkonsultasi mengenai jasa teknik dan perawatan rumah di area Tangerang Selatan. Mohon informasi layanan dan jadwal teknisi. Terima kasih.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;
}

