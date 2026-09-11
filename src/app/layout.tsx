import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/AuthModal";
import FloatingContact from "@/components/ui/FloatingContact";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Find Expert Tutors in Pakistan`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "tutors in Pakistan",
    "online tutoring",
    "home tutor",
    "MDCAT tutor",
    "ECAT tutor",
    "IELTS tutor",
    "Mathematics tutor",
    "Physics tutor",
    "HighFive Tutors",
  ],
  authors: [{ name: SITE_NAME }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Find Expert Tutors in Pakistan`,
    description: SITE_DESCRIPTION,
    locale: "en_PK",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Find Expert Tutors in Pakistan`,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground">
        <Providers session={session}>
          <Navbar />
          <ContactModal />
          <main className="flex-grow">
            {children}
          </main>
          <FloatingContact />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
