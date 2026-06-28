import { Search, MessageSquare, Video, Star } from "lucide-react";
import HowItWorks from "@/components/marketing/HowItWorks";

export const metadata = {
  title: "How It Works for Students — HighFive",
  description: "Find and connect with the right tutor in four simple steps.",
};

export default function StudentsHowItWorks() {
  return (
    <HowItWorks
      audience="Students"
      intro="Finding the right tutor in Pakistan has never been easier. Here's how to get started."
      ctaLabel="Find a Tutor"
      ctaHref="/search"
      steps={[
        { icon: Search, title: "Search & filter", desc: "Browse verified tutors by subject, city, price and rating to find your perfect match." },
        { icon: MessageSquare, title: "Post your requirement", desc: "Tell tutors exactly what you need — subject, level, budget and schedule — and let them reach you." },
        { icon: Video, title: "Connect & learn", desc: "Start lessons online or in person at a time that suits you, at a price you agree on." },
        { icon: Star, title: "Rate your tutor", desc: "Leave a review after your sessions to help other students across Pakistan choose well." },
      ]}
    />
  );
}
