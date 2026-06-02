import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hasAdminCookie } from "@/lib/auth";

const TABLES = new Set([
  "programs", "instructors", "gallery_items",
  "testimonials", "faq", "hours", "nav_links",
]);

const JSON_COLS: Record<string, string> = {
  programs: "details_json",
  instructors: "tags_json",
};

function col(t: string): string[] {
  return (db.prepare(`PRAGMA table_info(${t})`).all() as { name: string }[]).map(r => r.name);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  if (!(await hasAdminCookie())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table, id } = await params;
  if (!TABLES.has(table)) return NextResponse.json({ error: "invalid table" }, { status: 400 });
  const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ row });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  if (!(await hasAdminCookie())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table, id } = await params;
  if (!TABLES.has(table)) return NextResponse.json({ error: "invalid table" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "missing body" }, { status: 400 });
  }

  const cols = col(table);
  const jsonCol = JSON_COLS[table];
  const data: Record<string, unknown> = {};
  for (const c of cols) {
    if (c === "id" || c === "updated_at") continue;
    if (c in body) {
      let v = (body as Record<string, unknown>)[c];
      if (c === jsonCol && typeof v !== "string") {
        v = JSON.stringify(v ?? []);
      }
      data[c] = v;
    }
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  }
  data.updated_at = Math.floor(Date.now() / 1000);

  const sets = Object.keys(data).map(k => `${k} = ?`).join(",");
  const values = [...Object.values(data), id];
  db.prepare(`UPDATE ${table} SET ${sets} WHERE id = ?`).run(...values);
  const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  return NextResponse.json({ row });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  if (!(await hasAdminCookie())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table, id } = await params;
  if (!TABLES.has(table)) return NextResponse.json({ error: "invalid table" }, { status: 400 });
  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  return NextResponse.json({ ok: true });
}
