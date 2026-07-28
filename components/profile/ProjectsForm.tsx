"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Field, Input, SectionCard, TagInput, Textarea } from "@/components/ui/fields";

interface Props {
  value: Project[];
  onChange: (value: Project[]) => void;
}

function emptyProject(): Project {
  return {
    id: generateId(),
    name: "",
    description: "",
    technologies: [],
    url: "",
    githubUrl: "",
    keyContributions: [],
  };
}

export default function ProjectsForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    value[0]?.id ?? null
  );

  function addItem() {
    const item = emptyProject();
    onChange([...value, item]);
    setExpandedId(item.id);
  }

  function removeItem(id: string) {
    const next = value.filter((item) => item.id !== id);
    onChange(next);
    if (expandedId === id) setExpandedId(next[0]?.id ?? null);
  }

  function updateItem(id: string, updates: Partial<Project>) {
    onChange(value.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  return (
    <SectionCard
      title="Projects"
      description="Personal or professional projects. The AI will highlight the most relevant ones."
    >
      {value.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <p className="text-sm mb-4">No projects added yet.</p>
          <button
            type="button"
            onClick={addItem}
            className="ui-btn-primary"
          >
            Add Project
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
                      {item.name || "New Project"}
                    </span>
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
                    <Field label="Project Name">
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, { name: e.target.value })}
                        placeholder="Resume Generator"
                      />
                    </Field>

                    <Field label="Description">
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, { description: e.target.value })
                        }
                        rows={3}
                        placeholder="A self-hosted AI-powered resume generator..."
                      />
                    </Field>

                    <Field
                      label="Technologies"
                      hint="Type a technology and press Enter or comma."
                    >
                      <TagInput
                        tags={item.technologies}
                        onChange={(technologies) =>
                          updateItem(item.id, { technologies })
                        }
                        placeholder="e.g. React, Next.js, PostgreSQL..."
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Live URL">
                        <Input
                          value={item.url}
                          onChange={(e) =>
                            updateItem(item.id, { url: e.target.value })
                          }
                          placeholder="https://myproject.com"
                        />
                      </Field>
                      <Field label="GitHub URL">
                        <Input
                          value={item.githubUrl}
                          onChange={(e) =>
                            updateItem(item.id, { githubUrl: e.target.value })
                          }
                          placeholder="https://github.com/user/project"
                        />
                      </Field>
                    </div>

                    <Field
                      label="Key Contributions"
                      hint="One contribution per line."
                    >
                      <Textarea
                        value={item.keyContributions.join("\n")}
                        onChange={(e) =>
                          updateItem(item.id, {
                            keyContributions: e.target.value.split("\n"),
                          })
                        }
                        rows={4}
                        placeholder={"Built the AI integration layer\nImplemented client-side PDF generation"}
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
            + Add Project
          </button>
        </div>
      )}
    </SectionCard>
  );
}
