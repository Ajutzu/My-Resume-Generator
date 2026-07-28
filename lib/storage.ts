import type { AIProvider, Profile } from "./types";

const PROFILE_KEY = "resume_generator_profile";

export const defaultProfile: Profile = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  skills: [],
  workExperience: [],
  projects: [],
  education: [],
  certifications: [],
};

// --- Internal cache ---
// useSyncExternalStore requires getSnapshot() to return the same reference
// when the data hasn't changed, otherwise React warns about infinite loops.
let cachedRaw: string | null = null;
let cachedProfile: Profile | null = null;

function parseRaw(raw: string | null): Profile {
  if (!raw) return structuredClone(defaultProfile);
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return structuredClone(defaultProfile);
  }
}

// --- Subscription ---
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToProfile(callback: Listener): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// --- Snapshots for useSyncExternalStore ---
export function getProfileSnapshot(): Profile {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (raw === cachedRaw && cachedProfile !== null) return cachedProfile;
  cachedRaw = raw;
  cachedProfile = parseRaw(raw);
  return cachedProfile;
}

const SERVER_SNAPSHOT: Profile = structuredClone(defaultProfile);

export function getProfileServerSnapshot(): Profile {
  return SERVER_SNAPSHOT;
}

// --- Write ---
export function saveProfile(profile: Profile): void {
  try {
    const json = JSON.stringify(profile);
    localStorage.setItem(PROFILE_KEY, json);
    // Update cache so getProfileSnapshot returns the same reference
    cachedRaw = json;
    cachedProfile = profile;
    listeners.forEach((l) => l());
  } catch {
    console.error("Failed to save profile to localStorage");
  }
}

// =============================================================================
// Job Description
// =============================================================================

const JOB_KEY = "resume_generator_job_description";

// Sentinel: undefined means we haven't read from localStorage yet.
let cachedJobRaw: string | null | undefined = undefined;
let cachedJobValue = "";

const jobListeners = new Set<Listener>();

export function subscribeToJobDescription(callback: Listener): () => void {
  jobListeners.add(callback);
  return () => jobListeners.delete(callback);
}

export function getJobDescriptionSnapshot(): string {
  const raw = localStorage.getItem(JOB_KEY);
  if (cachedJobRaw !== undefined && raw === cachedJobRaw) return cachedJobValue;
  cachedJobRaw = raw;
  cachedJobValue = raw ?? "";
  return cachedJobValue;
}

// String primitives are compared by value, so returning "" directly is safe.
export function getJobDescriptionServerSnapshot(): string {
  return "";
}

export function saveJobDescription(text: string): void {
  try {
    localStorage.setItem(JOB_KEY, text);
    cachedJobRaw = text;
    cachedJobValue = text;
    jobListeners.forEach((l) => l());
  } catch {
    console.error("Failed to save job description to localStorage");
  }
}

// =============================================================================
// AI Config — preferences (provider + model) in localStorage,
// API key in sessionStorage with opt-in localStorage persistence.
// =============================================================================

const AI_PREFS_KEY = "resume_generator_ai_prefs";
const API_KEY_PREFIX = "resume_generator_api_key_";

export interface AIPrefs {
  provider: AIProvider;
  model: string;
}

const DEFAULT_AI_PREFS: AIPrefs = { provider: "openai", model: "gpt-4o" };

export function getAIPrefsFromStorage(): AIPrefs {
  try {
    const raw = localStorage.getItem(AI_PREFS_KEY);
    if (!raw) return { ...DEFAULT_AI_PREFS };
    return JSON.parse(raw) as AIPrefs;
  } catch {
    return { ...DEFAULT_AI_PREFS };
  }
}

export function saveAIPrefs(prefs: AIPrefs): void {
  try {
    localStorage.setItem(AI_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    console.error("Failed to save AI preferences");
  }
}

// Keys are stored per-provider so switching providers doesn't lose them.
export function getAPIKey(provider: AIProvider): string {
  try {
    return (
      sessionStorage.getItem(`${API_KEY_PREFIX}${provider}_s`) ??
      localStorage.getItem(`${API_KEY_PREFIX}${provider}_l`) ??
      ""
    );
  } catch {
    return "";
  }
}

export function saveAPIKey(
  provider: AIProvider,
  key: string,
  persist: boolean
): void {
  try {
    const sessionKey = `${API_KEY_PREFIX}${provider}_s`;
    const localKey = `${API_KEY_PREFIX}${provider}_l`;
    if (key) {
      sessionStorage.setItem(sessionKey, key);
      if (persist) {
        localStorage.setItem(localKey, key);
      } else {
        localStorage.removeItem(localKey);
      }
    } else {
      sessionStorage.removeItem(sessionKey);
      localStorage.removeItem(localKey);
    }
  } catch {
    console.error("Failed to save API key");
  }
}

export function isAPIKeyPersisted(provider: AIProvider): boolean {
  try {
    return !!localStorage.getItem(`${API_KEY_PREFIX}${provider}_l`);
  } catch {
    return false;
  }
}

// --- Import / Export ---
export function exportProfileJSON(profile: Profile): void {
  const json = JSON.stringify(profile, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume-profile.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importProfileJSON(file: File): Promise<Profile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as Profile;
        resolve(parsed);
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
