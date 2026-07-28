"use client";

import { useState } from "react";
import type { Certification } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Field, Input, SectionCard } from "@/components/ui/fields";

interface Props {
  value: Certification[];
  onChange: (value: Certification[]) => void;
}

function emptyCertification(): Certification {
  return {
    id: generateId(),
    name: "",
    issuer: "",
    date: "",
    credentialUrl: "",
  };
}

export default function CertificationsForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    value[0]?.id ?? null
  );

  function addItem() {
    const item = emptyCertification();
    onChange([...value, item]);
    setExpandedId(item.id);
  }

  function removeItem(id: string) {
    const next = value.filter((item) => item.id !== id);
    onChange(next);
    if (expandedId === id) setExpandedId(next[0]?.id ?? null);
  }

  function updateItem(id: string, updates: Partial<Certification>) {
    onChange(value.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  return (
    <SectionCard
      title="Certifications"
      description="Professional certifications and credentials."
    >
      {value.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <p className="text-sm mb-4">No certifications added yet.</p>
          <button
            type="button"
            onClick={addItem}
            className="ui-btn-primary"
          >
            Add Certification
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
                      {item.name || "New Certification"}
                    </span>
                    {item.issuer && (
                      <span className="text-[13px] text-slate-400 truncate shrink-0">
                        — {item.issuer}
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
                      <Field label="Certification Name" className="sm:col-span-2">
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, { name: e.target.value })
                          }
                          placeholder="AWS Certified Solutions Architect"
                        />
                      </Field>
                      <Field label="Issuing Organization">
                        <Input
                          value={item.issuer}
                          onChange={(e) =>
                            updateItem(item.id, { issuer: e.target.value })
                          }
                          placeholder="Amazon Web Services"
                        />
                      </Field>
                      <Field label="Date">
                        <Input
                          value={item.date}
                          onChange={(e) =>
                            updateItem(item.id, { date: e.target.value })
                          }
                          placeholder="Mar 2024"
                        />
                      </Field>
                      <Field label="Credential URL" className="sm:col-span-2">
                        <Input
                          value={item.credentialUrl}
                          onChange={(e) =>
                            updateItem(item.id, { credentialUrl: e.target.value })
                          }
                          placeholder="https://credly.com/badges/..."
                        />
                      </Field>
                    </div>
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
            + Add Certification
          </button>
        </div>
      )}
    </SectionCard>
  );
}
