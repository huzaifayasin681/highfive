import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { isRegistrationPaid } from "@/lib/payments";
import { ensureRegistrationPayment } from "@/app/checkout/actions";

export const dynamic = "force-dynamic";

// Students land here right after sign-up. Teachers/admins have no registration
// fee, so bounce them to their dashboard.
export default async function RegistrationCheckout() {
  const user = await requireUser();
  if (user.role !== "STUDENT") redirect("/dashboard");
  if (await isRegistrationPaid(user.id)) redirect("/student");

  const orderId = await ensureRegistrationPayment(user.id);
  redirect(`/checkout/${orderId}`);
}
