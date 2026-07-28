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

export default function ResumeDocument({ resume }: Props) {
  return (
    <div
      id="resume-document"
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "56px 64px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        color: "#111827",
        fontFamily: 'Georgia, "Book Antiqua", "Palatino Linotype", serif',
        boxSizing: "border-box",
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
}
