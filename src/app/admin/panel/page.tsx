import { redirect } from "next/navigation";
import { hasAdminCookie } from "@/lib/auth";
import Panel from "./panel";

export const dynamic = "force-dynamic";

export default async function AdminPanel() {
  if (!(await hasAdminCookie())) redirect("/admin");
  return <Panel />;
}
