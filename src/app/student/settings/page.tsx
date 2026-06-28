import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/student/SettingsForm";

export const dynamic = "force-dynamic";

export default async function StudentSettingsPage() {
  const sessionUser = await requireRole(["STUDENT", "ADMIN"]);
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: { studentProfile: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account details.</p>
      </div>
      <SettingsForm
        name={user?.name ?? ""}
        email={user?.email ?? ""}
        phone={user?.phone ?? ""}
        location={user?.studentProfile?.location ?? ""}
      />
    </div>
  );
}
