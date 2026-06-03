/**
 * Single mutation endpoint for a "site" key (JSON blob).
 *   GET  /api/admin/site/[key]  -> { value }
 *   POST /api/admin/site/[key]  body: { value } -> { ok: true }
 */
import { NextResponse, type NextRequest } from "next/server";
import { getSite, setSite } from "@/lib/db";
import { hasAdminCookie } from "@/lib/auth";

const ALLOWED = new Set([
  "hero", "marquee", "philosophy", "visit", "contact", "meta", "instagram_feed",
]);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  if (!(await hasAdminCookie())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { key } = await params;
  if (!ALLOWED.has(key)) return NextResponse.json({ error: "invalid key" }, { status: 400 });
  const value = getSite(key, null);
  return NextResponse.json({ value });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  if (!(await hasAdminCookie())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { key } = await params;
  if (!ALLOWED.has(key)) return NextResponse.json({ error: "invalid key" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body.value === "undefined") {
    return NextResponse.json({ error: "missing value" }, { status: 400 });
  }
  setSite(key, body.value);
  return NextResponse.json({ ok: true });
}
