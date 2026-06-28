"use client";

import { SessionProvider } from "next-auth/react";
import { GlobalProvider } from "@/context/GlobalContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GlobalProvider>{children}</GlobalProvider>
    </SessionProvider>
  );
}
