const SECTION_TITLE =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 pb-1.5 mb-3 border-b border-zinc-200";

interface Props {
  summary: string;
}

export default function ResumeSummary({ summary }: Props) {
  if (!summary.trim()) return null;

  return (
    <section className="mb-5">
      <h2 className={SECTION_TITLE}>Professional Summary</h2>
      <p className="text-[13px] text-zinc-700 leading-relaxed">{summary}</p>
    </section>
  );
}
