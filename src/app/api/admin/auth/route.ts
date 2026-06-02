/**
 * Login: GET with the secret as ?secret=... -> sets the cookie and redirects to the panel.
 * Logout: GET with ?logout=1 -> clears cookie and redirects to /admin.
 *
 * Implemented as a Route Handler (not a page) so Set-Cookie actually
 * reaches the browser — Next 16 forbids .set()/.delete() in pages.
 */
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidSecret } from "@/lib/auth";

const COOKIE_TTL_DAYS = 30;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const logout = url.searchParams.get("logout") === "1";

  if (logout) {
    const res = NextResponse.redirect(new URL("/admin", req.url), 307);
    res.cookies.set(ADMIN_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });
    return res;
  }

  const secret = url.searchParams.get("secret");
  if (!isValidSecret(secret)) {
    return NextResponse.json({ error: "invalid secret" }, { status: 401 });
  }

  const res = NextResponse.redirect(new URL("/admin/panel", req.url), 307);
  res.cookies.set(ADMIN_COOKIE, process.env.ADMIN_SECRET || "psbjj-admin-2026", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * COOKIE_TTL_DAYS,
    path: "/",
  });
  return res;
}
