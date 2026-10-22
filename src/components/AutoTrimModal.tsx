"use client";

import React, { useState } from "react";
import {
  Scissors,
  Sparkles,
  Maximize2,
  FileCheck2,
  AlertTriangle,
  X,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  ResumeDocumentData,
  SpacingDensity,
  TailoredResumeRecord,
  TrimPagesResult,
} from "@/types/resume";

interface AutoTrimModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeResume: TailoredResumeRecord;
  estimatedPages: number;
  apiKey?: string;
  onApplyTrim: (
    updatedCvData: ResumeDocumentData,
    appliedDensity?: SpacingDensity
  ) => Promise<void>;
  onApplyDensityOnly: (density: SpacingDensity) => Promise<void>;
}

export const AutoTrimModal: React.FC<AutoTrimModalProps> = ({
  isOpen,
  onClose,
  activeResume,
  estimatedPages,
  apiKey,
  onApplyTrim,
  onApplyDensityOnly,
}) => {
  const [loadingMode, setLoadingMode] = useState<"spacing" | "ai" | null>(null);
  const [trimResult, setTrimResult] = useState<TrimPagesResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isOverTwoPages = estimatedPages > 2.0;

  const handleInstantSpacingCompression = async (density: SpacingDensity = "ultra-compact") => {
    try {
      setLoadingMode("spacing");
      setErrorMessage(null);
      await onApplyDensityOnly(density);
      setSuccessMessage(
        density === "ultra-compact"
          ? "Berhasil menerapkan kepadatan Ultra-Compact! Margin & padding dokumen telah dikompres agar muat 2 halaman."
          : "Berhasil menerapkan kepadatan Compact."
      );
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal mengompres spasi.");
    } finally {
      setLoadingMode(null);
    }
  };

  const handleAiSmartTrim = async () => {
    try {
      setLoadingMode("ai");
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          action: "trim-pages",
          cvData: activeResume.cvData,
          resumeId: activeResume.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: Gagal memangkas CV.`);
      }

      const data: TrimPagesResult = await res.json();
      setTrimResult(data);
      await onApplyTrim(data.trimmedCvData, "compact");
      setSuccessMessage(
        `Sukses! AI telah meringkas ${data.bulletsTrimmedCount} bullet point bertele-tele ke formula XYZ tanpa menghilangkan angka & metrik.`
      );
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "AI trim gagal diproses.");
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Pangkas Otomatis ke 2 Halaman
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ATS Standard
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Pangkas CV yang tumpah ke halaman 3 agar recruiter tidak mengabaikan resume Anda
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
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Gauge Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isOverTwoPages
                ? "bg-rose-50/70 border-rose-200 text-rose-950"
                : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isOverTwoPages
                    ? "bg-rose-100 text-rose-700 border border-rose-300"
                    : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                }`}
              >
                {isOverTwoPages ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <FileCheck2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Status Panjang Dokumen Saat Ini
                </div>
                <div className="text-sm font-semibold flex items-center gap-2">
                  <span>Estimasi: <strong>{estimatedPages} Halaman</strong></span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  <span>Target Maksimal: <strong>2.0 Halaman</strong></span>
                </div>
                <div className="text-xs mt-0.5 opacity-90">
                  {isOverTwoPages
                    ? "⚠️ CV tumpah ke halaman 3! Recruiter hanya screening rata-rata 6 detik dan sering mendiskualifikasi CV > 2 halaman."
                    : "✓ CV Anda sudah berada dalam rentang aman 2 halaman. Anda bisa memperketatnya jika ingin lebih padat."}
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{successMessage}</p>
                {trimResult && trimResult.summaryOfChanges && (
                  <ul className="mt-1.5 list-disc pl-4 space-y-0.5 text-slate-700">
                    {trimResult.summaryOfChanges.map((change, idx) => (
                      <li key={idx}>{change}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Solution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: Instant Typography & Spacing Compression */}
            <div className="border border-slate-200 hover:border-indigo-300 rounded-xl p-4 bg-white flex flex-col justify-between transition shadow-2xs hover:shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                    Instan (0 Detik)
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  1. Kompresi Spasi Instan
                </h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Mengompres padding dokumen (13mm → 7mm), line-height, dan margin vertikal antar-bagian tanpa mengubah atau menghapus 1 kata pun dari teks asli Anda.
                </p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1 mb-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% kata asli tetap utuh</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Efektif untuk resume ~2.2 - 2.8 halaman</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={loadingMode !== null}
                onClick={() => handleInstantSpacingCompression("ultra-compact")}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-300 shadow-2xs hover:shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingMode === "spacing" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menerapkan...</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Terapkan Spasi Ultra-Compact</span>
                  </>
                )}
              </button>
            </div>

            {/* Option 2: AI Smart Content Condenser */}
            <div className="border border-slate-200 hover:border-emerald-300 rounded-xl p-4 bg-white flex flex-col justify-between transition shadow-2xs hover:shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    AI Gemini + XYZ
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  2. Pangkas Cerdas AI (Smart Condenser)
                </h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Gemini meringkas kalimat panjang menjadi 1-baris formula XYZ Google (&quot;Accomplished X as measured by Y, by doing Z&quot;), menghapus filler words tanpa menghilangkan metrik.
                </p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1 mb-4">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Preserve 100% angka, %, $, & tech stack</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Membatasi top 3-4 bullet per pengalaman</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={loadingMode !== null}
                onClick={handleAiSmartTrim}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingMode === "ai" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini Merampingkan Konten...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Pangkas Konten dengan AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Format Standar Harvard & Modern ATS Single-Column
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
