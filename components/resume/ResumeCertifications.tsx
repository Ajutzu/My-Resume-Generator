import type { Certification } from "@/lib/types";

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
  certifications: Certification[];
}

export default function ResumeCertifications({ certifications }: Props) {
  const entries = certifications.filter((c) => c.name);
  if (entries.length === 0) return null;

  return (
    <section style={{ marginBottom: "18px" }}>
      <h2 style={SECTION_TITLE}>Certifications</h2>
      <div>
        {entries.map((cert) => {
          const meta = [cert.issuer, cert.date].filter(Boolean).join("  ·  ");

          return (
            <div key={cert.id} style={{ marginBottom: "10px", breakInside: "avoid" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111827", margin: 0 }}>
                  {cert.name}
                </h3>
                {cert.credentialUrl && (
                  <span style={{ fontSize: "11px", color: "#6b7280", flexShrink: 0 }}>
                    {displayUrl(cert.credentialUrl)}
                  </span>
                )}
              </div>
              {meta && (
                <p style={{ fontSize: "12px", color: "#4b5563", marginTop: "2px", marginBottom: 0 }}>{meta}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
