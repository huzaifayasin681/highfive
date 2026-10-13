import { prisma } from "@/lib/prisma";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  read: boolean;
  createdAt: Date;
};

/**
 * Notifies all active teachers when a new student joins the platform.
 */
export async function notifyTeachersOfNewStudent({
  studentName,
}: {
  studentName?: string | null;
}) {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER", status: "active" },
      select: { id: true },
    });

    if (teachers.length === 0) return;

    const name = studentName?.trim() || "A new student";

    await prisma.notification.createMany({
      data: teachers.map((t) => ({
        userId: t.id,
        title: "🎓 New Student Joined",
        message: `${name} just joined HighFive.`,
        type: "NEW_STUDENT",
        link: "/teacher/leads",
      })),
    });
  } catch (error) {
    console.error("Failed to notify teachers of new student:", error);
  }
}

/**
 * Notifies teachers when a student posts a new learning requirement.
 */
export async function notifyTeachersOfNewLead({
  studentName,
  subject,
  description,
}: {
  studentName?: string | null;
  subject: string;
  description: string;
}) {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER", status: "active" },
      select: { id: true },
    });

    if (teachers.length === 0) return;

    const name = studentName?.trim() || "A student";
    const snippet = description.length > 70 ? `${description.slice(0, 70)}…` : description;

    await prisma.notification.createMany({
      data: teachers.map((t) => ({
        userId: t.id,
        title: `📌 New Requirement: ${subject}`,
        message: `${name} posted a request for ${subject}: "${snippet}"`,
        type: "NEW_LEAD",
        link: "/teacher/leads",
      })),
    });
  } catch (error) {
    console.error("Failed to notify teachers of new lead:", error);
  }
}

/**
 * Retrieves notifications for a user.
 */
export async function getUserNotifications(userId: string, limit = 30): Promise<NotificationItem[]> {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Gets count of unread notifications for a user.
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}
