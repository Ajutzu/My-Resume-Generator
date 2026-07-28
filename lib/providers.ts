import type { AIProvider } from "./types";

export interface ProviderModel {
  id: string;
  label: string;
}

export interface ProviderInfo {
  id: AIProvider;
  name: string;
  models: ProviderModel[];
  defaultModel: string;
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  corsWarning?: string;
}

export const PROVIDERS: Record<AIProvider, ProviderInfo> = {
  groq: {
    id: "groq",
    name: "Groq (Free)",
    models: [
      { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile (free)" },
      { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant (free)" },
      { id: "gemma2-9b-it", label: "Gemma 2 9B (free)" },
      { id: "deepseek-r1-distill-llama-70b", label: "DeepSeek R1 Distill Llama 70B (free)" },
    ],
    defaultModel: "llama-3.3-70b-versatile",
    apiKeyLabel: "Groq API Key",
    apiKeyPlaceholder: "gsk_...",
  },
  grok: {
    id: "grok",
    name: "xAI Grok",
    models: [
      { id: "grok-3", label: "Grok 3" },
      { id: "grok-3-mini", label: "Grok 3 Mini (free tier)" },
      { id: "grok-2", label: "Grok 2" },
    ],
    defaultModel: "grok-3-mini",
    apiKeyLabel: "xAI API Key",
    apiKeyPlaceholder: "xai-...",
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "gpt-4o", label: "GPT-4o" },
      { id: "gpt-4o-mini", label: "GPT-4o Mini" },
      { id: "gpt-4-turbo", label: "GPT-4 Turbo" },
    ],
    defaultModel: "gpt-4o",
    apiKeyLabel: "OpenAI API Key",
    apiKeyPlaceholder: "sk-...",
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    models: [
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
      { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
      { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    ],
    defaultModel: "gemini-2.0-flash",
    apiKeyLabel: "Gemini API Key",
    apiKeyPlaceholder: "AIza...",
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    models: [
      { id: "claude-opus-4-6", label: "Claude Opus 4" },
      { id: "claude-sonnet-4-6", label: "Claude Sonnet 4" },
      { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4" },
    ],
    defaultModel: "claude-sonnet-4-6",
    apiKeyLabel: "Anthropic API Key",
    apiKeyPlaceholder: "sk-ant-...",
    corsWarning:
      "Anthropic's API does not support direct browser requests due to CORS policy. Resume generation will likely fail. Use OpenAI or Gemini instead, or set up a local CORS proxy.",
  },
};

export const PROVIDER_LIST: ProviderInfo[] = Object.values(PROVIDERS);

export function getProviderInfo(id: AIProvider): ProviderInfo {
  return PROVIDERS[id];
}
