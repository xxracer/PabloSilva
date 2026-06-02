/**
 * Secret-in-URL entry — sets the admin cookie and redirects to the panel.
 *
 * Implemented as a Route Handler (not a page) because Next 16 disallows
 * `cookies().set()` from Server Component render. See
 * node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md
 * — "Setting cookies is not supported during Server Component rendering."
 *
 * Visiting /admin/login/<secret> with the right secret sets an httpOnly
 * cookie and 307s to /admin/panel.
 */
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidSecret } from "@/lib/auth";

const COOKIE_TTL_DAYS = 30;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ secret: string }> },
) {
  const { secret } = await params;
  if (!isValidSecret(secret)) {
    // Render a small inline "invalid link" page.
    return new NextResponse(
      `<!doctype html><html><head><meta charset="utf-8"/><title>Invalid admin link</title>
      <style>
        body { min-height: 100dvh; display: grid; place-items: center; background: #111; color: #eee;
               font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 2rem; }
        .card { text-align: center; max-width: 420px; }
        h1 { font-size: 1.4rem; margin: 0 0 .5rem; }
        p { opacity: .7; margin: 0 0 1.4rem; }
        a { display: inline-block; padding: .8rem 1.4rem; background: #8a6a3d; color: #fff;
            text-decoration: none; border-radius: 999px; font-size: .9rem; }
      </style></head><body><div class="card">
        <h1>Invalid link</h1>
        <p>This admin link is not valid.</p>
        <a href="/admin">Back to admin</a>
      </div></body></html>`,
      { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const res = NextResponse.redirect(new URL("/admin/panel", _req.url), 307);
  res.cookies.set(ADMIN_COOKIE, process.env.ADMIN_SECRET || "psbjj-admin-2026", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * COOKIE_TTL_DAYS,
    path: "/",
  });
  return res;
}
