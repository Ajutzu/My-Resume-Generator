import type { Certification } from "@/lib/types";

const SECTION_TITLE =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 pb-1.5 mb-3 border-b border-zinc-200";

interface Props {
  certifications: Certification[];
}

export default function ResumeCertifications({ certifications }: Props) {
  const entries = certifications.filter((c) => c.name);
  if (entries.length === 0) return null;

  return (
    <section className="mb-5">
      <h2 className={SECTION_TITLE}>Certifications</h2>
      <div className="space-y-3">
        {entries.map((cert) => {
          const meta = [cert.issuer, cert.date].filter(Boolean).join(" · ");

          return (
            <div key={cert.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[13px] font-semibold text-zinc-900">
                  {cert.name}
                </h3>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-zinc-500 hover:text-zinc-800 shrink-0 transition-colors"
                  >
                    Credential ↗
                  </a>
                )}
              </div>
              {meta && (
                <p className="text-[12px] text-zinc-500 mt-0.5">{meta}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
