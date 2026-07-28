"use client";

import type { PersonalInfo } from "@/lib/types";
import { Field, Input, SectionCard } from "@/components/ui/fields";

interface Props {
  value: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
}

export default function PersonalInfoForm({ value, onChange }: Props) {
  function update(field: keyof PersonalInfo, val: string) {
    onChange({ ...value, [field]: val });
  }

  return (
    <SectionCard
      title="Personal Information"
      description="Basic contact and identity information shown at the top of your resume."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name">
          <Input
            value={value.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </Field>

        <Field label="Professional Title">
          <Input
            value={value.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Senior Software Engineer"
          />
        </Field>

        <Field label="Email">
          <Input
            type="email"
            value={value.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="john@example.com"
          />
        </Field>

        <Field label="Phone">
          <Input
            type="tel"
            value={value.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </Field>

        <Field label="Location" className="sm:col-span-2">
          <Input
            value={value.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </Field>

        <Field label="LinkedIn">
          <Input
            value={value.linkedin}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </Field>

        <Field label="GitHub">
          <Input
            value={value.github}
            onChange={(e) => update("github", e.target.value)}
            placeholder="https://github.com/johndoe"
          />
        </Field>

        <Field label="Portfolio" className="sm:col-span-2">
          <Input
            value={value.portfolio}
            onChange={(e) => update("portfolio", e.target.value)}
            placeholder="https://johndoe.dev"
          />
        </Field>
      </div>
    </SectionCard>
  );
}
