export type Section = { heading: string; body: string };

export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: Section[];
}) {
  return (
    <div className="bg-white min-h-[calc(100vh-4rem)]">
      <div className="bg-slate-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
          <p className="text-slate-400 text-sm mt-2">Last updated: {updated}</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              {i + 1}. {s.heading}
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{s.body}</p>
          </section>
        ))}
        <p className="text-sm text-slate-400 border-t border-slate-100 pt-6">
          This is a sample policy for the HighFive demo and is not legal advice.
        </p>
      </div>
    </div>
  );
}
