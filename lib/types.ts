export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  githubUrl: string;
  keyContributions: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
}

export interface Profile {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string[];
  workExperience: WorkExperience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}

export type AIProvider = "openai" | "gemini" | "anthropic" | "grok" | "groq";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

export interface GeneratedResume {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string[];
  workExperience: WorkExperience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}

export type AppTab = "profile" | "job-description" | "ai-config" | "generate" | "preview";
