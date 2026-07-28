"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { exportProfileJSON, importProfileJSON } from "@/lib/storage";
import PersonalInfoForm from "./PersonalInfoForm";
import SummaryForm from "./SummaryForm";
import SkillsForm from "./SkillsForm";
import WorkExperienceForm from "./WorkExperienceForm";
import ProjectsForm from "./ProjectsForm";
import EducationForm from "./EducationForm";
import CertificationsForm from "./CertificationsForm";
import MarkdownPreview from "./MarkdownPreview";

type Section =
  | "personal"
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "markdown";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "personal", label: "Personal Info" },
  { id: "summary", label: "Summary" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Work Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "markdown", label: "Markdown" },
];

interface Props {
  profile: Profile;
  onChange: (profile: Profile) => void;
}

export default function ProfileEditor({ profile, onChange }: Props) {
  const [section, setSection] = useState<Section>("personal");
  const [importError, setImportError] = useState<string | null>(null);

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    importProfileJSON(file)
      .then(onChange)
      .catch((err: Error) => setImportError(err.message));
    e.target.value = "";
  }

  return (
    <div className="flex gap-5 items-start">
      {/* Sidebar */}
      <aside className="w-44 shrink-0 sticky top-0">
        <div className="ui-card !p-2">
          <nav className="flex flex-col gap-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={[
                  "text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all",
                  section === s.id
                    ? "bg-indigo-50 text-indigo-700 shadow-[inset_0_0_0_1px_rgba(79,70,229,0.1)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800",
                ].join(" ")}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.06)] flex flex-col gap-0.5">
            <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Profile Data
            </p>
            <button
              type="button"
              onClick={() => exportProfileJSON(profile)}
              className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              Export JSON
            </button>
            <label className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer">
              Import JSON
              <input
                type="file"
                accept=".json,application/json"
                className="sr-only"
                onChange={handleImport}
              />
            </label>
            {importError && (
              <p className="px-3 text-xs text-red-500">{importError}</p>
            )}
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {section === "personal" && (
          <PersonalInfoForm
            value={profile.personalInfo}
            onChange={(personalInfo) => onChange({ ...profile, personalInfo })}
          />
        )}
        {section === "summary" && (
          <SummaryForm
            value={profile.summary}
            onChange={(summary) => onChange({ ...profile, summary })}
          />
        )}
        {section === "skills" && (
          <SkillsForm
            value={profile.skills}
            onChange={(skills) => onChange({ ...profile, skills })}
          />
        )}
        {section === "experience" && (
          <WorkExperienceForm
            value={profile.workExperience}
            onChange={(workExperience) =>
              onChange({ ...profile, workExperience })
            }
          />
        )}
        {section === "projects" && (
          <ProjectsForm
            value={profile.projects}
            onChange={(projects) => onChange({ ...profile, projects })}
          />
        )}
        {section === "education" && (
          <EducationForm
            value={profile.education}
            onChange={(education) => onChange({ ...profile, education })}
          />
        )}
        {section === "certifications" && (
          <CertificationsForm
            value={profile.certifications}
            onChange={(certifications) =>
              onChange({ ...profile, certifications })
            }
          />
        )}
        {section === "markdown" && <MarkdownPreview profile={profile} />}
      </div>
    </div>
  );
}
