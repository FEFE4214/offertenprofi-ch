import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function DashboardRedirectPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  redirect(session.role === "CRAFTSMAN" ? "/dashboard/handwerker" : "/dashboard/kunde");
}
