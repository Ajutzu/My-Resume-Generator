"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import type { GeneratedResume } from "@/lib/types";
import ResumeDocument from "@/components/resume/ResumeDocument";

interface Props {
  resume: GeneratedResume | null;
  onNavigateToGenerate: () => void;
}

export default function ResumePreview({ resume, onNavigateToGenerate }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Resume",
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `,
  });

  if (!resume) {
    return (
      <div className="ui-card p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8L14 2z"/>
            <path d="M14 2v6h6M9 13h6M9 17h4"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-500 mb-4">No resume generated yet.</p>
        <button
          type="button"
          onClick={onNavigateToGenerate}
          className="ui-btn-primary"
        >
          Go to Generate
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="ui-card !py-3 !px-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Resume Preview</h2>
          <p className="text-xs text-slate-400 mt-0.5">AI-tailored · based on your profile</p>
        </div>
        <button
          type="button"
          onClick={() => handlePrint()}
          className="ui-btn-primary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export PDF
        </button>
      </div>

      {/* Paper preview */}
      <div className="rounded-2xl bg-slate-100/80 border border-[rgba(0,0,0,0.05)] p-6 overflow-auto">
        <div className="shadow-[0_4px_24px_rgba(0,0,0,0.12)] rounded-sm overflow-hidden">
          <ResumeDocument resume={resume} ref={contentRef} />
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-slate-400 text-center">
        Not happy with the result? Edit your profile or job description and regenerate.
      </p>
    </div>
  );
}
