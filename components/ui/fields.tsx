"use client";

import { useState } from "react";
import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="ui-input" />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="ui-input resize-none" />;
}

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="ui-label">{label}</label>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{hint}</p>
      )}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="ui-card">
      <div className="mb-5">
        <h2 className="ui-section-title">{title}</h2>
        {description && (
          <p className="ui-section-desc">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Type and press Enter",
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const trimmed = raw.trim().replace(/,+$/, "");
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div
      className="min-h-[42px] rounded-xl border border-[#d1d5db] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-within:border-indigo-500 focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.15)] transition-all"
    >
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {tags.map((tag) => (
          <span key={tag} className="ui-tag">
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity leading-none"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input) addTag(input); }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="w-full text-sm bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
      />
    </div>
  );
}
