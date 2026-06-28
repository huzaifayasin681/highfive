import { prisma } from "@/lib/prisma";

/** Records an admin action in the audit log. */
export async function logAudit(
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  detail?: string
) {
  await prisma.auditLog.create({
    data: { actorId, action, targetType, targetId, detail: detail ?? null },
  });
}

export async function getPlatformStats() {
  const [students, teachers, admins, requirements, messages, reviews, pendingTeachers] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.requirement.count(),
      prisma.message.count(),
      prisma.review.count(),
      prisma.teacherProfile.count({ where: { verificationStatus: "pending" } }),
    ]);
  return { students, teachers, admins, requirements, messages, reviews, pendingTeachers };
}

export type SignupPoint = { date: string; label: string; count: number };

/** Daily signup counts for the last `days` days (oldest → newest). */
export async function getSignupSeries(days = 14): Promise<SignupPoint[]> {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const users = await prisma.user.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const u of users) {
    const key = u.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()].map(([date, count]) => ({
    date,
    label: new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
    count,
  }));
}
