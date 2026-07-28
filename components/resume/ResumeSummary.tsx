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

interface Props {
  summary: string;
}

export default function ResumeSummary({ summary }: Props) {
  if (!summary.trim()) return null;

  return (
    <section style={{ marginBottom: "18px", breakInside: "avoid" }}>
      <h2 style={SECTION_TITLE}>Professional Summary</h2>
      <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: 0 }}>{summary}</p>
    </section>
  );
}
