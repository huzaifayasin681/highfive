"use client";

import { useState } from "react";
import { Star, MessageCircle, Send, CheckCircle2, X } from "lucide-react";
import { startConversation } from "@/app/student/actions";

export default function ContactWidget({
  targetId,
  targetName,
  rate,
  rating,
  isLoggedIn,
}: {
  targetId: string;
  targetName: string;
  rate: number;
  rating: number;
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-highfive-blue to-teal-700 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-3xl font-extrabold">Rs {rate.toLocaleString()}</div>
            <div className="text-emerald-200 text-sm mt-0.5">per 60-minute session</div>
          </div>
          {rating > 0 && (
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center">
              <div className="font-bold text-lg leading-none">{rating}</div>
              <Star className="w-3.5 h-3.5 mx-auto mt-0.5 fill-current text-yellow-300" />
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-3">
        {open ? (
          <form action={startConversation} className="space-y-3">
            <input type="hidden" name="targetId" value={targetId} />
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900">
                Message {targetName.split(" ")[0]}
              </label>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              name="content"
              required
              minLength={5}
              rows={4}
              placeholder={`Hi ${targetName.split(" ")[0]}, I'd like to learn more about your lessons…`}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm resize-none"
            />
            <button
              type="submit"
              className="w-full bg-highfive-blue hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {isLoggedIn ? "Send message" : "Sign in to send"}
            </button>
          </form>
        ) : (
          <>
            <button
              onClick={() => setOpen(true)}
              className="w-full bg-success-green hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Book a Trial Lesson
            </button>
            <button
              onClick={() => setOpen(true)}
              className="w-full border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl hover:border-highfive-blue hover:text-highfive-blue transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Send a Message
            </button>
          </>
        )}

        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          {[
            "Free cancellation 24h before session",
            "100% satisfaction guarantee",
            "Secure payment via JazzCash / EasyPaisa",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-success-green flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
