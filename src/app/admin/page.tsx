/**
 * Admin entry point. If the user is already authenticated, jump to the panel.
 * Otherwise, ask for the admin link.
 */
import { redirect } from "next/navigation";
import { hasAdminCookie } from "@/lib/auth";
import AdminLogin from "./admin-login";

export const dynamic = "force-dynamic";

export default async function AdminIndex() {
  if (await hasAdminCookie()) redirect("/admin/panel");
  return <AdminLogin />;
}
