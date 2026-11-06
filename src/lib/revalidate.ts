import { revalidatePath } from "next/cache";
import { invalidateDbCache } from "./db";

/**
 * Revalidates all public paths and clears in-memory database cache
 * so any edits in the admin panel are immediately visible on the public site.
 */
export function revalidateAllPublicPages(): void {
  invalidateDbCache();
  try {
    revalidatePath("/");
    revalidatePath("/");
    revalidatePath("/galeri");
    revalidatePath("/kalkulator");
    revalidatePath("/tentang-kami");
    revalidatePath("/kontak");
    revalidatePath("/layanan/listrik");
    revalidatePath("/layanan/ac");
    revalidatePath("/layanan/bor-sumur");
  } catch (err) {
    console.warn("[revalidate] revalidatePath warning:", err);
  }
}

