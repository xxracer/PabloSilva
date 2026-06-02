/**
 * Image upload endpoint.
 *   POST /api/admin/upload  multipart/form-data with `file` field
 *   -> { url, filename, size, mime, storage: "blob" | "local" }
 *
 * Storage strategy:
 *  - If BLOB_READ_WRITE_TOKEN is set (Vercel prod), the file is uploaded to
 *    Vercel Blob. The public URL is the absolute blob URL.
 *  - Otherwise the file is written to /public/uploads/YYYY/MM/<id>.<ext>
 *    so the dev server can still serve it.
 *
 * The file is never served from the request body — we read it as ArrayBuffer
 * once and either POST it to Vercel Blob or persist it to disk.
 */
import { NextResponse, type NextRequest } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { put } from "@vercel/blob";
import { hasAdminCookie } from "@/lib/auth";
import { db } from "@/lib/db";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const ALLOWED_MIME = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml",
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function extFromMime(m: string): string {
  switch (m) {
    case "image/jpeg": return "jpg";
    case "image/png": return "png";
    case "image/webp": return "webp";
    case "image/gif": return "gif";
    case "image/avif": return "avif";
    case "image/svg+xml": return "svg";
    default: return "bin";
  }
}

function safeName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
}

export async function POST(req: NextRequest) {
  if (!(await hasAdminCookie())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "expected multipart/form-data" }, { status: 400 });
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no file" }, { status: 400 });
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: `unsupported mime: ${file.type}` }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: `file too large (max ${MAX_SIZE / 1024 / 1024}MB)` }, { status: 400 });
  }

  const now = new Date();
  const y = String(now.getUTCFullYear());
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const id = crypto.randomBytes(6).toString("hex");
  const ext = extFromMime(file.type);
  const filename = `${id}-${safeName(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  // --- Vercel Blob (production) -------------------------------------------
  if (blobToken) {
    const pathname = `uploads/${y}/${m}/${filename}`;
    const blob = await put(pathname, file, {
      access: "public",
      token: blobToken,
      contentType: file.type,
      addRandomSuffix: false,
    });
    db.prepare(
      `INSERT OR REPLACE INTO uploads (id, filename, original_name, mime, size) VALUES (?, ?, ?, ?, ?)`
    ).run(`u-${id}`, blob.url, file.name, file.type, file.size);
    return NextResponse.json({
      url: blob.url,
      filename,
      originalName: file.name,
      size: file.size,
      mime: file.type,
      storage: "blob",
    });
  }

  // --- Local disk (development fallback) -----------------------------------
  const dir = path.join(UPLOAD_ROOT, y, m);
  await fs.mkdir(dir, { recursive: true });
  const fullPath = path.join(dir, filename);
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(fullPath, buf);

  const publicUrl = `/uploads/${y}/${m}/${filename}`;
  db.prepare(
    `INSERT OR REPLACE INTO uploads (id, filename, original_name, mime, size) VALUES (?, ?, ?, ?, ?)`
  ).run(`u-${id}`, publicUrl, file.name, file.type, file.size);

  return NextResponse.json({
    url: publicUrl,
    filename,
    originalName: file.name,
    size: file.size,
    mime: file.type,
    storage: "local",
  });
}
