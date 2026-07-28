"use client";

import { Field, SectionCard, Textarea } from "@/components/ui/fields";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SummaryForm({ value, onChange }: Props) {
  return (
    <SectionCard
      title="Professional Summary"
      description="A brief overview of your experience and goals. The AI will tailor this to each job."
    >
      <Field
        label="Summary"
        hint="Write 2–4 sentences. The AI will rewrite this based on the job description."
      >
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder="Experienced software engineer with 5+ years building scalable web applications..."
        />
      </Field>
    </SectionCard>
  );
}
