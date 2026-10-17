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
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 disabled:opacity-40 transition cursor-pointer"
        >
          {loadingMode === "xyz" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          <span>XYZ Formula</span>
        </button>

        <button
          type="button"
          onClick={() => handleRunAi("translate")}
          disabled={Boolean(loadingMode) || !currentText.trim()}
          title="Translate Indonesian to High-Impact Professional English"
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 disabled:opacity-40 transition cursor-pointer"
        >
          {loadingMode === "translate" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Languages className="w-3 h-3" />
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
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 disabled:opacity-40 transition cursor-pointer"
            >
              {loadingMode === "concise" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Zap className="w-3 h-3" />
              )}
              <span>Concise</span>
            </button>

            <button
              type="button"
              onClick={() => handleRunAi("executive")}
              disabled={Boolean(loadingMode) || !currentText.trim()}
              title="Elevate to Senior / Executive impact tone"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 disabled:opacity-40 transition cursor-pointer"
            >
              {loadingMode === "executive" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Award className="w-3 h-3" />
              )}
              <span>Executive</span>
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="mt-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md px-2.5 py-1.5 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-300 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {result && (
        <div className="mt-2 p-3 rounded-lg bg-slate-900/95 border border-indigo-500/40 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Gemini AI Suggestion
            </span>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            {result.explanation}
          </p>

          <div className="space-y-1.5">
            <div className="p-2 rounded bg-indigo-950/50 border border-indigo-500/30 flex items-start justify-between gap-2">
              <p className="text-xs text-slate-100 leading-relaxed">
                {result.improvedText}
              </p>
              <button
                type="button"
                onClick={() => {
                  onApply(result.improvedText);
                  setResult(null);
                }}
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer"
              >
                <Check className="w-3 h-3" /> Use
              </button>
            </div>

            {result.alternatives?.map((alt, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-slate-800/60 border border-slate-700/60 flex items-start justify-between gap-2"
              >
                <p className="text-xs text-slate-300 leading-relaxed">{alt}</p>
                <button
                  type="button"
                  onClick={() => {
                    onApply(alt);
                    setResult(null);
                  }}
                  className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs cursor-pointer"
                >
                  <Check className="w-3 h-3" /> Use
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
