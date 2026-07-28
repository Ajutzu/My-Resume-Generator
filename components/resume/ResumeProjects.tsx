import type { Project } from "@/lib/types";

const SECTION_TITLE =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 pb-1.5 mb-3 border-b border-zinc-200";

interface Props {
  projects: Project[];
}

export default function ResumeProjects({ projects }: Props) {
  const entries = projects.filter((p) => p.name || p.description);
  if (entries.length === 0) return null;

  return (
    <section className="mb-5">
      <h2 className={SECTION_TITLE}>Projects</h2>
      <div className="space-y-4">
        {entries.map((proj) => {
          const techs = proj.technologies.filter((t) => t.trim());
          const contributions = proj.keyContributions.filter((c) => c.trim());

          return (
            <div key={proj.id}>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="text-[14px] font-semibold text-zinc-900">
                  {proj.name}
                </h3>
                {techs.length > 0 && (
                  <span className="text-[12px] text-zinc-500">
                    {techs.join(", ")}
                  </span>
                )}
              </div>

              {(proj.url || proj.githubUrl) && (
                <div className="flex gap-3 mt-0.5 text-[12px]">
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-zinc-800 transition-colors"
                    >
                      Live ↗
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-zinc-800 transition-colors"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              )}

              {proj.description.trim() && (
                <p className="text-[13px] text-zinc-700 mt-1 leading-relaxed">
                  {proj.description.trim()}
                </p>
              )}

              {contributions.length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {contributions.map((c, i) => (
                    <li key={i} className="flex gap-2 text-[13px] text-zinc-700">
                      <span className="shrink-0 mt-[3px] text-zinc-400">•</span>
                      <span>{c.trim()}</span>
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
