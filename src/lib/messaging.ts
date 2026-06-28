import { prisma } from "@/lib/prisma";

/** Deterministic thread id for a pair of users, independent of who started it. */
export function threadIdFor(a: string, b: string): string {
  return [a, b].sort().join("__");
}

export type ThreadSummary = {
  threadId: string;
  otherUser: { id: string; name: string; image: string | null; role: string };
  lastMessage: string;
  lastAt: Date;
  unread: number;
};

/** Conversation list for a user: one row per thread with the latest message. */
export async function getThreadsForUser(userId: string): Promise<ThreadSummary[]> {
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    orderBy: { createdAt: "desc" },
  });

  const byThread = new Map<string, typeof messages>();
  for (const m of messages) {
    if (!byThread.has(m.threadId)) byThread.set(m.threadId, []);
    byThread.get(m.threadId)!.push(m);
  }

  const otherIds = new Set<string>();
  for (const m of messages) {
    otherIds.add(m.senderId === userId ? m.receiverId : m.senderId);
  }
  const others = await prisma.user.findMany({
    where: { id: { in: [...otherIds] } },
    select: { id: true, name: true, image: true, role: true },
  });
  const otherMap = new Map(others.map((u) => [u.id, u]));

  const summaries: ThreadSummary[] = [];
  for (const [threadId, msgs] of byThread) {
    const latest = msgs[0];
    const otherId = latest.senderId === userId ? latest.receiverId : latest.senderId;
    const other = otherMap.get(otherId);
    if (!other) continue;
    summaries.push({
      threadId,
      otherUser: other,
      lastMessage: latest.content,
      lastAt: latest.createdAt,
      unread: msgs.filter((m) => m.receiverId === userId && !m.readAt).length,
    });
  }
  summaries.sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime());
  return summaries;
}

/** Full thread between the viewer and the other participant, or null if no access. */
export async function getThread(threadId: string, viewerId: string) {
  if (!threadId.includes("__")) return null;
  const [a, b] = threadId.split("__");
  if (viewerId !== a && viewerId !== b) return null;

  const otherId = viewerId === a ? b : a;
  const other = await prisma.user.findUnique({
    where: { id: otherId },
    select: { id: true, name: true, image: true, role: true },
  });
  if (!other) return null;

  const messages = await prisma.message.findMany({
    where: { threadId },
    orderBy: { createdAt: "asc" },
  });

  // Mark inbound messages as read.
  await prisma.message.updateMany({
    where: { threadId, receiverId: viewerId, readAt: null },
    data: { readAt: new Date() },
  });

  return { threadId, other, messages };
}
