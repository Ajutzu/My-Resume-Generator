import type { GeneratedResume, Profile } from "./types";

function extractJSON(text: string): string {
  // Strip markdown code fences if the model wrapped the JSON
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenced) return fenced[1].trim();

  // Find outermost JSON object
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }

  return text.trim();
}

export function parseGeneratedResume(
  rawText: string,
  originalProfile: Profile
): GeneratedResume {
  const jsonText = extractJSON(rawText);

  let parsed: Partial<GeneratedResume>;
  try {
    parsed = JSON.parse(jsonText) as Partial<GeneratedResume>;
  } catch {
    throw new Error(
      "The AI returned a response that could not be parsed as JSON. Try generating again, or switch to a different model."
    );
  }

  // Merge with the original profile so no field is ever lost.
  // The AI's values take priority; the original profile acts as a fallback.
  return {
    personalInfo: {
      ...originalProfile.personalInfo,
      ...(typeof parsed.personalInfo === "object" && parsed.personalInfo !== null
        ? parsed.personalInfo
        : {}),
    },
    summary:
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : originalProfile.summary,
    skills:
      Array.isArray(parsed.skills) && parsed.skills.length > 0
        ? (parsed.skills as string[])
        : originalProfile.skills,
    workExperience:
      Array.isArray(parsed.workExperience) && parsed.workExperience.length > 0
        ? parsed.workExperience
        : originalProfile.workExperience,
    projects:
      Array.isArray(parsed.projects) && parsed.projects.length > 0
        ? parsed.projects
        : originalProfile.projects,
    education:
      Array.isArray(parsed.education) && parsed.education.length > 0
        ? parsed.education
        : originalProfile.education,
    certifications:
      Array.isArray(parsed.certifications) && parsed.certifications.length > 0
        ? parsed.certifications
        : originalProfile.certifications,
  };
}
