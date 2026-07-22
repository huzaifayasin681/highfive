import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getSubjectNames } from "@/lib/queries";
import ProfileBuilder, { type ProfileData } from "@/components/teacher/ProfileBuilder";

export const dynamic = "force-dynamic";

export default async function TeacherProfilePage() {
  const user = await requireRole(["TEACHER", "ADMIN"]);

  const [profile, allSubjects] = await Promise.all([
    prisma.teacherProfile.findUnique({
      where: { userId: user.id },
      include: { subjects: { select: { name: true } } },
    }),
    getSubjectNames(),
  ]);

  const data: ProfileData = {
    bio: profile?.bio ?? "",
    qualifications: profile?.qualifications ?? "",
    experienceYears: profile?.experienceYears ?? null,
    hourlyRate: profile?.hourlyRate ?? null,
    mode: profile?.mode ?? null,
    location: profile?.location ?? "",
    photoUrl: profile?.photoUrl ?? "",
    videoUrl: profile?.videoUrl ?? "",
    responseTime: profile?.responseTime ?? "",
    subjects: profile?.subjects.map((s) => s.name) ?? [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">
          A complete profile gets more students. Changes go live once your account is verified.
        </p>
      </div>
      <ProfileBuilder data={data} allSubjects={allSubjects} />
    </div>
  );
}
