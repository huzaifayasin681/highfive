"use client";

import { useGlobal } from '@/context/GlobalContext';
import { MessageCircle } from 'lucide-react';

// Site-wide floating "talk to us" action that opens the enquiry modal.
export default function FloatingContact() {
  const { openContactModal } = useGlobal();
  return (
    <button
      onClick={openContactModal}
      aria-label="Contact HighFive"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-success-green text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl hover:bg-emerald-600 transition-colors animate-pulse-ring"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-bold text-sm hidden sm:inline">Talk to us</span>
    </button>
  );
}
