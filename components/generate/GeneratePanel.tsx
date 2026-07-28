"use client";

import { useState } from "react";
import type { GeneratedResume, Profile } from "@/lib/types";
import { getAIPrefsFromStorage, getAPIKey } from "@/lib/storage";
import { getProviderInfo } from "@/lib/providers";
import { profileToMarkdown } from "@/lib/markdown";
import { buildSystemPrompt, buildUserMessage } from "@/lib/prompt";
import { callAI } from "@/lib/ai";
import { parseGeneratedResume } from "@/lib/parser";

interface Props {
  profile: Profile;
  jobDescription: string;
  hasExistingResume: boolean;
  onGenerated: (resume: GeneratedResume) => void;
  onNavigateToPreview: () => void;
}

type Status =
  | { type: "idle" }
  | { type: "generating" }
  | { type: "success" }
  | { type: "error"; message: string };

function hasProfileContent(profile: Profile): boolean {
  return (
    !!profile.personalInfo.fullName.trim() ||
    profile.skills.length > 0 ||
    profile.workExperience.length > 0 ||
    !!profile.summary.trim()
  );
}

export default function GeneratePanel({
  profile,
  jobDescription,
  hasExistingResume,
  onGenerated,
  onNavigateToPreview,
}: Props) {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const prefs = getAIPrefsFromStorage();
  const providerInfo = getProviderInfo(prefs.provider);
  const apiKey = getAPIKey(prefs.provider);

  const profileOk = hasProfileContent(profile);
  const jobOk = jobDescription.trim().length > 0;
  const keyOk = apiKey.trim().length > 0;
  const canGenerate = profileOk && jobOk && keyOk;

  async function handleGenerate() {
    setStatus({ type: "generating" });
    try {
      const profileMarkdown = profileToMarkdown(profile);
      const raw = await callAI({
        provider: prefs.provider,
        model: prefs.model,
        apiKey,
        systemPrompt: buildSystemPrompt(),
        userMessage: buildUserMessage(profileMarkdown, jobDescription),
      });
      const resume = parseGeneratedResume(raw, profile);
      onGenerated(resume);
      setStatus({ type: "success" });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Pre-flight checklist */}
      <div className="ui-card">
        <h2 className="ui-section-title mb-4">Pre-flight Check</h2>

        <div className="space-y-3">
          <CheckRow
            ok={profileOk}
            label="Profile"
            okText="Profile has content"
            failText="Add your name, skills, or work experience in the Profile tab"
          />
          <CheckRow
            ok={jobOk}
            label="Job Description"
            okText="Job description entered"
            failText="Paste a job description in the Job Description tab"
          />
          <CheckRow
            ok={keyOk}
            label="API Key"
            okText={`${providerInfo.name} key is set`}
            failText="Enter your API key in AI Settings"
          />
        </div>

        <div className="mt-5 pt-5 border-t border-[rgba(0,0,0,0.06)]">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 mb-5">
            <span>
              Provider:{" "}
              <span className="font-semibold text-slate-600">{providerInfo.name}</span>
            </span>
            <span>·</span>
            <span>
              Model:{" "}
              <span className="font-mono font-semibold text-slate-600">{prefs.model}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate || status.type === "generating"}
            className="ui-btn-primary"
          >
            {status.type === "generating" ? (
              <>
                <span className="ui-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                Generating…
              </>
            ) : hasExistingResume ? (
              "Regenerate Resume"
            ) : (
              "Generate Resume"
            )}
          </button>
        </div>
      </div>

      {/* Generating state */}
      {status.type === "generating" && (
        <div className="ui-card flex items-center gap-4">
          <span className="ui-spinner" />
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Generating your tailored resume…
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Sending request to {providerInfo.name}. This may take 15–30 seconds.
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {status.type === "error" && (
        <div className="ui-notice ui-notice-red">
          <p className="font-semibold mb-1">Generation failed</p>
          <p className="leading-relaxed">{status.message}</p>
          <button
            type="button"
            onClick={() => setStatus({ type: "idle" })}
            className="mt-3 text-xs underline opacity-70 hover:opacity-100 transition-opacity"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success state */}
      {status.type === "success" && (
        <div className="ui-notice ui-notice-green">
          <p className="font-semibold mb-1">Resume generated</p>
          <p className="mb-4">Your tailored resume is ready to preview and export as PDF.</p>
          <button
            type="button"
            onClick={onNavigateToPreview}
            className="ui-btn-primary"
            style={{ background: "#15803d" }}
          >
            View Resume →
          </button>
        </div>
      )}

      {/* Privacy notice */}
      <div className="ui-notice ui-notice-amber">
        <strong>Privacy:</strong> When you generate, your profile and job
        description are sent directly from your browser to{" "}
        {providerInfo.name}. They are not routed through any server owned by
        this application.
      </div>
    </div>
  );
}

function CheckRow({
  ok,
  label,
  okText,
  failText,
}: {
  ok: boolean;
  label: string;
  okText: string;
  failText: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-[rgba(0,0,0,0.04)]">
      <span
        className={[
          "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold",
          ok
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-500",
        ].join(" ")}
      >
        {ok ? "✓" : "✗"}
      </span>
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-slate-800">{label}: </span>
        {ok ? okText : failText}
      </p>
    </div>
  );
}
