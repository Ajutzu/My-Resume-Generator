import type { AIProvider } from "./types";

export interface AIRequestOptions {
  provider: AIProvider;
  model: string;
  apiKey: string;
  systemPrompt: string;
  userMessage: string;
}

function httpError(status: number): Error {
  switch (status) {
    case 401:
      return new Error(
        "Invalid API key. Check your key in AI Settings."
      );
    case 403:
      return new Error(
        "Access denied. Your API key may not have permission for this model or has exceeded its quota."
      );
    case 429:
      return new Error(
        "Rate limit exceeded. Wait a moment and try again."
      );
    case 500:
    case 502:
    case 503:
      return new Error(
        `The AI provider returned a server error (${status}). Try again in a moment.`
      );
    default:
      return new Error(
        `Request failed (HTTP ${status}). Check your API key and model selection in AI Settings.`
      );
  }
}

// OpenAI-compatible endpoint — used by both OpenAI and xAI Grok.
async function callOpenAICompat(
  baseUrl: string,
  model: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });
  } catch {
    throw new Error(
      "Network error. Check your internet connection. If using Anthropic, note that CORS restrictions may block browser requests."
    );
  }

  if (!res.ok) throw httpError(res.status);

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("The AI returned an empty response. Try again.");
  return content;
}

async function callGemini(
  model: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
        },
      }),
    });
  } catch {
    throw new Error("Network error reaching Google Gemini. Check your internet connection.");
  }

  if (!res.ok) throw httpError(res.status);

  const data = (await res.json()) as {
    candidates: { content: { parts: { text: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response. Try again.");
  return text;
}

async function callAnthropic(
  model: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
  } catch {
    throw new Error(
      "Network error reaching Anthropic. Their API does not support direct browser requests due to CORS policy. Consider using OpenAI or Gemini instead."
    );
  }

  if (!res.ok) throw httpError(res.status);

  const data = (await res.json()) as {
    content: { type: string; text: string }[];
  };
  const text = data.content?.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("Anthropic returned an empty response. Try again.");
  return text;
}

export async function callAI(options: AIRequestOptions): Promise<string> {
  const { provider, model, apiKey, systemPrompt, userMessage } = options;

  if (!apiKey.trim()) {
    throw new Error("No API key set. Enter your API key in AI Settings.");
  }
  if (!model.trim()) {
    throw new Error("No model selected. Choose a model in AI Settings.");
  }

  switch (provider) {
    case "openai":
      return callOpenAICompat(
        "https://api.openai.com/v1",
        model,
        apiKey,
        systemPrompt,
        userMessage
      );
    case "grok":
      return callOpenAICompat(
        "https://api.x.ai/v1",
        model,
        apiKey,
        systemPrompt,
        userMessage
      );
    case "groq":
      return callOpenAICompat(
        "https://api.groq.com/openai/v1",
        model,
        apiKey,
        systemPrompt,
        userMessage
      );
    case "gemini":
      return callGemini(model, apiKey, systemPrompt, userMessage);
    case "anthropic":
      return callAnthropic(model, apiKey, systemPrompt, userMessage);
  }
}
