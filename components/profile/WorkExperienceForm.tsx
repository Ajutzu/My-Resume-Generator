"use client";

import { useState } from "react";
import type { WorkExperience } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Field, Input, SectionCard, Textarea } from "@/components/ui/fields";

interface Props {
  value: WorkExperience[];
  onChange: (value: WorkExperience[]) => void;
}

function emptyExperience(): WorkExperience {
  return {
    id: generateId(),
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    responsibilities: [],
    achievements: [],
  };
}

export default function WorkExperienceForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    value[0]?.id ?? null
  );

  function addItem() {
    const item = emptyExperience();
    onChange([...value, item]);
    setExpandedId(item.id);
  }

  function removeItem(id: string) {
    const next = value.filter((item) => item.id !== id);
    onChange(next);
    if (expandedId === id) {
      setExpandedId(next[0]?.id ?? null);
    }
  }

  function updateItem(id: string, updates: Partial<WorkExperience>) {
    onChange(value.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  return (
    <SectionCard
      title="Work Experience"
      description="Add your work history. The AI will prioritize the most relevant roles."
    >
      {value.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <p className="text-sm mb-4">No work experience added yet.</p>
          <button
            type="button"
            onClick={addItem}
            className="ui-btn-primary"
          >
            Add Experience
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {value.map((item) => {
            const isExpanded = expandedId === item.id;
            const title = item.jobTitle || "New Position";
            const company = item.company || "Company";

            return (
              <div
                key={item.id}
                className="ui-accordion"
              >
                {/* Accordion header */}
                <div className="ui-accordion-header">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : item.id)
                    }
                    className="flex-1 flex items-center gap-2 text-left min-w-0"
                  >
                    <span className="text-xs text-slate-400 shrink-0 w-4">
                      {isExpanded ? "▾" : "▸"}
                    </span>
                    <span className="text-[13px] font-semibold text-slate-800 truncate">
                      {title}
                    </span>
                    {item.company && (
                      <span className="text-[13px] text-slate-400 truncate shrink-0">
                        — {company}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="ml-2 text-xs text-red-400 hover:text-red-600 transition-colors shrink-0 font-medium"
                  >
                    Remove
                  </button>
                </div>

                {/* Accordion content */}
                {isExpanded && (
                  <div className="ui-accordion-body space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Job Title">
                        <Input
                          value={item.jobTitle}
                          onChange={(e) =>
                            updateItem(item.id, { jobTitle: e.target.value })
                          }
                          placeholder="Senior Software Engineer"
                        />
                      </Field>
                      <Field label="Company">
                        <Input
                          value={item.company}
                          onChange={(e) =>
                            updateItem(item.id, { company: e.target.value })
                          }
                          placeholder="Acme Corp"
                        />
                      </Field>
                      <Field label="Location" className="sm:col-span-2">
                        <Input
                          value={item.location}
                          onChange={(e) =>
                            updateItem(item.id, { location: e.target.value })
                          }
                          placeholder="San Francisco, CA (Remote)"
                        />
                      </Field>
                      <Field label="Start Date">
                        <Input
                          value={item.startDate}
                          onChange={(e) =>
                            updateItem(item.id, { startDate: e.target.value })
                          }
                          placeholder="Jan 2020"
                        />
                      </Field>
                      <Field label="End Date">
                        <Input
                          value={item.endDate}
                          onChange={(e) =>
                            updateItem(item.id, { endDate: e.target.value })
                          }
                          placeholder="Dec 2023"
                          disabled={item.current}
                        />
                      </Field>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.current}
                        onChange={(e) =>
                          updateItem(item.id, {
                            current: e.target.checked,
                            endDate: e.target.checked ? "" : item.endDate,
                          })
                        }
                        className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Currently working here
                    </label>

                    <Field
                      label="Description"
                      hint="Brief overview of the role."
                    >
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, { description: e.target.value })
                        }
                        rows={2}
                        placeholder="Led a team of 5 engineers to build..."
                      />
                    </Field>

                    <Field
                      label="Responsibilities"
                      hint="One responsibility per line."
                    >
                      <Textarea
                        value={item.responsibilities.join("\n")}
                        onChange={(e) =>
                          updateItem(item.id, {
                            responsibilities: e.target.value.split("\n"),
                          })
                        }
                        rows={4}
                        placeholder={"Designed and implemented REST APIs\nReviewed pull requests and mentored junior developers"}
                      />
                    </Field>

                    <Field
                      label="Achievements"
                      hint="Quantified achievements where possible. One per line."
                    >
                      <Textarea
                        value={item.achievements.join("\n")}
                        onChange={(e) =>
                          updateItem(item.id, {
                            achievements: e.target.value.split("\n"),
                          })
                        }
                        rows={4}
                        placeholder={"Reduced API response time by 40%\nShipped 3 major product features on schedule"}
                      />
                    </Field>
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addItem}
            className="mt-1 ui-add-btn"
          >
            + Add Experience
          </button>
        </div>
      )}
    </SectionCard>
  );
}
