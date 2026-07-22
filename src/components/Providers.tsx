"use client";

import { SessionProvider } from "next-auth/react";
import { GlobalProvider } from "@/context/GlobalContext";

export default function Providers({ children, session }: { children: React.ReactNode, session?: any }) {
  return (
    <SessionProvider session={session}>
      <GlobalProvider>{children}</GlobalProvider>
    </SessionProvider>
  );
}
