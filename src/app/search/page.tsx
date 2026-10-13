import TutorDirectory from "@/components/TutorDirectory";
import { getDirectoryTeachers } from "@/lib/queries";

export const metadata = {
  title: "Find a Tutor",
  description: "Browse verified tutors across Pakistan. Filter by subject, price, and rating.",
  alternates: { canonical: "/search" },
};

// Always reflect the latest verified teachers.
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; subject?: string }>;
}) {
  const { q, subject } = await searchParams;
  const tutors = await getDirectoryTeachers();
  return <TutorDirectory tutors={tutors} initialQuery={q} initialSubject={subject} />;
}
