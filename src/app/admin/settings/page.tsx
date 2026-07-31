import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const sessionUser = await requireRole("ADMIN");
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your administrator account details.</p>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
          <input
            disabled
            value={user?.name ?? ""}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            disabled
            value={user?.email ?? ""}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Security</h2>
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
