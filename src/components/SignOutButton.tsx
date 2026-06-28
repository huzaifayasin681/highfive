"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

// Always-visible logout control used in every dashboard sidebar.
export default function SignOutButton({
  className = "",
}: {
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await signOut({ callbackUrl: "/" });
      }}
      className={
        className ||
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-60"
      }
    >
      <LogOut className="w-4 h-4" />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
