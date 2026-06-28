import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  status: string;
};

/** Returns the current session user, or null if signed out. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user as SessionUser;
}

/**
 * Server-side gate. Use inside server components, route handlers and server
 * actions — never rely on proxy.ts alone (see Next.js data-security guide).
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Requires one of the given roles, otherwise redirects to the user's own home. */
export async function requireRole(
  roles: string | string[]
): Promise<SessionUser> {
  const user = await requireUser();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) {
    redirect(dashboardPathForRole(user.role));
  }
  return user;
}

/** Where a user lands after logging in, based on their role. */
export function dashboardPathForRole(role: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "TEACHER":
      return "/teacher";
    case "STUDENT":
      return "/student";
    default:
      return "/";
  }
}
