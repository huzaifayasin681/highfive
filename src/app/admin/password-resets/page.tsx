import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CheckCircle2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPasswordResetsPage() {
  await requireRole("ADMIN");

  const requests = await prisma.passwordResetRequest.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Password Reset Requests</h1>
        <p className="text-slate-500 mt-1">Approve or reject pending password reset requests from users.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No password reset requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{req.user.name}</p>
                      <p className="text-slate-500 text-xs">{req.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                        {req.user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {req.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {req.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg font-semibold text-xs">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === "PENDING" && (
                          <form
                            action={async () => {
                              "use server";
                              await requireRole("ADMIN");
                              await prisma.passwordResetRequest.update({
                                where: { id: req.id },
                                data: { status: "APPROVED" },
                              });
                              revalidatePath("/admin/password-resets");
                            }}
                          >
                            <button
                              className="flex items-center gap-1 text-xs font-semibold border border-emerald-200 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                          </form>
                        )}
                        <form
                          action={async () => {
                            "use server";
                            await requireRole("ADMIN");
                            await prisma.passwordResetRequest.delete({
                              where: { id: req.id },
                            });
                            revalidatePath("/admin/password-resets");
                          }}
                        >
                          <button
                            className="flex items-center gap-1 text-xs font-semibold border border-red-200 text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
