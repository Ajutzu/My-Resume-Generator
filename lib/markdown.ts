import type {
  Profile,
  WorkExperience,
  Project,
  Education,
  Certification,
} from "./types";

function bullets(items: string[]): string {
  const filtered = items.filter((i) => i.trim());
  return filtered.map((i) => `- ${i.trim()}`).join("\n");
}

function dateRange(start: string, end: string, current: boolean): string {
  const parts = [start, current ? "Present" : end].filter(Boolean);
  return parts.join(" – ");
}

function workExperienceBlock(exp: WorkExperience): string {
  const parts: string[] = [];

  const header = [exp.jobTitle, exp.company].filter(Boolean).join(" — ");
  parts.push(`## ${header || "Position"}`);

  const meta: string[] = [];
  if (exp.location) meta.push(exp.location);
  const range = dateRange(exp.startDate, exp.endDate, exp.current);
  if (range) meta.push(range);
  if (meta.length > 0) parts.push(`*${meta.join(" · ")}*`);

  if (exp.description.trim()) parts.push(exp.description.trim());

  const responsibilities = bullets(exp.responsibilities);
  if (responsibilities) parts.push(`### Responsibilities\n\n${responsibilities}`);

  const achievements = bullets(exp.achievements);
  if (achievements) parts.push(`### Achievements\n\n${achievements}`);

  return parts.join("\n\n");
}

function projectBlock(proj: Project): string {
  const parts: string[] = [];

  parts.push(`## ${proj.name || "Project"}`);

  const techs = proj.technologies.filter((t) => t.trim());
  if (techs.length > 0) parts.push(`*Technologies: ${techs.join(", ")}*`);

  const links: string[] = [];
  if (proj.url) links.push(`[Live](${proj.url})`);
  if (proj.githubUrl) links.push(`[GitHub](${proj.githubUrl})`);
  if (links.length > 0) parts.push(links.join(" · "));

  if (proj.description.trim()) parts.push(proj.description.trim());

  const contributions = bullets(proj.keyContributions);
  if (contributions) parts.push(`### Key Contributions\n\n${contributions}`);

  return parts.join("\n\n");
}

function educationBlock(edu: Education): string {
  const parts: string[] = [];

  const header = [edu.degree, edu.school].filter(Boolean).join(" — ");
  parts.push(`## ${header || "Degree"}`);

  const meta: string[] = [];
  if (edu.location) meta.push(edu.location);
  const range = [edu.startDate, edu.endDate].filter(Boolean).join(" – ");
  if (range) meta.push(range);
  if (meta.length > 0) parts.push(`*${meta.join(" · ")}*`);

  if (edu.description.trim()) parts.push(edu.description.trim());

  return parts.join("\n\n");
}

function certificationBlock(cert: Certification): string {
  const parts: string[] = [];

  parts.push(`## ${cert.name || "Certification"}`);

  const meta: string[] = [];
  if (cert.issuer) meta.push(cert.issuer);
  if (cert.date) meta.push(cert.date);
  if (meta.length > 0) parts.push(`*${meta.join(" · ")}*`);

  if (cert.credentialUrl) parts.push(`[Credential](${cert.credentialUrl})`);

  return parts.join("\n\n");
}

export function profileToMarkdown(profile: Profile): string {
  const sections: string[] = [];

  // Personal Information
  const pi = profile.personalInfo;
  const personalLines: string[] = [];
  if (pi.fullName) personalLines.push(`Name: ${pi.fullName}`);
  if (pi.title) personalLines.push(`Title: ${pi.title}`);
  if (pi.email) personalLines.push(`Email: ${pi.email}`);
  if (pi.phone) personalLines.push(`Phone: ${pi.phone}`);
  if (pi.location) personalLines.push(`Location: ${pi.location}`);
  if (pi.linkedin) personalLines.push(`LinkedIn: ${pi.linkedin}`);
  if (pi.github) personalLines.push(`GitHub: ${pi.github}`);
  if (pi.portfolio) personalLines.push(`Portfolio: ${pi.portfolio}`);
  if (personalLines.length > 0) {
    sections.push(`# Personal Information\n\n${personalLines.join("\n")}`);
  }

  // Professional Summary
  if (profile.summary.trim()) {
    sections.push(`# Professional Summary\n\n${profile.summary.trim()}`);
  }

  // Skills
  const skills = profile.skills.filter((s) => s.trim());
  if (skills.length > 0) {
    sections.push(`# Skills\n\n${skills.map((s) => `- ${s}`).join("\n")}`);
  }

  // Work Experience
  const experiences = profile.workExperience.filter(
    (e) => e.jobTitle || e.company
  );
  if (experiences.length > 0) {
    const content = experiences.map(workExperienceBlock).join("\n\n---\n\n");
    sections.push(`# Work Experience\n\n${content}`);
  }

  // Projects
  const projects = profile.projects.filter((p) => p.name || p.description);
  if (projects.length > 0) {
    const content = projects.map(projectBlock).join("\n\n---\n\n");
    sections.push(`# Projects\n\n${content}`);
  }

  // Education
  const education = profile.education.filter((e) => e.degree || e.school);
  if (education.length > 0) {
    const content = education.map(educationBlock).join("\n\n---\n\n");
    sections.push(`# Education\n\n${content}`);
  }

  // Certifications
  const certifications = profile.certifications.filter((c) => c.name);
  if (certifications.length > 0) {
    const content = certifications.map(certificationBlock).join("\n\n---\n\n");
    sections.push(`# Certifications\n\n${content}`);
  }

  return sections.join("\n\n---\n\n");
}
