import LegalPage from "@/components/marketing/LegalPage";

export const metadata = { title: "Privacy Policy — HighFive" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 2026"
      sections={[
        { heading: "Information we collect", body: "We collect the information you provide when you register and use HighFive — such as your name, email, phone, location, profile details, requirements, messages and reviews." },
        { heading: "How we use your information", body: "We use your information to operate the platform: matching students with tutors, enabling messaging, displaying profiles and reviews, and improving our services." },
        { heading: "Sharing", body: "Public profile information (for tutors) and reviews are visible to other users. We do not sell your personal data. We may share data with service providers who help us run the platform." },
        { heading: "Security", body: "Passwords are stored hashed. We take reasonable measures to protect your data, but no system is completely secure." },
        { heading: "Your choices", body: "You can edit your profile and account details at any time from your dashboard, and request deletion of your account by contacting us." },
        { heading: "Contact", body: "For privacy questions, reach us through the Contact page or at support@highfive.pk." },
      ]}
    />
  );
}
