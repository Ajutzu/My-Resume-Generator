"use client";

import { SectionCard, Textarea } from "@/components/ui/fields";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function JobDescriptionEditor({ value, onChange }: Props) {
  const words = countWords(value);
  const chars = value.length;

  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title="Job Description"
        description="Paste the full job posting here. The AI will tailor your resume to match this specific role."
      >
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={22}
          placeholder={
            "Paste the full job description here...\n\nExample:\nWe are looking for a Senior Software Engineer to join our team. The ideal candidate will have experience with React, TypeScript, and Node.js...\n\nResponsibilities:\n• Build and maintain web applications\n• Collaborate with cross-functional teams\n\nRequirements:\n• 5+ years of software engineering experience\n• Strong TypeScript skills"
          }
        />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {words.toLocaleString()} word{words !== 1 ? "s" : ""} ·{" "}
            {chars.toLocaleString()} characters
          </span>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </SectionCard>

      <div className="ui-notice ui-notice-amber">
        <strong>Privacy:</strong> When you generate a resume, your profile and
        this job description are sent directly from your browser to the AI
        provider you select. They are not sent to any server owned by this
        application.
      </div>
    </div>
  );
}
