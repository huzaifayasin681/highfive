import LegalPage from "@/components/marketing/LegalPage";

export const metadata = { title: "Terms of Service — HighFive" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 2026"
      sections={[
        { heading: "Acceptance of terms", body: "By creating an account or using HighFive, you agree to these Terms of Service. If you do not agree, please do not use the platform." },
        { heading: "Accounts", body: "You are responsible for keeping your login credentials secure and for all activity under your account. You must provide accurate information and be at least 13 years old to register." },
        { heading: "Tutors & students", body: "HighFive is a marketplace that connects students with independent tutors. Lessons, schedules and fees are arranged directly between students and tutors. HighFive does not employ tutors." },
        { heading: "Conduct", body: "You agree not to post unlawful, misleading or abusive content. We may remove content and suspend or delete accounts that violate these terms." },
        { heading: "Reviews", body: "Reviews must reflect genuine experiences. We may remove reviews that are fraudulent, defamatory or violate our policies." },
        { heading: "Limitation of liability", body: "HighFive is provided 'as is'. To the extent permitted by law, we are not liable for disputes between students and tutors or for the quality of lessons arranged through the platform." },
        { heading: "Changes", body: "We may update these terms from time to time. Continued use of HighFive after changes constitutes acceptance of the updated terms." },
      ]}
    />
  );
}
