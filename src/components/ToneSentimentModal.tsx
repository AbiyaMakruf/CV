"use client";

import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  Gauge,
  ShieldCheck,
  Zap,
  TrendingUp,
  Brain,
  Award,
  Layers,
  ArrowRight,
  Flame,
  Check,
} from "lucide-react";
import {
  ResumeDocumentData,
  SentimentType,
  TailoredResumeRecord,
  ToneAnalysisResult,
  TonePreset,
} from "@/types/resume";

interface ToneSentimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeResume: TailoredResumeRecord;
  apiKey?: string;
  onApplyRestyle: (updatedCvData: ResumeDocumentData) => Promise<void>;
}

const PRESET_CONFIG: Record<
  TonePreset,
  {
    title: string;
    subtitle: string;
    focus: string;
    badge: string;
    icon: React.ReactNode;
    color: string;
  }
> = {
  "Executive & Strategic Leader": {
    title: "Executive & Strategic Leader",
    subtitle: "Cocok untuk posisi Staff, Lead, Engineering Manager, VP, atau C-Level.",
    focus: "Menekankan kepemilikan bisnis, strategi roadmap, ROI finansial, dan kepemimpinan tim lintas fungsi.",
    badge: "Strategic ROI",
    icon: <Award className="w-4 h-4 text-purple-600" />,
    color: "border-purple-200 hover:border-purple-400 bg-purple-50/20",
  },
  "Technical Deep-Dive Specialist": {
    title: "Technical Deep-Dive Specialist",
    subtitle: "Cocok untuk Senior Engineer, Architect, Backend, AI/ML, dan Cloud Infrastructure.",
    focus: "Menonjolkan arsitektur sistem terdistribusi, optimasi latensi (P95/P99), algoritma, dan penguasaan stack mendalam.",
    badge: "System Rigor",
    icon: <Brain className="w-4 h-4 text-blue-600" />,
    color: "border-blue-200 hover:border-blue-400 bg-blue-50/20",
  },
  "Product & Innovation Driver": {
    title: "Product & Innovation Driver",
    subtitle: "Cocok untuk Product Engineer, Full-Stack, Frontend, dan Startup Generalist.",
    focus: "Menonjolkan empati pengguna, eksperimen A/B testing, metrik retensi/konversi, dan kecepatan peluncuran fitur.",
    badge: "Growth & Velocity",
    icon: <Flame className="w-4 h-4 text-emerald-600" />,
    color: "border-emerald-200 hover:border-emerald-400 bg-emerald-50/20",
  },
};

const SENTIMENT_BADGES: Record<
  SentimentType,
  { label: string; bg: string; text: string; border: string }
> = {
  "Action-Driven": {
    label: "Action-Driven (Sangat Proaktif)",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-300",
  },
  Confident: {
    label: "Confident (Tegas & Percaya Diri)",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-300",
  },
  Objective: {
    label: "Objective (Netral & Faktual)",
    bg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-300",
  },
  Passive: {
    label: "Passive (Perlu Peningkatan Kata Kerja)",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-300",
  },
};

export const ToneSentimentModal: React.FC<ToneSentimentModalProps> = ({
  isOpen,
  onClose,
  activeResume,
  apiKey,
  onApplyRestyle,
}) => {
  const [analysis, setAnalysis] = useState<ToneAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] =
    useState<TonePreset>("Executive & Strategic Leader");
  const [isRestyling, setIsRestyling] = useState<boolean>(false);
  const [restyleChangelog, setRestyleChangelog] = useState<string[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !analysis) {
      runToneAnalysis();
    }
  }, [isOpen]);

  const runToneAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setErrorMessage(null);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          action: "analyze-tone",
          cvData: activeResume.cvData,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Error ${res.status}: Gagal menganalisis tone.`);
      }

      const data = await res.json();
      setAnalysis(data.toneAnalysis);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal menganalisis tone CV.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyPreset = async () => {
    try {
      setIsRestyling(true);
      setErrorMessage(null);
      setRestyleChangelog(null);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          action: "restyle-tone",
          cvData: activeResume.cvData,
          preset: selectedPreset,
          targetRole: activeResume.targetRole,
          resumeId: activeResume.id,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Error ${res.status}: Gagal menerapkan restyle tone.`);
      }

      const data = await res.json();
      await onApplyRestyle(data.restyledCvData);
      setRestyleChangelog(data.changelog);

      // Refresh analysis after restyling
      setTimeout(() => {
        runToneAnalysis();
      }, 500);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal menerapkan gaya tone.");
    } finally {
      setIsRestyling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Analisis Sentimen & Tone Restyler AI
                </h2>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                  100% Honesty Rule
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Deteksi kata klise, ukur skor keyakinan & dampak, dan ubah persona CV dengan 1 klik
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isAnalyzing && !analysis && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2 border border-slate-200 rounded-xl bg-slate-50/50">
              <Loader2 className="w-7 h-7 animate-spin text-purple-600" />
              <span className="text-xs font-semibold text-slate-700">
                Gemini sedang memindai gaya bahasa, klise, dan skor sentimen CV Anda...
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {restyleChangelog && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5 animate-in fade-in duration-200">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Berhasil Mengubah Tone CV ke Gaya: {selectedPreset}!</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                {restyleChangelog.map((log, idx) => (
                  <li key={idx}>{log}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis && (
            <>
              {/* Top Sentiment Overview Card */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Sentimen Keseluruhan Dokumen
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          SENTIMENT_BADGES[analysis.overallSentiment]?.bg || "bg-slate-100"
                        } ${
                          SENTIMENT_BADGES[analysis.overallSentiment]?.text || "text-slate-800"
                        } ${
                          SENTIMENT_BADGES[analysis.overallSentiment]?.border || "border-slate-300"
                        }`}
                      >
                        {SENTIMENT_BADGES[analysis.overallSentiment]?.label ||
                          analysis.overallSentiment}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={runToneAnalysis}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition self-start sm:self-auto cursor-pointer"
                  >
                    <Gauge className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                    <span>Perbarui Analisis</span>
                  </button>
                </div>

                {/* Score Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Confidence Score */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">
                        Skor Keyakinan (Confidence)
                      </span>
                      <strong className="text-indigo-600">{analysis.confidenceScore}%</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${analysis.confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Ketegasan kata kerja tanpa kata pasif / keraguan
                    </span>
                  </div>

                  {/* Impact Score */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">
                        Skor Dampak (Impact)
                      </span>
                      <strong className="text-emerald-600">{analysis.impactScore}%</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${analysis.impactScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Kerapatan metrik angka, %, dan formula XYZ
                    </span>
                  </div>

                  {/* Clarity Score */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">
                        Skor Kejelasan (Clarity)
                      </span>
                      <strong className="text-purple-600">{analysis.clarityScore}%</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-600 transition-all duration-500"
                        style={{ width: `${analysis.clarityScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Bebas kata pengisi & klise yang bertele-tele
                    </span>
                  </div>
                </div>

                {/* Summary Feedback */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Evaluasi Professional Summary:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {analysis.summaryFeedback}
                  </p>
                </div>
              </div>

              {/* Cliché & Buzzword Detector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Detektor Kata Klise & Buzzword ({analysis.cliches.length} Ditemukan)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Recruiter menyukai bukti data riil daripada klaim subjektif
                  </span>
                </div>

                {analysis.cliches.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Bagus sekali! Tidak ditemukan kata klise kosong pada CV Anda.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.cliches.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                            &ldquo;{item.phrase}&rdquo;
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.location}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          <strong className="text-slate-800">Kenapa Dihindari:</strong>{" "}
                          {item.whyItHurts}
                        </p>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                          <strong className="text-emerald-700">Saran Pengganti:</strong>{" "}
                          {item.replacement}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tone Style Preset Transformer */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Ubah Persona & Tone CV (1-Click Restyler)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih persona yang ingin Anda tonjolkan. AI akan menulis ulang ringkasan & bullet points dengan 100% kejujuran tanpa memalsukan fakta.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    Object.keys(PRESET_CONFIG) as TonePreset[]
                  ).map((presetKey) => {
                    const preset = PRESET_CONFIG[presetKey];
                    const isSelected = selectedPreset === presetKey;

                    return (
                      <div
                        key={presetKey}
                        onClick={() => setSelectedPreset(presetKey)}
                        className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-purple-50/70 border-purple-500 ring-2 ring-purple-500/20 shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                              {preset.icon}
                            </div>
                            <span className="text-[10px] font-semibold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full">
                              {preset.badge}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mb-1">
                            {preset.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                            {preset.subtitle}
                          </p>
                          <div className="text-[11px] text-slate-600 bg-slate-50/80 p-2 rounded-lg border border-slate-200 leading-relaxed mb-3">
                            {preset.focus}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700">
                          <input
                            type="radio"
                            name="tonePreset"
                            checked={isSelected}
                            onChange={() => setSelectedPreset(presetKey)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span>Pilih Persona Ini</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 1-Click Transform Button */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/50 p-4 rounded-xl border border-purple-200">
                  <div className="text-xs text-purple-950">
                    <span className="font-bold block">
                      Terapkan Persona: &quot;{selectedPreset}&quot;
                    </span>
                    <span className="text-slate-600 text-[11px]">
                      Gemini akan menyelaraskan ringkasan & kata kerja bullet points Anda agar memancarkan persona ini secara profesional.
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isRestyling}
                    onClick={handleApplyPreset}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-2xs transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isRestyling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menerapkan Tone...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Terapkan Tone ke CV Sekarang</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            100% Factual Integrity • Menjaga seluruh angka riil & tech stack
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs transition cursor-pointer"
          >
            Selesai / Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
