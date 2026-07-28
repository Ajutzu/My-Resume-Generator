"use client";

import { useState } from "react";
import type { Education } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Field, Input, SectionCard, Textarea } from "@/components/ui/fields";

interface Props {
  value: Education[];
  onChange: (value: Education[]) => void;
}

function emptyEducation(): Education {
  return {
    id: generateId(),
    degree: "",
    school: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

export default function EducationForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    value[0]?.id ?? null
  );

  function addItem() {
    const item = emptyEducation();
    onChange([...value, item]);
    setExpandedId(item.id);
  }

  function removeItem(id: string) {
    const next = value.filter((item) => item.id !== id);
    onChange(next);
    if (expandedId === id) setExpandedId(next[0]?.id ?? null);
  }

  function updateItem(id: string, updates: Partial<Education>) {
    onChange(value.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  return (
    <SectionCard
      title="Education"
      description="Academic background and qualifications."
    >
      {value.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <p className="text-sm mb-4">No education entries added yet.</p>
          <button
            type="button"
            onClick={addItem}
            className="ui-btn-primary"
          >
            Add Education
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {value.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="ui-accordion"
              >
                <div className="ui-accordion-header">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex-1 flex items-center gap-2 text-left min-w-0"
                  >
                    <span className="text-xs text-slate-400 shrink-0 w-4">
                      {isExpanded ? "▾" : "▸"}
                    </span>
                    <span className="text-[13px] font-semibold text-slate-800 truncate">
                      {item.degree || "New Degree"}
                    </span>
                    {item.school && (
                      <span className="text-[13px] text-slate-400 truncate shrink-0">
                        — {item.school}
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

                {isExpanded && (
                  <div className="ui-accordion-body space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Degree">
                        <Input
                          value={item.degree}
                          onChange={(e) =>
                            updateItem(item.id, { degree: e.target.value })
                          }
                          placeholder="B.S. Computer Science"
                        />
                      </Field>
                      <Field label="School">
                        <Input
                          value={item.school}
                          onChange={(e) =>
                            updateItem(item.id, { school: e.target.value })
                          }
                          placeholder="University of California"
                        />
                      </Field>
                      <Field label="Location" className="sm:col-span-2">
                        <Input
                          value={item.location}
                          onChange={(e) =>
                            updateItem(item.id, { location: e.target.value })
                          }
                          placeholder="Berkeley, CA"
                        />
                      </Field>
                      <Field label="Start Date">
                        <Input
                          value={item.startDate}
                          onChange={(e) =>
                            updateItem(item.id, { startDate: e.target.value })
                          }
                          placeholder="Sep 2016"
                        />
                      </Field>
                      <Field label="End Date">
                        <Input
                          value={item.endDate}
                          onChange={(e) =>
                            updateItem(item.id, { endDate: e.target.value })
                          }
                          placeholder="May 2020"
                        />
                      </Field>
                    </div>

                    <Field label="Description" hint="Relevant coursework, honors, activities.">
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, { description: e.target.value })
                        }
                        rows={3}
                        placeholder="GPA: 3.8 · Dean's List · Relevant coursework: Algorithms, Distributed Systems"
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
            + Add Education
          </button>
        </div>
      )}
    </SectionCard>
  );
}
