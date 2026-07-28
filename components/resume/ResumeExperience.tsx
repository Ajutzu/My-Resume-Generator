import type { WorkExperience } from "@/lib/types";

const SECTION_TITLE: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: "normal",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: "#71717a",
  paddingBottom: "6px",
  marginBottom: "12px",
  borderBottom: "1px solid #e4e4e7",
  breakAfter: "avoid",
};

function formatRange(start: string, end: string, current: boolean): string {
  const parts = [start, current ? "Present" : end].filter(Boolean);
  return parts.join(" – ");
}

function BulletList({ items }: { items: string[] }) {
  const filtered = items.filter((i) => i.trim());
  if (filtered.length === 0) return null;
  return (
    <ul style={{ marginTop: "6px", paddingLeft: 0, listStyle: "none" }}>
      {filtered.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#374151", marginBottom: "2px" }}>
          <span style={{ flexShrink: 0, color: "#9ca3af", marginTop: "2px" }}>•</span>
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
    <section style={{ marginBottom: "18px" }}>
      <h2 style={SECTION_TITLE}>Work Experience</h2>
      <div>
        {entries.map((exp) => {
          const range = formatRange(exp.startDate, exp.endDate, exp.current);
          const meta = [exp.company, exp.location].filter(Boolean).join("  ·  ");

          return (
            <div key={exp.id} style={{ marginBottom: "16px", breakInside: "avoid" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", margin: 0, lineHeight: 1.4 }}>
                  {exp.jobTitle}
                </h3>
                {range && (
                  <span style={{ fontSize: "12px", color: "#6b7280", flexShrink: 0 }}>
                    {range}
                  </span>
                )}
              </div>
              {meta && (
                <p style={{ fontSize: "12px", color: "#4b5563", marginTop: "2px", marginBottom: 0 }}>{meta}</p>
              )}
              {exp.description.trim() && (
                <p style={{ fontSize: "13px", color: "#374151", marginTop: "6px", marginBottom: 0, lineHeight: 1.6 }}>
                  {exp.description.trim()}
                </p>
              )}
              <BulletList items={exp.responsibilities} />
              {exp.achievements.some((a) => a.trim()) && (
                <ul style={{ marginTop: "6px", paddingLeft: 0, listStyle: "none" }}>
                  {exp.achievements
                    .filter((a) => a.trim())
                    .map((a, i) => (
                      <li key={i} style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#374151", marginBottom: "2px" }}>
                        <span style={{ flexShrink: 0, color: "#9ca3af", marginTop: "2px" }}>▸</span>
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
