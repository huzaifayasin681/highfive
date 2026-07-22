import { requireRole } from "@/lib/auth-helpers";
import { getOpenLeads } from "@/lib/teacher";
import { getSubscription, PRICES } from "@/lib/payments";
import LeadsBrowser from "@/components/teacher/LeadsBrowser";
import SubscriptionGate from "@/components/teacher/SubscriptionGate";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const user = await requireRole(["TEACHER", "ADMIN"]);

  // Admins always have access; teachers need an active subscription to view and
  // contact student leads.
  if (user.role === "TEACHER") {
    const sub = await getSubscription(user.id);
    if (!sub.active) {
      return <SubscriptionGate price={PRICES.TEACHER_SUBSCRIPTION} />;
    }
  }

  const leads = await getOpenLeads();
  return <LeadsBrowser leads={leads} />;
}
