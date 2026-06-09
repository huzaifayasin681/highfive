import Link from 'next/link';
import { GraduationCap, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl flex items-center justify-center shadow">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">HighFive Tutors</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Pakistan's best online tutoring platform. Connecting thousands of students with expert tutors across the country.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-highfive-blue flex-shrink-0" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-highfive-blue flex-shrink-0" />
                <span>support@highfive.pk</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-highfive-blue flex-shrink-0" />
                <span>Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-white font-bold mb-4">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search" className="hover:text-white transition-colors">Find a Tutor</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">MDCAT Prep</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">IELTS Course</Link></li>
            </ul>
          </div>

          {/* Teach */}
          <div>
            <h3 className="text-white font-bold mb-4">Teach</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Become a Tutor</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tutor Guidelines</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Payment Info</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
          <p>&copy; {new Date().getFullYear()} HighFive Tutors. All rights reserved.</p>
          <span className="text-slate-500">Made with ❤️ in Pakistan 🇵🇰</span>
        </div>
      </div>
    </footer>
  );
}
