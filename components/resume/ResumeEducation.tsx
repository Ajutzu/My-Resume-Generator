import type { Education } from "@/lib/types";

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
    <section style={{ marginBottom: "18px" }}>
      <h2 style={SECTION_TITLE}>Education</h2>
      <div>
        {entries.map((edu) => {
          const range = formatRange(edu.startDate, edu.endDate);
          const meta = [edu.school, edu.location].filter(Boolean).join("  ·  ");

          return (
            <div key={edu.id} style={{ marginBottom: "12px", breakInside: "avoid" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", margin: 0, lineHeight: 1.4 }}>
                  {edu.degree}
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
              {edu.description.trim() && (
                <p style={{ fontSize: "13px", color: "#374151", marginTop: "4px", marginBottom: 0, lineHeight: 1.6 }}>
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
