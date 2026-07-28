"use client";

import { useState } from "react";
import type { AIProvider } from "@/lib/types";
import { PROVIDER_LIST, getProviderInfo } from "@/lib/providers";
import {
  getAIPrefsFromStorage,
  saveAIPrefs,
  getAPIKey,
  saveAPIKey,
  isAPIKeyPersisted,
} from "@/lib/storage";
import { Field, Input, SectionCard } from "@/components/ui/fields";

const CUSTOM_MODEL_VALUE = "__custom__";

interface State {
  provider: AIProvider;
  model: string;
  customModel: string;
  apiKey: string;
  rememberKey: boolean;
  showKey: boolean;
}

function buildInitialState(): State {
  if (typeof window === "undefined") {
    return { provider: "openai", model: "gpt-4o", customModel: "", apiKey: "", rememberKey: false, showKey: false };
  }
  const prefs = getAIPrefsFromStorage();
  const info = getProviderInfo(prefs.provider);
  const isPreset = info.models.some((m) => m.id === prefs.model);
  return {
    provider: prefs.provider,
    model: isPreset ? prefs.model : info.defaultModel,
    customModel: isPreset ? "" : prefs.model,
    apiKey: getAPIKey(prefs.provider),
    rememberKey: isAPIKeyPersisted(prefs.provider),
    showKey: false,
  };
}

export default function AIConfigEditor() {
  const [state, setState] = useState<State>(buildInitialState);

  function patch(updates: Partial<State>) {
    setState((prev) => ({ ...prev, ...updates }));
  }

  const providerInfo = getProviderInfo(state.provider);
  const inCustomMode = state.customModel !== "";
  const effectiveModel = inCustomMode ? state.customModel : state.model;
  const selectValue = inCustomMode ? CUSTOM_MODEL_VALUE : state.model;

  function handleProviderChange(newProvider: AIProvider) {
    saveAPIKey(state.provider, state.apiKey, state.rememberKey);
    const newInfo = getProviderInfo(newProvider);
    const newModel = newInfo.defaultModel;
    saveAIPrefs({ provider: newProvider, model: newModel });
    patch({
      provider: newProvider,
      model: newModel,
      customModel: "",
      apiKey: getAPIKey(newProvider),
      rememberKey: isAPIKeyPersisted(newProvider),
    });
  }

  function handleModelSelectChange(value: string) {
    if (value === CUSTOM_MODEL_VALUE) {
      patch({ customModel: effectiveModel });
    } else {
      saveAIPrefs({ provider: state.provider, model: value });
      patch({ model: value, customModel: "" });
    }
  }

  function handleCustomModelChange(value: string) {
    saveAIPrefs({ provider: state.provider, model: value });
    patch({ customModel: value });
  }

  function handleAPIKeyChange(value: string) {
    patch({ apiKey: value });
    saveAPIKey(state.provider, value, state.rememberKey);
  }

  function handleRememberChange(checked: boolean) {
    patch({ rememberKey: checked });
    saveAPIKey(state.provider, state.apiKey, checked);
  }

  function handleClearKey() {
    patch({ apiKey: "", rememberKey: false });
    saveAPIKey(state.provider, "", false);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Provider */}
      <SectionCard
        title="AI Provider"
        description="Select your AI provider. You will need an API key from that provider's developer console."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PROVIDER_LIST.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleProviderChange(p.id)}
              className={[
                "px-3 py-3 rounded-xl text-[13px] font-medium border transition-all",
                state.provider === p.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-[0_2px_6px_rgba(79,70,229,0.3)]"
                  : "bg-white border-[#d1d5db] text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
              ].join(" ")}
            >
              {p.name}
            </button>
          ))}
        </div>

        {providerInfo.corsWarning && (
          <div className="mt-4 ui-notice ui-notice-red">
            <strong>Warning:</strong> {providerInfo.corsWarning}
          </div>
        )}
      </SectionCard>

      {/* Model */}
      <SectionCard
        title="Model"
        description="Choose a preset model or enter a custom model ID."
      >
        <Field label="Model">
          <select
            value={selectValue}
            onChange={(e) => handleModelSelectChange(e.target.value)}
            className="ui-input"
          >
            {providerInfo.models.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
            <option value={CUSTOM_MODEL_VALUE}>Custom model ID…</option>
          </select>
        </Field>

        {inCustomMode && (
          <Field label="Custom Model ID" className="mt-4">
            <Input
              value={state.customModel}
              onChange={(e) => handleCustomModelChange(e.target.value)}
              placeholder="e.g. gpt-4o-2024-11-20"
            />
          </Field>
        )}

        <p className="mt-3 text-xs text-slate-400">
          Active:{" "}
          <span className="font-mono font-semibold text-slate-600">
            {effectiveModel || "—"}
          </span>
        </p>
      </SectionCard>

      {/* API Key */}
      <SectionCard
        title="API Key"
        description={`Your ${providerInfo.name} API key. It is never sent to this application's servers — requests go directly from your browser to ${providerInfo.name}.`}
      >
        <Field label={providerInfo.apiKeyLabel}>
          <div className="flex gap-2">
            <input
              type={state.showKey ? "text" : "password"}
              value={state.apiKey}
              onChange={(e) => handleAPIKeyChange(e.target.value)}
              placeholder={state.showKey ? providerInfo.apiKeyPlaceholder : "••••••••••••••••"}
              autoComplete="off"
              spellCheck={false}
              className="ui-input flex-1 min-w-0"
            />
            <button
              type="button"
              onClick={() => patch({ showKey: !state.showKey })}
              className="ui-btn-secondary shrink-0"
            >
              {state.showKey ? "Hide" : "Show"}
            </button>
            {state.apiKey && (
              <button
                type="button"
                onClick={handleClearKey}
                className="ui-btn-secondary shrink-0 !text-red-500 hover:!bg-red-50 hover:!border-red-200"
              >
                Clear
              </button>
            )}
          </div>
        </Field>

        <label className="mt-5 flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={state.rememberKey}
            onChange={(e) => handleRememberChange(e.target.checked)}
            className="mt-0.5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <p className="text-sm font-medium text-slate-700">Remember API key</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {state.rememberKey
                ? "Key is stored in localStorage and will persist after the browser is closed. Only use this on a trusted private device."
                : "Key is stored in sessionStorage only and will be cleared when you close this tab."}
            </p>
          </div>
        </label>
      </SectionCard>

      {/* Summary */}
      <div className="ui-card !py-3 !px-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <span>
            Provider:{" "}
            <span className="font-semibold text-slate-700">{providerInfo.name}</span>
          </span>
          <span>·</span>
          <span>
            Model:{" "}
            <span className="font-mono font-semibold text-slate-700">{effectiveModel || "—"}</span>
          </span>
          <span>·</span>
          <span>
            API Key:{" "}
            <span className="font-semibold text-slate-700">
              {state.apiKey ? `Set · ${state.rememberKey ? "persisted" : "session only"}` : "Not set"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
