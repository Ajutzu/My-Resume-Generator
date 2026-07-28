import type { Project } from "@/lib/types";

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

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

interface Props {
  projects: Project[];
}

export default function ResumeProjects({ projects }: Props) {
  const entries = projects.filter((p) => p.name || p.description);
  if (entries.length === 0) return null;

  return (
    <section style={{ marginBottom: "18px" }}>
      <h2 style={SECTION_TITLE}>Projects</h2>
      <div>
        {entries.map((proj) => {
          const techs = proj.technologies.filter((t) => t.trim());
          const contributions = proj.keyContributions.filter((c) => c.trim());
          const urls = [proj.url, proj.githubUrl]
            .filter(Boolean)
            .map(displayUrl)
            .join("  |  ");

          return (
            <div key={proj.id} style={{ marginBottom: "14px", breakInside: "avoid" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", margin: 0 }}>
                  {proj.name}
                </h3>
                {techs.length > 0 && (
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    {techs.join(", ")}
                  </span>
                )}
              </div>

              {urls && (
                <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px", marginBottom: 0 }}>
                  {urls}
                </p>
              )}

              {proj.description.trim() && (
                <p style={{ fontSize: "13px", color: "#374151", marginTop: "4px", marginBottom: 0, lineHeight: 1.6 }}>
                  {proj.description.trim()}
                </p>
              )}

              {contributions.length > 0 && (
                <ul style={{ marginTop: "6px", paddingLeft: 0, listStyle: "none" }}>
                  {contributions.map((c, i) => (
                    <li key={i} style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#374151", marginBottom: "2px" }}>
                      <span style={{ flexShrink: 0, color: "#9ca3af", marginTop: "2px" }}>•</span>
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
