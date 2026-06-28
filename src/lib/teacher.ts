import { prisma } from "@/lib/prisma";

export const MIN_BIO_LENGTH = 100;

export type TeacherProfileShape = {
  bio: string | null;
  qualifications: string | null;
  experienceYears: number | null;
  hourlyRate: number | null;
  mode: string | null;
  photoUrl: string | null;
  location: string | null;
  subjects?: { name: string }[];
};

export type CompletionItem = { label: string; done: boolean };
export type Completion = { percent: number; items: CompletionItem[] };

/** Profile completion checklist + percentage shown in the teacher dashboard. */
export function computeCompletion(p: TeacherProfileShape | null): Completion {
  const items: CompletionItem[] = [
    { label: "Profile photo", done: !!p?.photoUrl },
    { label: `Bio (min ${MIN_BIO_LENGTH} characters)`, done: (p?.bio?.trim().length ?? 0) >= MIN_BIO_LENGTH },
    { label: "At least one subject", done: (p?.subjects?.length ?? 0) > 0 },
    { label: "Qualifications", done: !!p?.qualifications?.trim() },
    { label: "Years of experience", done: p?.experienceYears != null },
    { label: "Hourly rate", done: p?.hourlyRate != null },
    { label: "Teaching mode", done: !!p?.mode },
    { label: "Location", done: !!p?.location?.trim() },
  ];
  const done = items.filter((i) => i.done).length;
  return { percent: Math.round((done / items.length) * 100), items };
}

export type Lead = {
  id: string;
  subject: string;
  level: string | null;
  mode: string | null;
  budget: string | null;
  location: string | null;
  description: string;
  studentName: string;
  createdAt: string;
};

/** Open student requirements, newest first (view-only leads for teachers). */
export async function getOpenLeads(): Promise<Lead[]> {
  const rows = await prisma.requirement.findMany({
    where: { status: "open" },
    include: { student: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    subject: r.subject,
    level: r.level,
    mode: r.mode,
    budget: r.budget,
    location: r.location,
    description: r.description,
    studentName: r.student.name,
    createdAt: r.createdAt.toISOString(),
  }));
}
