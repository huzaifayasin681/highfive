import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

const STATIC_ROUTES = [
  "",
  "/about",
  "/search",
  "/how-it-works/students",
  "/how-it-works/teachers",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const teachers = await prisma.user.findMany({
    where: {
      role: "TEACHER",
      status: "active",
      teacherProfile: { verificationStatus: "approved" },
    },
    select: { id: true, updatedAt: true },
  });

  const tutorEntries: MetadataRoute.Sitemap = teachers.map((t: { id: string; updatedAt: Date }) => ({
    url: `${SITE_URL}/tutors/${t.id}`,
    lastModified: t.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...tutorEntries];
}
