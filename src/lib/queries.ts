import { prisma } from "@/lib/prisma";
import type { Tutor } from "@/types";

// Shape returned by Prisma when a teacher's user + profile + subjects are loaded.
type TeacherRow = {
  id: string;
  name: string;
  image: string | null;
  teacherProfile: {
    bio: string | null;
    qualifications: string | null;
    experienceYears: number | null;
    hourlyRate: number | null;
    location: string | null;
    mode: string | null;
    photoUrl: string | null;
    videoUrl: string | null;
    verified: boolean;
    rating: number;
    reviewsCount: number;
    online: boolean;
    responseTime: string | null;
    studentsTaught: number;
    subjects: { name: string }[];
  } | null;
};

function fallbackAvatar(id: string) {
  return `https://i.pravatar.cc/150?u=${id}`;
}

/** Maps a DB teacher (user + profile) into the `Tutor` view the UI components use. */
export function mapTeacher(row: TeacherRow): Tutor {
  const p = row.teacherProfile;
  const city = p?.location?.split(",")[0]?.trim() || undefined;
  return {
    id: row.id, // the User id — used as the contact/review target
    name: row.name,
    avatar: p?.photoUrl || row.image || fallbackAvatar(row.id),
    subjects: p?.subjects.map((s) => s.name) ?? [],
    qualifications: p?.qualifications
      ? p.qualifications.split("\n").filter(Boolean)
      : [],
    rate: p?.hourlyRate ?? 0,
    rating: p?.rating ?? 0,
    reviewsCount: p?.reviewsCount ?? 0,
    isFeatured: false,
    bio: p?.bio ?? "",
    status: p?.verified ? "approved" : "pending",
    city,
    online: p?.online,
    responseTime: p?.responseTime ?? undefined,
    experienceYears: p?.experienceYears ?? undefined,
    studentsTaught: p?.studentsTaught,
    mode: (p?.mode as Tutor["mode"]) ?? undefined,
    videoUrl: p?.videoUrl ?? undefined,
  };
}

const teacherInclude = {
  teacherProfile: { include: { subjects: { select: { name: true } } } },
} as const;

/** All publicly listable teachers (active account, approved profile). */
export async function getDirectoryTeachers(): Promise<Tutor[]> {
  const rows = await prisma.user.findMany({
    where: {
      role: "TEACHER",
      status: "active",
      teacherProfile: { verificationStatus: "approved" },
    },
    include: teacherInclude,
    orderBy: { teacherProfile: { rating: "desc" } },
  });
  return rows.map(mapTeacher);
}

/** A single teacher's public profile with its visible reviews. */
export async function getTeacherProfile(userId: string) {
  const row = await prisma.user.findFirst({
    where: { id: userId, role: "TEACHER" },
    include: teacherInclude,
  });
  if (!row || !row.teacherProfile) return null;

  const reviews = await prisma.review.findMany({
    where: { targetId: userId, hidden: false },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return {
    tutor: mapTeacher(row),
    reviews: reviews.map((r) => ({
      id: r.id,
      authorName: r.author.name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
  };
}

/** Distinct subject names for filter pills. */
export async function getSubjectNames(): Promise<string[]> {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    select: { name: true },
  });
  return subjects.map((s) => s.name);
}
