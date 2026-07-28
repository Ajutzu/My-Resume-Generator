"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { profileToMarkdown } from "@/lib/markdown";
import { SectionCard } from "@/components/ui/fields";

interface Props {
  profile: Profile;
}

export default function MarkdownPreview({ profile }: Props) {
  const [copied, setCopied] = useState(false);
  const markdown = profileToMarkdown(profile);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  }

  const lineCount = markdown ? markdown.split("\n").length : 0;

  return (
    <SectionCard
      title="Markdown Preview"
      description="This is the profile Markdown that will be sent to the AI. Review it before generating your resume."
    >
      {markdown ? (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400">
              {markdown.length.toLocaleString()} characters · {lineCount} lines
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="ui-btn-ghost text-xs"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="text-xs font-mono bg-slate-50 border border-[rgba(0,0,0,0.06)] rounded-xl p-4 overflow-auto max-h-[60vh] whitespace-pre-wrap leading-relaxed text-slate-600">
            {markdown}
          </pre>
        </>
      ) : (
        <div className="text-center py-12 text-slate-400 text-sm">
          Fill in your profile to see the Markdown preview here.
        </div>
      )}
    </SectionCard>
  );
}
