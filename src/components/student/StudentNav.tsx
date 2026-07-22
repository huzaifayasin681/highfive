"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, MessageSquare, Star, Wallet, Settings } from "lucide-react";

const LINKS = [
  { href: "/student", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/student/requirements", label: "My Requirements", icon: ClipboardList },
  { href: "/student/messages", label: "Messages", icon: MessageSquare },
  { href: "/student/reviews", label: "My Reviews", icon: Star },
  { href: "/student/payments", label: "Payments", icon: Wallet },
  { href: "/student/settings", label: "Settings", icon: Settings },
];

export default function StudentNav({ unread = 0 }: { unread?: number }) {
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
              active
                ? "bg-highfive-blue text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <l.icon className="w-4 h-4" />
            {l.label}
            {l.href === "/student/messages" && unread > 0 && (
              <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
