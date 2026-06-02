/**
 * Shared admin auth: a secret URL token.
 * No password — just a hard-to-guess path. Suitable for low-stakes
 * single-editor CMS like this one.
 */
import { cookies, headers } from "next/headers";
import crypto from "node:crypto";

export const ADMIN_COOKIE = "psbjj_admin";
const COOKIE_TTL_DAYS = 30;

function getSecret(): string {
  return process.env.ADMIN_SECRET || "psbjj-admin-2026";
}

export function isValidSecret(token: string | null | undefined): boolean {
  if (!token) return false;
  if (token.length < 8) return false;
  const secret = getSecret();
  const len = Math.max(token.length, secret.length);
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(secret.slice(0, len).padEnd(len, "\0"))
  );
}

export async function setAdminCookie() {
  const c = await cookies();
  c.set(ADMIN_COOKIE, getSecret(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * COOKIE_TTL_DAYS,
    path: "/",
  });
}

export async function clearAdminCookie() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
}

export async function hasAdminCookie(): Promise<boolean> {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === getSecret();
}

export async function requireAdmin(): Promise<void> {
  if (!(await hasAdminCookie())) {
    throw new Error("UNAUTHORIZED");
  }
}
