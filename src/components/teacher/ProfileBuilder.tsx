"use client";

import { useActionState, useState } from "react";
import { updateTeacherProfile, type ActionState } from "@/app/teacher/actions";

const MIN_BIO = 100;

export type ProfileData = {
  bio: string;
  qualifications: string;
  experienceYears: number | null;
  hourlyRate: number | null;
  mode: string | null;
  location: string;
  photoUrl: string;
  videoUrl: string;
  responseTime: string;
  subjects: string[];
};

export default function ProfileBuilder({
  data,
  allSubjects,
}: {
  data: ProfileData;
  allSubjects: string[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateTeacherProfile,
    {}
  );
  const [bioLen, setBioLen] = useState(data.bio.length);
  const [selected, setSelected] = useState<Set<string>>(new Set(data.subjects));

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Subjects as hidden inputs reflecting the selected set */}
      {[...selected].map((s) => (
        <input key={s} type="hidden" name="subjects" value={s} />
      ))}

      <Card title="Photo & basics">
        <Field label="Profile photo URL" name="photoUrl" type="url" defaultValue={data.photoUrl} placeholder="https://…" />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Intro Video</label>
          
          <div className="space-y-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Option 1: YouTube Link</label>
              <input
                name="youtubeUrl"
                type="url"
                defaultValue={data.videoUrl?.includes("youtu") ? data.videoUrl : ""}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm bg-white"
              />
            </div>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Option 2: Upload File (Max 5MB)</label>
              <input
                name="video"
                type="file"
                accept="video/*"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-highfive-blue hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>
          </div>

          {data.videoUrl && (
            <p className="text-xs text-emerald-600 mt-3 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Current video: {data.videoUrl.includes("youtu") ? "YouTube Video" : data.videoUrl.startsWith("data:") ? "Uploaded Video" : data.videoUrl.split('/').pop()}
            </p>
          )}
        </div>
        <Field label="Location" name="location" defaultValue={data.location} placeholder="e.g. Lahore, Pakistan" />
        <Field label="Typical response time" name="responseTime" defaultValue={data.responseTime} placeholder="e.g. within 1 hour" />
      </Card>

      <Card title="About you">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700">Bio</label>
            <span className={`text-xs font-medium ${bioLen >= MIN_BIO ? "text-emerald-600" : "text-slate-400"}`}>
              {bioLen}/{MIN_BIO} min
            </span>
          </div>
          <textarea
            name="bio"
            rows={5}
            defaultValue={data.bio}
            onChange={(e) => setBioLen(e.target.value.trim().length)}
            placeholder="Tell students about your teaching style, experience and what makes your lessons effective…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Qualifications</label>
          <textarea
            name="qualifications"
            rows={3}
            defaultValue={data.qualifications}
            placeholder="One per line, e.g.&#10;MSc Physics, NUST Islamabad&#10;6+ years tutoring experience"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">Put each qualification on its own line.</p>
        </div>
      </Card>

      <Card title="Subjects you teach">
        <div className="flex flex-wrap gap-2">
          {allSubjects.map((s) => {
            const on = selected.has(s);
            return (
              <button
                type="button"
                key={s}
                onClick={() => toggle(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                  on
                    ? "bg-highfive-blue text-white border-highfive-blue"
                    : "bg-white text-slate-600 border-slate-200 hover:border-highfive-blue"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        {selected.size === 0 && (
          <p className="text-xs text-amber-600 mt-2">Select at least one subject so students can find you.</p>
        )}
      </Card>

      <Card title="Teaching details">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Years of experience" name="experienceYears" type="number" defaultValue={data.experienceYears?.toString() ?? ""} placeholder="6" />
          <Field label="Hourly rate (Rs)" name="hourlyRate" type="number" defaultValue={data.hourlyRate?.toString() ?? ""} placeholder="1200" />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Teaching mode</label>
            <select
              name="mode"
              defaultValue={data.mode ?? "both"}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm bg-white"
            >
              <option value="both">Online &amp; In-person</option>
              <option value="online">Online only</option>
              <option value="in-person">In-person only</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="bg-highfive-blue text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-emerald-800 transition-colors disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
        {state.error && <p className="text-red-600 text-sm">{state.error}</p>}
        {state.ok && <p className="text-emerald-600 text-sm">Profile saved!</p>}
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <h2 className="font-bold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
      />
    </div>
  );
}
