"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, X, Pencil, Lock, RotateCcw, MapPin, Wallet, Monitor } from "lucide-react";
import { saveRequirement, setRequirementStatus, type ActionState } from "@/app/student/actions";

export type RequirementDTO = {
  id: string;
  subject: string;
  level: string | null;
  mode: string | null;
  budget: string | null;
  location: string | null;
  description: string;
  status: string;
  createdAt: string;
};

export default function RequirementsManager({
  requirements,
  openInitially,
}: {
  requirements: RequirementDTO[];
  openInitially: boolean;
}) {
  const [editing, setEditing] = useState<RequirementDTO | null>(null);
  const [showForm, setShowForm] = useState(openInitially);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveRequirement,
    {}
  );

  // Close the form once a save succeeds.
  useEffect(() => {
    if (state.ok) {
      setShowForm(false);
      setEditing(null);
    }
  }, [state.ok]);

  const startEdit = (r: RequirementDTO) => {
    setEditing(r);
    setShowForm(true);
  };
  const startNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Requirements</h1>
          <p className="text-slate-500 mt-1">Post what you want to learn and let tutors reach you.</p>
        </div>
        {!showForm && (
          <button
            onClick={startNew}
            className="flex items-center gap-2 bg-highfive-blue text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Post requirement
          </button>
        )}
      </div>

      {showForm && (
        <form
          action={formAction}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">
              {editing ? "Edit requirement" : "New requirement"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="subject" label="Subject" placeholder="e.g. MDCAT Chemistry" defaultValue={editing?.subject} required />
            <Input name="level" label="Level (optional)" placeholder="e.g. FSc / O-Level" defaultValue={editing?.level ?? ""} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select name="mode" label="Mode" defaultValue={editing?.mode ?? "either"} options={[["either", "Either"], ["online", "Online"], ["in-person", "In-person"]]} />
            <Input name="budget" label="Budget (optional)" placeholder="e.g. Rs 1500/hr" defaultValue={editing?.budget ?? ""} />
            <Input name="location" label="Location (optional)" placeholder="e.g. Lahore" defaultValue={editing?.location ?? ""} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description"
              rows={4}
              required
              minLength={20}
              defaultValue={editing?.description}
              placeholder="Describe what you need help with, your goals and availability…"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm resize-none"
            />
          </div>
          {state.error && <p className="text-red-600 text-sm">{state.error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="bg-highfive-blue text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              {pending ? "Saving…" : editing ? "Save changes" : "Post requirement"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {requirements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500">You haven&apos;t posted any requirements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requirements.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900">{r.subject}</h3>
                    {r.level && <span className="text-xs text-slate-500">· {r.level}</span>}
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === "open"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {r.status === "open" ? "Open" : "Closed"}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{r.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                    {r.mode && (
                      <span className="flex items-center gap-1">
                        <Monitor className="w-3.5 h-3.5" /> {r.mode}
                      </span>
                    )}
                    {r.budget && (
                      <span className="flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5" /> {r.budget}
                      </span>
                    )}
                    {r.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {r.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(r)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-highfive-blue hover:text-highfive-blue transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <form action={setRequirementStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value={r.status === "open" ? "closed" : "open"} />
                    <button
                      type="submit"
                      className="w-full flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      {r.status === "open" ? (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Close
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" /> Reopen
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({
  name,
  label,
  placeholder,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
      />
    </div>
  );
}

function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm bg-white"
      >
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}
