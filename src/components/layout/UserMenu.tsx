"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, ChevronDown, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

function dashboardPath(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "TEACHER") return "/teacher";
  if (role === "STUDENT") return "/student";
  return "/";
}

export default function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const dash = dashboardPath(user.role);
  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();
  const roleLabel =
    user.role === "ADMIN" ? "Administrator" : user.role === "TEACHER" ? "Teacher" : "Student";
  const showSettings = user.role === "STUDENT" || user.role === "TEACHER";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 bg-white transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
            {initial}
          </span>
        )}
        <span className="text-sm font-semibold text-slate-700 max-w-[8rem] truncate hidden sm:block">
          {user.name?.split(" ")[0] ?? "Account"}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* click-away overlay */}
          <button
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-100 rounded-2xl shadow-lg z-50 overflow-hidden py-1.5">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {roleLabel}
              </span>
            </div>
            <Link
              href={dash}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
            </Link>
            {showSettings && (
              <Link
                href={`${dash}/settings`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" /> Settings
              </Link>
            )}
            <div className="border-t border-slate-100 mt-1 pt-1">
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
