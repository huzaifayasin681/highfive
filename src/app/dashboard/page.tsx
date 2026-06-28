import { redirect } from "next/navigation";
import { dashboardPathForRole, requireUser } from "@/lib/auth-helpers";

// Neutral landing target after login/registration — bounces the user to the
// correct home for their role.
export default async function DashboardRouter() {
  const user = await requireUser();
  redirect(dashboardPathForRole(user.role));
}
