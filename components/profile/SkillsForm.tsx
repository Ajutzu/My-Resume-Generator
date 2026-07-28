"use client";

import { Field, SectionCard, TagInput } from "@/components/ui/fields";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function SkillsForm({ value, onChange }: Props) {
  return (
    <SectionCard
      title="Skills"
      description="Technical and professional skills. The AI will highlight the most relevant ones for each job."
    >
      <Field
        label="Skills"
        hint="Type a skill and press Enter or comma to add. Backspace removes the last skill."
      >
        <TagInput
          tags={value}
          onChange={onChange}
          placeholder="e.g. React, TypeScript, Node.js..."
        />
      </Field>

      {value.length > 0 && (
        <p className="mt-3 text-xs text-slate-400">
          {value.length} skill{value.length !== 1 ? "s" : ""} added
        </p>
      )}
    </SectionCard>
  );
}
