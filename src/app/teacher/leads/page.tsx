import { requireRole } from "@/lib/auth-helpers";
import { getOpenLeads } from "@/lib/teacher";
import LeadsBrowser from "@/components/teacher/LeadsBrowser";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  await requireRole(["TEACHER", "ADMIN"]);
  const leads = await getOpenLeads();
  return <LeadsBrowser leads={leads} />;
}
