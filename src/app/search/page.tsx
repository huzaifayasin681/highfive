import TutorDirectory from "@/components/TutorDirectory";
import { getDirectoryTeachers } from "@/lib/queries";

export const metadata = {
  title: "Find a Tutor — HighFive",
  description: "Browse verified tutors across Pakistan. Filter by subject, price, and rating.",
};

// Always reflect the latest verified teachers.
export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const tutors = await getDirectoryTeachers();
  return <TutorDirectory tutors={tutors} />;
}
