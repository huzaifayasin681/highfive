"use client";

import { useRef } from "react";
import { Send } from "lucide-react";
import { sendMessage } from "@/app/student/actions";

// Resets the input after each send; the server action revalidates the thread.
export default function MessageComposer({ threadId }: { threadId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await sendMessage(formData);
        formRef.current?.reset();
      }}
      className="flex items-center gap-2 border-t border-slate-100 p-3 bg-white"
    >
      <input type="hidden" name="threadId" value={threadId} />
      <input
        name="content"
        required
        autoComplete="off"
        placeholder="Type a message…"
        className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
      />
      <button
        type="submit"
        className="bg-highfive-blue text-white p-3 rounded-xl hover:bg-emerald-800 transition-colors flex-shrink-0"
        aria-label="Send"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
