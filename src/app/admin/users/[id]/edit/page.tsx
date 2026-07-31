import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { adminUpdateUser } from "@/app/admin/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to users
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900">Edit User</h1>
        <p className="text-slate-500 mt-1">Update details for {user.name}.</p>
      </div>

      <form action={adminUpdateUser} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-xl">
        <input type="hidden" name="id" value={user.id} />
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <input
            name="name"
            defaultValue={user.name}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={user.email}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone (optional)</label>
          <input
            name="phone"
            defaultValue={user.phone ?? ""}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
            placeholder="03xx-xxxxxxx"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
          <select
            name="role"
            defaultValue={user.role}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm bg-white"
          >
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-highfive-blue text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-emerald-800 transition-colors"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
