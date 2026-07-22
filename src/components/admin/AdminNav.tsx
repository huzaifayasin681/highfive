"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Flag,
  BookMarked,
  FileText,
  ScrollText,
  Inbox,
  Wallet,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/verification", label: "Verification", icon: ShieldCheck },
  { href: "/admin/moderation", label: "Moderation", icon: Flag },
  { href: "/admin/payments", label: "Payments", icon: Wallet },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/subjects", label: "Subjects", icon: BookMarked },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/audit", label: "Audit Log", icon: ScrollText },
];

export default function AdminNav({ pending = 0, unreadContact = 0 }: { pending?: number; unreadContact?: number }) {
  const pathname = usePathname();
  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              active ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <l.icon className="w-4 h-4" />
            {l.label}
            {l.href === "/admin/verification" && pending > 0 && (
              <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {pending}
              </span>
            )}
            {l.href === "/admin/inbox" && unreadContact > 0 && (
              <span className="ml-auto bg-highfive-blue text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {unreadContact}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
