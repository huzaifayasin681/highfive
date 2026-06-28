import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import RequirementsManager, {
  type RequirementDTO,
} from "@/components/student/RequirementsManager";

export const dynamic = "force-dynamic";

export default async function RequirementsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const { new: isNew } = await searchParams;

  const rows = await prisma.requirement.findMany({
    where: { studentId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const requirements: RequirementDTO[] = rows.map((r) => ({
    id: r.id,
    subject: r.subject,
    level: r.level,
    mode: r.mode,
    budget: r.budget,
    location: r.location,
    description: r.description,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));

  return <RequirementsManager requirements={requirements} openInitially={isNew === "1"} />;
}
