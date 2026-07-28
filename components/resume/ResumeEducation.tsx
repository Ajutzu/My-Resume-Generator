import type { Education } from "@/lib/types";

const SECTION_TITLE =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 pb-1.5 mb-3 border-b border-zinc-200";

function formatRange(start: string, end: string): string {
  return [start, end].filter(Boolean).join(" – ");
}

interface Props {
  education: Education[];
}

export default function ResumeEducation({ education }: Props) {
  const entries = education.filter((e) => e.degree || e.school);
  if (entries.length === 0) return null;

  return (
    <section className="mb-5">
      <h2 className={SECTION_TITLE}>Education</h2>
      <div className="space-y-4">
        {entries.map((edu) => {
          const range = formatRange(edu.startDate, edu.endDate);
          const meta = [edu.school, edu.location].filter(Boolean).join(" · ");

          return (
            <div key={edu.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[14px] font-semibold text-zinc-900 leading-snug">
                  {edu.degree}
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
              {edu.description.trim() && (
                <p className="text-[13px] text-zinc-700 mt-1 leading-relaxed">
                  {edu.description.trim()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
