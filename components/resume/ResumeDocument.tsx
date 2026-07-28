import { forwardRef } from "react";
import type { GeneratedResume } from "@/lib/types";
import ResumeHeader from "./ResumeHeader";
import ResumeSummary from "./ResumeSummary";
import ResumeSkills from "./ResumeSkills";
import ResumeExperience from "./ResumeExperience";
import ResumeProjects from "./ResumeProjects";
import ResumeEducation from "./ResumeEducation";
import ResumeCertifications from "./ResumeCertifications";

interface Props {
  resume: GeneratedResume;
}

const ResumeDocument = forwardRef<HTMLDivElement, Props>(function ResumeDocument(
  { resume },
  ref
) {
  return (
    <div
      ref={ref}
      id="resume-document"
      className="bg-white text-zinc-900"
      style={{
        padding: "48px 56px",
        maxWidth: "816px",
        margin: "0 auto",
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      <ResumeHeader personalInfo={resume.personalInfo} />

      <ResumeSummary summary={resume.summary} />
      <ResumeSkills skills={resume.skills} />
      <ResumeExperience workExperience={resume.workExperience} />
      <ResumeProjects projects={resume.projects} />
      <ResumeEducation education={resume.education} />
      <ResumeCertifications certifications={resume.certifications} />
    </div>
  );
});

export default ResumeDocument;
