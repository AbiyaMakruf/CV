"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareCode,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  Copy,
  Check,
  Send,
  RefreshCw,
  Award,
  ChevronRight,
  Lightbulb,
  Building2,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import {
  InterviewEvaluation,
  InterviewQuestion,
  InterviewQuestionCategory,
  TailoredResumeRecord,
} from "@/types/resume";

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeResume: TailoredResumeRecord;
  apiKey?: string;
}

const CATEGORY_COLORS: Record<InterviewQuestionCategory, { bg: string; text: string; border: string }> = {
  Technical: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "Behavioral STAR": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  Situational: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
};

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  activeResume,
  apiKey,
}) => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [candidateAnswer, setCandidateAnswer] = useState<string>("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [copiedIdeal, setCopiedIdeal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cache evaluations per question id
  const [evaluationsMap, setEvaluationsMap] = useState<
    Record<string, { answer: string; evaluation: InterviewEvaluation }>
  >({});

  // Fetch initial questions on modal open if empty
  useEffect(() => {
    if (isOpen && questions.length === 0) {
      loadQuestions();
    }
  }, [isOpen]);

  const loadQuestions = async () => {
    try {
      setIsLoadingQuestions(true);
      setErrorMessage(null);
      setEvaluation(null);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          action: "interview-questions",
          cvData: activeResume.cvData,
          jobDescription: activeResume.jobDescription,
          targetRole: activeResume.targetRole,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: Gagal memuat pertanyaan wawancara.`);
      }

      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        setSelectedQuestionIndex(0);
        setCandidateAnswer("");
        setEvaluation(null);
        setEvaluationsMap({});
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal memuat pertanyaan wawancara.");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleSelectQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    const q = questions[index];
    if (q && evaluationsMap[q.id]) {
      setCandidateAnswer(evaluationsMap[q.id].answer);
      setEvaluation(evaluationsMap[q.id].evaluation);
    } else {
      setCandidateAnswer("");
      setEvaluation(null);
    }
    setErrorMessage(null);
  };

  const handleEvaluateAnswer = async () => {
    const activeQuestion = questions[selectedQuestionIndex];
    if (!activeQuestion) return;

    if (!candidateAnswer.trim() || candidateAnswer.trim().split(/\s+/).length < 8) {
      setErrorMessage("Silakan ketik jawaban yang lebih lengkap (minimal 10-15 kata) untuk dinilai.");
      return;
    }

    try {
      setIsEvaluating(true);
      setErrorMessage(null);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          action: "evaluate-answer",
          question: activeQuestion.question,
          questionCategory: activeQuestion.category,
          candidateAnswer: candidateAnswer.trim(),
          cvData: activeResume.cvData,
          jobDescription: activeResume.jobDescription,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Error ${res.status}: Gagal mengevaluasi jawaban.`);
      }

      const data = await res.json();
      const evalResult: InterviewEvaluation = data.evaluation;
      setEvaluation(evalResult);

      setEvaluationsMap((prev) => ({
        ...prev,
        [activeQuestion.id]: {
          answer: candidateAnswer.trim(),
          evaluation: evalResult,
        },
      }));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Evaluasi AI gagal dijalankan.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdeal(true);
    setTimeout(() => setCopiedIdeal(false), 2000);
  };

  if (!isOpen) return null;

  const currentQ = questions[selectedQuestionIndex];
  const wordCount = candidateAnswer.trim() ? candidateAnswer.trim().split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Simulasi Latihan Wawancara AI (Mock Interview)
                </h2>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Metode STAR
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Briefcase className="w-3 h-3 text-slate-400" />
                  {activeResume.targetRole || "Target Role"}
                </span>
                {activeResume.targetCompany && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {activeResume.targetCompany}
                    </span>
                  </>
                )}
              </div>
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Question Selector Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Daftar Pertanyaan Wawancara ({questions.length})
              </span>
              <button
                type="button"
                disabled={isLoadingQuestions}
                onClick={loadQuestions}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoadingQuestions ? "animate-spin" : ""}`}
                />
                <span>Generate Ulang Pertanyaan</span>
              </button>
            </div>

            {isLoadingQuestions ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-500 gap-2 border border-slate-200 rounded-xl bg-slate-50/50">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-xs font-medium">
                  Gemini sedang menyusun 5 pertanyaan realistis berdasarkan CV & JD Anda...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isSelected = selectedQuestionIndex === idx;
                  const hasDoneEval = Boolean(evaluationsMap[q.id]);
                  const catStyle =
                    CATEGORY_COLORS[q.category] || CATEGORY_COLORS.Technical;

                  return (
                    <button
                      key={q.id || idx}
                      type="button"
                      onClick={() => handleSelectQuestion(idx)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-indigo-50/70 border-indigo-400 ring-1 ring-indigo-400 shadow-2xs"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold">
                          Q{idx + 1}
                        </span>
                        {hasDoneEval && (
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            {evaluationsMap[q.id].evaluation.score}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border truncate ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                      >
                        {q.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {currentQ && !isLoadingQuestions && (
            <div className="space-y-4">
              {/* Active Question Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                      CATEGORY_COLORS[currentQ.category]?.bg || "bg-indigo-50"
                    } ${CATEGORY_COLORS[currentQ.category]?.text || "text-indigo-700"} ${
                      CATEGORY_COLORS[currentQ.category]?.border || "border-indigo-200"
                    }`}
                  >
                    Pertanyaan {selectedQuestionIndex + 1}: {currentQ.category}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  &ldquo;{currentQ.question}&rdquo;
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Alasan Recruiter Menanyakan Ini:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {currentQ.contextOrRationale}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>Tips Menjawab (Rumus STAR):</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {currentQ.tips}
                    </p>
                  </div>
                </div>
              </div>

              {/* Candidate Answer Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">
                    Tuliskan Jawaban Anda:
                  </label>
                  <span className="text-slate-400 font-medium">
                    {wordCount} kata {wordCount >= 30 ? "✓" : "(minimal ~30 kata untuk hasil optimal)"}
                  </span>
                </div>

                <textarea
                  rows={5}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Ceritakan dengan metode STAR: Situasi yang dihadapi, Tugas Anda, Aksi/teknologi yang Anda gunakan, dan Hasil terukur (angka/%) yang dicapai..."
                  className="w-full p-3.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition shadow-2xs leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    💡 Tip: Jangan lupa sebutkan angka konkrit (misal: efisiensi naik 40%, latensi turun ke 120ms).
                  </span>
                  <button
                    type="button"
                    disabled={isEvaluating || !candidateAnswer.trim()}
                    onClick={handleEvaluateAnswer}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition cursor-pointer disabled:opacity-50"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menganalisis STAR...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Nilai Jawaban Saya</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Deep Evaluation Results */}
              {evaluation && (
                <div className="space-y-4 pt-2 border-t border-slate-200 animate-in fade-in duration-200">
                  {/* Score & Verdict Banner */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-lg border ${
                          evaluation.score >= 80
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : evaluation.score >= 65
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : "bg-rose-50 text-rose-700 border-rose-300"
                        }`}
                      >
                        <span>{evaluation.score}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">
                          / 100
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Hasil Penilaian Wawancara AI
                        </div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">
                          {evaluation.overallVerdict}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                          evaluation.score >= 80
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : evaluation.score >= 65
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        {evaluation.score >= 80
                          ? "Siap Wawancara (Strong Hire)"
                          : evaluation.score >= 65
                          ? "Cukup Baik (Needs Refinement)"
                          : "Perlu Latihan Tambahan"}
                      </span>
                    </div>
                  </div>

                  {/* STAR 4-Grid Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Analisis Metode STAR (Situation • Task • Action • Result)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Situation */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            S — Situation
                          </span>
                          {evaluation.starAnalysis.situation.present ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              ✓ Ada
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                              Kurang
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {evaluation.starAnalysis.situation.feedback}
                        </p>
                      </div>

                      {/* Task */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            T — Task
                          </span>
                          {evaluation.starAnalysis.task.present ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              ✓ Ada
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                              Kurang
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {evaluation.starAnalysis.task.feedback}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            A — Action
                          </span>
                          {evaluation.starAnalysis.action.present ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              ✓ Ada
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                              Kurang
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {evaluation.starAnalysis.action.feedback}
                        </p>
                      </div>

                      {/* Result */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            R — Result
                          </span>
                          {evaluation.starAnalysis.result.hasMetrics ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              ✓ Metrik OK
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                              Tanpa Angka
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {evaluation.starAnalysis.result.feedback}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                      <h5 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Kelebihan Jawaban:</span>
                      </h5>
                      <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
                        {evaluation.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
                      <h5 className="font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Area yang Perlu Ditingkatkan:</span>
                      </h5>
                      <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
                        {evaluation.weaknesses.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Suggested Ideal Answer */}
                  <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Contoh Jawaban Ideal (Standar FAANG / Top Tech):</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(evaluation.suggestedIdealAnswer)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 transition cursor-pointer shadow-2xs"
                      >
                        {copiedIdeal ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Jawaban</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-indigo-100 font-sans">
                      {evaluation.suggestedIdealAnswer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {Object.keys(evaluationsMap).length} dari {questions.length} pertanyaan telah dinilai
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs transition cursor-pointer"
          >
            Tutup Simulasi
          </button>
        </div>
      </div>
    </div>
  );
};
