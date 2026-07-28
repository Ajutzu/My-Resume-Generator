import type { WorkExperience } from "@/lib/types";

const SECTION_TITLE =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 pb-1.5 mb-3 border-b border-zinc-200";

function formatRange(start: string, end: string, current: boolean): string {
  const parts = [start, current ? "Present" : end].filter(Boolean);
  return parts.join(" – ");
}

function BulletList({ items }: { items: string[] }) {
  const filtered = items.filter((i) => i.trim());
  if (filtered.length === 0) return null;
  return (
    <ul className="mt-1.5 space-y-0.5">
      {filtered.map((item, i) => (
        <li key={i} className="flex gap-2 text-[13px] text-zinc-700">
          <span className="shrink-0 mt-[3px] text-zinc-400">•</span>
          <span>{item.trim()}</span>
        </li>
      ))}
    </ul>
  );
}

interface Props {
  workExperience: WorkExperience[];
}

export default function ResumeExperience({ workExperience }: Props) {
  const entries = workExperience.filter((e) => e.jobTitle || e.company);
  if (entries.length === 0) return null;

  return (
    <section className="mb-5">
      <h2 className={SECTION_TITLE}>Work Experience</h2>
      <div className="space-y-5">
        {entries.map((exp) => {
          const range = formatRange(exp.startDate, exp.endDate, exp.current);
          const meta = [exp.company, exp.location].filter(Boolean).join(" · ");

          return (
            <div key={exp.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[14px] font-semibold text-zinc-900 leading-snug">
                  {exp.jobTitle}
                </h3>
                {range && (
                  <span className="text-[12px] text-zinc-500 shrink-0">
                    {range}
                  </span>
                )}
              </div>
              {meta && (
                <p className="text-[13px] text-zinc-600 mt-0.5">{meta}</p>
              )}
              {exp.description.trim() && (
                <p className="text-[13px] text-zinc-700 mt-1.5 leading-relaxed">
                  {exp.description.trim()}
                </p>
              )}
              <BulletList items={exp.responsibilities} />
              {exp.achievements.some((a) => a.trim()) && (
                <ul className="mt-1.5 space-y-0.5">
                  {exp.achievements
                    .filter((a) => a.trim())
                    .map((a, i) => (
                      <li key={i} className="flex gap-2 text-[13px] text-zinc-700">
                        <span className="shrink-0 mt-[3px] text-zinc-400">▸</span>
                        <span>{a.trim()}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
