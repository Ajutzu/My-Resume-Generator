"use client";

import { type ComponentType, useState, useSyncExternalStore } from "react";
import type { AppTab, GeneratedResume } from "@/lib/types";
import {
  subscribeToProfile,
  getProfileSnapshot,
  getProfileServerSnapshot,
  saveProfile,
  subscribeToJobDescription,
  getJobDescriptionSnapshot,
  getJobDescriptionServerSnapshot,
  saveJobDescription,
} from "@/lib/storage";
import ProfileEditor from "@/components/profile/ProfileEditor";
import JobDescriptionEditor from "@/components/job/JobDescriptionEditor";
import AIConfigEditor from "@/components/ai/AIConfigEditor";
import GeneratePanel from "@/components/generate/GeneratePanel";
import ResumePreview from "@/components/preview/ResumePreview";

/* ── Icons ── */
function IconProfile() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function IconDocument() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8L14 3z" />
      <path d="M14 3v5h5M9 12h6M9 16h4" />
    </svg>
  );
}
function IconSliders() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="8" cy="6" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="10" cy="18" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconLightning() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconBrand() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8L14 2z" />
      <path d="M14 2v6h6M9 13h6M9 17h4" />
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/* ── Nav config ── */
interface NavItem { id: AppTab; label: string; description: string; Icon: ComponentType; }
const NAV_ITEMS: NavItem[] = [
  { id: "profile",         label: "Profile",         description: "Master resume data",      Icon: IconProfile   },
  { id: "job-description", label: "Job Description", description: "Target role details",     Icon: IconDocument  },
  { id: "ai-config",       label: "AI Settings",     description: "Provider & API key",      Icon: IconSliders   },
  { id: "generate",        label: "Generate",        description: "Create tailored resume",  Icon: IconLightning },
  { id: "preview",         label: "Preview",         description: "Review & export PDF",     Icon: IconEye       },
];

/* ── Sidebar content (shared between desktop and mobile) ── */
function SidebarContent({
  activeTab,
  setActiveTab,
  generatedResume,
  onClose,
}: {
  activeTab: AppTab;
  setActiveTab: (t: AppTab) => void;
  generatedResume: GeneratedResume | null;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Brand */}
      <div className="px-4 py-4 border-b border-[rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(79,70,229,0.4)]">
            <IconBrand />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[13px] font-bold text-slate-900 leading-tight truncate">AJ Resume Generator</h1>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">AI-powered · Bring Your Own Token</p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
            >
              <IconX />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <p className="px-2.5 pt-0.5 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 select-none">
          Workspace
        </p>
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                onClose?.();
              }}
              className={[
                "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-left transition-all duration-150",
                active
                  ? "bg-indigo-50 shadow-[inset_0_0_0_1px_rgba(79,70,229,0.1)]"
                  : "hover:bg-slate-50",
              ].join(" ")}
            >
              <span className={active ? "text-indigo-500" : "text-slate-400"}>
                <item.Icon />
              </span>
              <div className="min-w-0 flex-1">
                <p className={[
                  "text-[13px] leading-tight",
                  active ? "font-semibold text-indigo-700" : "font-medium text-slate-700",
                ].join(" ")}>
                  {item.label}
                </p>
                <p className={[
                  "text-[10px] leading-tight mt-0.5 truncate",
                  active ? "text-indigo-400" : "text-slate-400",
                ].join(" ")}>
                  {item.description}
                </p>
              </div>
              {item.id === "generate" && generatedResume && !active && (
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </nav>

    </>
  );
}

/* ── Main shell ── */
export default function AppShell() {
  const [activeTab, setActiveTab] = useState<AppTab>("profile");
  const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profile = useSyncExternalStore(subscribeToProfile, getProfileSnapshot, getProfileServerSnapshot);
  const jobDescription = useSyncExternalStore(subscribeToJobDescription, getJobDescriptionSnapshot, getJobDescriptionServerSnapshot);
  const currentTab = NAV_ITEMS.find((t) => t.id === activeTab)!;

  return (
    <div className="flex h-full overflow-hidden bg-[#f2f2f7]">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          // Layout
          "flex flex-col w-60 shrink-0 bg-white",
          "border-r border-[rgba(0,0,0,0.06)]",
          // Mobile: fixed overlay with slide animation
          "fixed top-0 left-0 z-50 h-screen transition-transform duration-200 ease-out",
          // Desktop: static in flex flow
          "md:relative md:top-auto md:left-auto md:z-auto md:h-full md:translate-x-0 md:transition-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <SidebarContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          generatedResume={generatedResume}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* ── Main panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="shrink-0 h-14 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-[rgba(0,0,0,0.06)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-xs text-slate-400 font-medium">AJ Resume</span>
              <span className="hidden sm:block text-slate-300"><IconChevron /></span>
              <span className="text-sm font-semibold text-slate-800">{currentTab.label}</span>
            </div>
          </div>

          {/* Resume ready badge */}
          {generatedResume && (
            <span className="ui-badge-success">Resume ready</span>
          )}
        </header>

        {/* Scrollable page */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {activeTab === "profile" && (
              <ProfileEditor profile={profile} onChange={saveProfile} />
            )}
            {activeTab === "job-description" && (
              <JobDescriptionEditor value={jobDescription} onChange={saveJobDescription} />
            )}
            {activeTab === "ai-config" && <AIConfigEditor />}
            {activeTab === "generate" && (
              <GeneratePanel
                profile={profile}
                jobDescription={jobDescription}
                hasExistingResume={generatedResume !== null}
                onGenerated={setGeneratedResume}
                onNavigateToPreview={() => setActiveTab("preview")}
              />
            )}
            {activeTab === "preview" && (
              <ResumePreview
                resume={generatedResume}
                onNavigateToGenerate={() => setActiveTab("generate")}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
