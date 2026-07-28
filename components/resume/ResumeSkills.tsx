const SECTION_TITLE =
  "text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 pb-1.5 mb-3 border-b border-zinc-200";

interface Props {
  skills: string[];
}

export default function ResumeSkills({ skills }: Props) {
  const filtered = skills.filter((s) => s.trim());
  if (filtered.length === 0) return null;

  return (
    <section className="mb-5">
      <h2 className={SECTION_TITLE}>Skills</h2>
      <p className="text-[13px] text-zinc-700 leading-relaxed">
        {filtered.join(" · ")}
      </p>
    </section>
  );
}
