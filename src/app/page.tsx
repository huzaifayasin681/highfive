import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/seo";

import { getDirectoryTeachers } from "@/lib/queries";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — Find Expert Tutors in Pakistan`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  sameAs: [],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function Home() {
  const tutors = await getDirectoryTeachers();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient tutors={tutors} />
    </>
  );
}
