import { NextResponse } from "next/server";
import { auth } from "@/auth";

// proxy.ts replaces middleware.ts in Next.js 16 (Node.js runtime).
// First line of defense for route gating — every server action / route handler
// also re-checks auth server-side (see src/lib/auth-helpers.ts), as the
// Next.js data-security guide recommends.

// Path prefix -> roles allowed to access it.
const ROLE_RULES: { prefix: string; roles: string[] }[] = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/teacher", roles: ["TEACHER", "ADMIN"] },
  { prefix: "/student", roles: ["STUDENT", "ADMIN"] },
  { prefix: "/dashboard", roles: ["STUDENT", "TEACHER", "ADMIN"] },
];

function homeForRole(role?: string): string {
  if (role === "ADMIN") return "/admin";
  if (role === "TEACHER") return "/teacher";
  if (role === "STUDENT") return "/student";
  return "/";
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user as { role?: string } | undefined;

  // Signed-in users shouldn't see the auth pages.
  if ((pathname === "/login" || pathname === "/register") && user) {
    return NextResponse.redirect(new URL(homeForRole(user.role), req.nextUrl));
  }

  const rule = ROLE_RULES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  // Not signed in -> login, preserving the intended destination.
  if (!user) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Signed in but wrong role -> their own home.
  if (!rule.roles.includes(user.role ?? "")) {
    return NextResponse.redirect(new URL(homeForRole(user.role), req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/dashboard/:path*", "/login", "/register"],
};
