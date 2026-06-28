import { UserPlus, BadgeCheck, Inbox, TrendingUp } from "lucide-react";
import HowItWorks from "@/components/marketing/HowItWorks";

export const metadata = {
  title: "How It Works for Teachers — HighFive",
  description: "Build your profile, get verified and start teaching students across Pakistan.",
};

export default function TeachersHowItWorks() {
  return (
    <HowItWorks
      audience="Teachers"
      intro="Turn your expertise into income. Reach motivated students across Pakistan in four steps."
      ctaLabel="Become a Tutor"
      ctaHref="/register"
      steps={[
        { icon: UserPlus, title: "Create your profile", desc: "Sign up and build a profile with your subjects, qualifications, experience and hourly rate." },
        { icon: BadgeCheck, title: "Get verified", desc: "Our team reviews your profile. Once approved, you appear in the public tutor directory." },
        { icon: Inbox, title: "Browse student leads", desc: "See open student requirements filtered by subject and location, and find learners who need you." },
        { icon: TrendingUp, title: "Teach & grow", desc: "Deliver great lessons, collect reviews and build a reputation that attracts more students." },
      ]}
    />
  );
}
