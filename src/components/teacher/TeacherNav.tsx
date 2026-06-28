"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserCog, Inbox, Star, Settings } from "lucide-react";

const LINKS = [
  { href: "/teacher", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/teacher/profile", label: "My Profile", icon: UserCog },
  { href: "/teacher/leads", label: "Student Leads", icon: Inbox },
  { href: "/teacher/reviews", label: "Reviews", icon: Star },
  { href: "/teacher/settings", label: "Settings", icon: Settings },
];

export default function TeacherNav({ leads = 0 }: { leads?: number }) {
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
              active ? "bg-highfive-blue text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <l.icon className="w-4 h-4" />
            {l.label}
            {l.href === "/teacher/leads" && leads > 0 && (
              <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {leads}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
