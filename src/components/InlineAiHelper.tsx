"use client";

import React, { useState } from "react";
import { Sparkles, Languages, Zap, Award, Check, X, Loader2 } from "lucide-react";

interface InlineAiHelperProps {
  currentText: string;
  contextRole?: string;
  apiKey?: string;
  onApply: (newText: string) => void;
  compact?: boolean;
}

export const InlineAiHelper: React.FC<InlineAiHelperProps> = ({
  currentText,
  contextRole,
  apiKey,
  onApply,
  compact = false,
}) => {
  const [loadingMode, setLoadingMode] = useState<string | null>(null);
  const [result, setResult] = useState<{
    improvedText: string;
    alternatives: string[];
    explanation: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAi = async (
    targetTone: "xyz" | "translate" | "concise" | "executive"
  ) => {
    if (!currentText || !currentText.trim()) return;
    setLoadingMode(targetTone);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          action: "polish",
          text: currentText,
          targetTone,
          contextRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "AI request failed");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run AI");
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <div className="mt-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleRunAi("xyz")}
          disabled={Boolean(loadingMode) || !currentText.trim()}
          title="Transform into Action Verb + Context + Quantified Result (XYZ Formula)"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 disabled:opacity-40 transition cursor-pointer"
        >
          {loadingMode === "xyz" ? (
            <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
          ) : (
            <Sparkles className="w-3 h-3 text-indigo-600" />
          )}
          <span>XYZ Formula</span>
        </button>

        <button
          type="button"
          onClick={() => handleRunAi("translate")}
          disabled={Boolean(loadingMode) || !currentText.trim()}
          title="Translate Indonesian to High-Impact Professional English"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 disabled:opacity-40 transition cursor-pointer"
        >
          {loadingMode === "translate" ? (
            <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
          ) : (
            <Languages className="w-3 h-3 text-emerald-600" />
          )}
          <span>ID → EN Translate</span>
        </button>

        {!compact && (
          <>
            <button
              type="button"
              onClick={() => handleRunAi("concise")}
              disabled={Boolean(loadingMode) || !currentText.trim()}
              title="Condense into punchy single-line ATS bullet"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 disabled:opacity-40 transition cursor-pointer"
            >
              {loadingMode === "concise" ? (
                <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
              ) : (
                <Zap className="w-3 h-3 text-amber-600" />
              )}
              <span>Concise</span>
            </button>

            <button
              type="button"
              onClick={() => handleRunAi("executive")}
              disabled={Boolean(loadingMode) || !currentText.trim()}
              title="Elevate to Senior / Executive impact tone"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 hover:border-purple-300 disabled:opacity-40 transition cursor-pointer"
            >
              {loadingMode === "executive" ? (
                <Loader2 className="w-3 h-3 animate-spin text-purple-600" />
              ) : (
                <Award className="w-3 h-3 text-purple-600" />
              )}
              <span>Executive</span>
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="mt-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {result && (
        <div className="mt-2.5 p-3.5 rounded-xl bg-white border border-indigo-200 shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Gemini AI Suggestion
            </span>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500 italic">
            {result.explanation}
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200 flex items-start justify-between gap-3">
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {result.improvedText}
              </p>
              <button
                type="button"
                onClick={() => {
                  onApply(result.improvedText);
                  setResult(null);
                }}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Use
              </button>
            </div>

            {result.alternatives?.map((alt, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 hover:bg-slate-100/70 transition"
              >
                <p className="text-xs text-slate-700 leading-relaxed">{alt}</p>
                <button
                  type="button"
                  onClick={() => {
                    onApply(alt);
                    setResult(null);
                  }}
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium shadow-2xs transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Use
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
