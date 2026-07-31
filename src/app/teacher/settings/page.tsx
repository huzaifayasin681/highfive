import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import AccountForm from "@/components/teacher/AccountForm";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";

export const dynamic = "force-dynamic";

export default async function TeacherSettingsPage() {
  const sessionUser = await requireRole(["TEACHER", "ADMIN"]);
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account details.</p>
      </div>
      <AccountForm name={user?.name ?? ""} email={user?.email ?? ""} phone={user?.phone ?? ""} />
      <div>
        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Security</h2>
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
