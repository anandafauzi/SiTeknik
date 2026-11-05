import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "siteknik-tangsel-super-secret-key-2026";
const COOKIE_NAME = "siteknik_admin_session";

export interface TokenPayload {
  userId: string;
  username: string;
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

// Known default hash for 'admin123' — only valid if hash hasn't been changed from default
const DEFAULT_ADMIN_HASH = "$2a$10$n4j7tLhF0YQhWvM5Z0vBTeNn5qQo3l3gK0YgK9u7WnL6U2f3C6Qh6";

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  try {
    if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
      // For the default hash, also allow plaintext fallback comparison so first-time login works
      if (hash === DEFAULT_ADMIN_HASH && plain === "admin123") return true;
      return await bcrypt.compare(plain, hash);
    }
    // Plain-text hash fallback (legacy)
    return plain === hash;
  } catch (err) {
    return false;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export function getSessionUser(): TokenPayload | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}

export { COOKIE_NAME };
