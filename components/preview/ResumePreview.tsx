"use client";

import type { GeneratedResume } from "@/lib/types";
import ResumeDocument from "@/components/resume/ResumeDocument";

interface Props {
  resume: GeneratedResume | null;
  onNavigateToGenerate: () => void;
}

function handlePrint() {
  const el = document.getElementById("resume-document");
  if (!el) return;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Resume</title>
  <style>
    /* Let the browser apply consistent padding on every page */
    @page { size: A4; margin: 56px 64px; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #fff; }
    /* Override the inline padding/width so @page margin does the job */
    #resume-document {
      width: 100% !important;
      min-height: auto !important;
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
    }
  </style>
</head>
<body>${el.outerHTML}</body>
</html>`);
  win.document.close();
  win.focus();
  win.onafterprint = () => win.close();
  win.print();
}

export default function ResumePreview({ resume, onNavigateToGenerate }: Props) {
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
        <button type="button" onClick={onNavigateToGenerate} className="ui-btn-primary">
          Go to Generate
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="ui-card !py-3 !px-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Resume Preview</h2>
          <p className="text-xs text-slate-400 mt-0.5">A4 · Georgia · AI-tailored · Click any text to edit</p>
        </div>
        <button type="button" onClick={handlePrint} className="ui-btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* Print tip */}
      <div className="ui-notice ui-notice-amber">
        <strong>Tip:</strong> In the print dialog, set the destination to <strong>Save as PDF</strong> for an ATS-friendly document with real, searchable text.
      </div>

      {/* A4 paper preview — contentEditable so the user can tweak content before printing */}
      <div
        className="overflow-auto rounded-2xl border border-[rgba(0,0,0,0.05)]"
        style={{ background: "#e8e8ed", padding: "24px" }}
      >
        <div style={{ width: 794, margin: "0 auto", boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
          <div contentEditable suppressContentEditableWarning style={{ outline: "none" }}>
            <ResumeDocument resume={resume} />
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Click any text above to edit it before saving. Not happy with the result? Edit your profile or job description and regenerate.
      </p>
    </div>
  );
}
