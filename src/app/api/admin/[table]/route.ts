/**
 * CRUD for programs, instructors, gallery, testimonials, faq, hours, nav.
 *   GET  /api/admin/[table]              -> all
 *   POST /api/admin/[table]              body: row -> insert
 *   GET  /api/admin/[table]/[id]         -> one
 *   PUT  /api/admin/[table]/[id]         body: partial row -> update
 *   DELETE /api/admin/[table]/[id]       -> delete
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hasAdminCookie } from "@/lib/auth";

const TABLES = new Set([
  "programs", "instructors", "gallery_items",
  "testimonials", "faq", "hours", "nav_links",
]);

function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function col(t: string): string[] {
  return (db.prepare(`PRAGMA table_info(${t})`).all() as { name: string }[]).map(r => r.name);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  if (!(await hasAdminCookie())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table } = await params;
  if (!TABLES.has(table)) return NextResponse.json({ error: "invalid table" }, { status: 400 });
  const rows = db.prepare(`SELECT * FROM ${table} ORDER BY sort ASC, id ASC`).all();
  return NextResponse.json({ rows });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  if (!(await hasAdminCookie())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table } = await params;
  if (!TABLES.has(table)) return NextResponse.json({ error: "invalid table" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "missing body" }, { status: 400 });
  }

  // Detect json fields that need stringification
  const jsonCols: Record<string, RegExp> = {
    programs: /details_json/,
    instructors: /tags_json/,
  };
  const cols = col(table);
  const data: Record<string, unknown> = {};
  for (const c of cols) {
    if (c === "id" || c === "updated_at") continue;
    if (c in body) {
      let v = (body as Record<string, unknown>)[c];
      if (jsonCols[table]?.test(c) && typeof v !== "string") {
        v = JSON.stringify(v ?? []);
      }
      data[c] = v;
    }
  }
  const id = (body.id as string) || nextId(table.slice(0, 3));
  data.id = id;

  const keys = Object.keys(data);
  const placeholders = keys.map(() => "?").join(",");
  const values = keys.map(k => data[k]);

  try {
    db.prepare(
      `INSERT INTO ${table} (${keys.join(",")}) VALUES (${placeholders})`
    ).run(...values);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  return NextResponse.json({ row });
}
