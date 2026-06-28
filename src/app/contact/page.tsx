import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata = {
  title: "Contact Us — HighFive",
  description: "Get in touch with the HighFive team.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-5 text-sm font-medium text-emerald-100">
            <MessageCircle className="w-4 h-4 text-yellow-400" /> We&apos;d love to hear from you
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold">Contact Us</h1>
          <p className="text-slate-300 mt-3">Questions, feedback or partnership ideas — send us a message.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Info icon={Phone} label="Phone" value="+92 300 1234567" />
          <Info icon={Mail} label="Email" value="support@highfive.pk" />
          <Info icon={MapPin} label="Office" value="Lahore, Pakistan 🇵🇰" />
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-3">
      <div className="w-10 h-10 bg-emerald-50 text-highfive-blue rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs text-slate-400">{label}</div>
        <div className="font-semibold text-slate-900 text-sm">{value}</div>
      </div>
    </div>
  );
}
