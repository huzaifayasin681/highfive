import Link from 'next/link';
import { GraduationCap, Phone, Mail, MapPin, Shield, Star, Users } from 'lucide-react';
import { FaXTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaFacebookF, FaWhatsapp } from 'react-icons/fa6';

const trust = [
  { icon: Shield, label: '100% Verified Tutors' },
  { icon: Star, label: '4.9★ Average Rating' },
  { icon: Users, label: '5,000+ Happy Students' },
];

const socials = [
  { Icon: FaXTwitter, label: 'X (Twitter)', href: '#', hover: 'hover:bg-slate-950' },
  { Icon: FaInstagram, label: 'Instagram', href: '#', hover: 'hover:bg-pink-600' },
  { Icon: FaLinkedinIn, label: 'LinkedIn', href: '#', hover: 'hover:bg-sky-700' },
  { Icon: FaYoutube, label: 'YouTube', href: '#', hover: 'hover:bg-red-600' },
  { Icon: FaFacebookF, label: 'Facebook', href: '#', hover: 'hover:bg-blue-600' },
  { Icon: FaWhatsapp, label: 'WhatsApp', href: '#', hover: 'hover:bg-emerald-600' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Trust badges row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14 pb-14 border-b border-slate-800">
          {trust.map((t, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800/60 rounded-2xl px-5 py-4 border border-slate-700/50">
              <div className="w-10 h-10 bg-emerald-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <t.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-white font-semibold text-sm">{t.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">

          {/* Brand col */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl flex items-center justify-center shadow">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white">High<span className="text-emerald-400">Five</span> Tutors</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              Pakistan's most trusted online tutoring platform. Connecting ambitious students with expert tutors since 2024.
            </p>
            <div className="space-y-2.5 text-sm mb-6">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>support@highfive.pk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Lahore, Pakistan 🇵🇰</span>
              </div>
            </div>
            {/* Social links */}
            <div className="flex gap-2.5">
              {socials.map(({ Icon, label, href, hover }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  className={`w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-300 hover:text-white ${hover} transition-all border border-slate-700`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">For Students</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Find a Tutor', href: '/search' },
                { label: 'How It Works', href: '/how-it-works/students' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'Browse Subjects', href: '/search' },
                { label: 'Sign Up', href: '/register' },
              ].map(l => (
                <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">For Tutors</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Become a Tutor', href: '/register' },
                { label: 'How It Works', href: '/how-it-works/teachers' },
                { label: 'Tutor Login', href: '/login' },
                { label: 'Browse Leads', href: '/teacher/leads' },
              ].map(l => (
                <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/terms' },
              ].map(l => (
                <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 rounded-2xl border border-emerald-800/40 p-6 mb-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-grow">
            <h4 className="text-white font-bold mb-1">Stay updated</h4>
            <p className="text-slate-400 text-sm">Get tips, tutor spotlights and study resources in your inbox.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-grow sm:w-56 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 placeholder:text-slate-500"
            />
            <button className="bg-highfive-blue hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm gap-3">
          <p>&copy; {new Date().getFullYear()} HighFive Tutors. All rights reserved.</p>
          <span className="text-slate-500">Made with ❤️ in Pakistan 🇵🇰</span>
        </div>
      </div>
    </footer>
  );
}
