"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { GlobalProvider } from "@/context/GlobalContext";

export default function Providers({ children, session }: { children: React.ReactNode, session?: Session | null }) {
  return (
    <SessionProvider session={session}>
      <GlobalProvider>{children}</GlobalProvider>
    </SessionProvider>
  );
}
