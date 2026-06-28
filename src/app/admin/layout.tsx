import { ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import SignOutButton from "@/components/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("ADMIN");
  const [pending, unreadContact] = await Promise.all([
    prisma.teacherProfile.count({ where: { verificationStatus: "pending" } }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 lg:sticky lg:top-24">
              <div className="flex items-center gap-2.5 px-2 pb-4 mb-2 border-b border-slate-100">
                <div className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </div>
              <AdminNav pending={pending} unreadContact={unreadContact} />
              <div className="mt-2 pt-2 border-t border-slate-100">
                <SignOutButton />
              </div>
            </div>
          </aside>

          <div className="flex-grow min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
