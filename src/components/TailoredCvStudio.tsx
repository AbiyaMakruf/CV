"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  FileCheck2,
  Printer,
  Trash2,
  Wand2,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Loader2,
  Copy,
  Check,
  Globe,
  FileText,
  Send,
  RefreshCw,
  FolderKanban,
  X,
  Layout,
  Maximize2,
  Scissors,
  MessageSquareCode,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  MasterCareerProfile,
  ResumeSectionKey,
  SpacingDensity,
  StandardFontFamily,
  TailoredResumeRecord,
  TemplateId,
} from "@/types/resume";
import {
  AtsResumePreview,
  exportResumeToPdf,
} from "@/components/AtsResumePreview";
import { InlineAiHelper } from "@/components/InlineAiHelper";
import { AutoTrimModal } from "@/components/AutoTrimModal";
import { MockInterviewModal } from "@/components/MockInterviewModal";
import { ToneSentimentModal } from "@/components/ToneSentimentModal";
import { DEFAULT_SECTION_ORDER, DEFAULT_VISIBLE_SECTIONS } from "@/lib/db";

interface TailoredCvStudioProps {
  resumes: TailoredResumeRecord[];
  masterProfile: MasterCareerProfile;
  apiKey?: string;
  onSelectOrCreateResume: (resume: TailoredResumeRecord) => void;
  onUpdateResume: (
    id: string,
    patch: Partial<TailoredResumeRecord>
  ) => Promise<void>;
  onDeleteResume: (id: string) => Promise<void>;
  onCreateBlankFromMaster: () => Promise<void>;
  onTrackApplication: (resume: TailoredResumeRecord) => Promise<void>;
}

const SECTION_LABELS: Record<ResumeSectionKey, string> = {
  summary: "Professional Summary",
  experiences: "Work Experience",
  projects: "Key Projects",
  skills: "Technical & Core Skills",
  education: "Education",
  certifications: "Certifications",
  publications: "Publications",
  awards: "Honors & Awards",
  volunteer: "Leadership & Volunteer",
};

export const TailoredCvStudio: React.FC<TailoredCvStudioProps> = ({
  resumes,
  masterProfile,
  apiKey,
  onSelectOrCreateResume,
  onUpdateResume,
  onDeleteResume,
  onCreateBlankFromMaster,
  onTrackApplication,
}) => {
  const [selectedId, setSelectedId] = useState<string>(resumes[0]?.id || "");
  const [selectedCollection, setSelectedCollection] = useState<string>("ALL");
  const [leftTab, setLeftTab] = useState<"editor" | "ats" | "coverLetter">(
    "ats"
  );
  // Responsive mobile tab: toggle between left controls and live A4 preview on small screens
  const [mobileActivePanel, setMobileActivePanel] = useState<"controls" | "preview">("controls");

  // "New Tailored CV from JD" Wizard Modal state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardRole, setWizardRole] = useState("");
  const [wizardCompany, setWizardCompany] = useState("");
  const [wizardCollection, setWizardCollection] = useState("Full-Stack & AI");
  const [wizardUrl, setWizardUrl] = useState("");
  const [wizardJd, setWizardJd] = useState("");
  const [wizardTemplate, setWizardTemplate] = useState<TemplateId>("harvard");
  const [wizardGenCoverLetter, setWizardGenCoverLetter] = useState(true);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [wizardError, setWizardError] = useState<string | null>(null);

  // States for active CV operations
  const [isRecalculatingAts, setIsRecalculatingAts] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);
  const [trackedToast, setTrackedToast] = useState(false);

  // States for 3 high-impact features
  const [livePageCount, setLivePageCount] = useState<number>(1);
  const [isAutoTrimOpen, setIsAutoTrimOpen] = useState(false);
  const [isMockInterviewOpen, setIsMockInterviewOpen] = useState(false);
  const [isToneSentimentOpen, setIsToneSentimentOpen] = useState(false);

  // Accordion state for tailored experience bullets in editor tab
  const [expandedEditorExps, setExpandedEditorExps] = useState<Record<string, boolean>>({});

  const activeResume =
    resumes.find((r) => r.id === selectedId) || resumes[0] || null;

  React.useEffect(() => {
    if (!selectedId && resumes.length > 0) {
      setSelectedId(resumes[0].id);
    }
  }, [resumes, selectedId]);

  const collections = Array.from(
    new Set(["ALL", ...resumes.map((r) => r.collection || "General")])
  );

  const filteredResumes =
    selectedCollection === "ALL"
      ? resumes
      : resumes.filter((r) => (r.collection || "General") === selectedCollection);

  const handleFetchJdFromUrl = async () => {
    if (!wizardUrl.trim()) return;
    setIsFetchingUrl(true);
    setWizardError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "fetch-jd", url: wizardUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch URL");
      setWizardJd(data.jobDescription);
    } catch (err) {
      setWizardError(
        err instanceof Error
          ? err.message
          : "Could not scrape URL directly. Please paste the JD text."
      );
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleRunTailorWizard = async () => {
    if (!wizardJd.trim() && !wizardUrl.trim()) {
      setWizardError("Please paste a Job Description or a Job Posting URL.");
      return;
    }
    setIsTailoring(true);
    setWizardError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          action: "tailor",
          masterProfile,
          targetRole: wizardRole,
          targetCompany: wizardCompany,
          collection: wizardCollection,
          jobUrl: wizardUrl,
          jobDescription: wizardJd,
          templateId: wizardTemplate,
          generateCoverLetter: wizardGenCoverLetter,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to tailor resume");

      onSelectOrCreateResume(data.resume);
      setSelectedId(data.resume.id);
      setLeftTab("ats");
      setIsWizardOpen(false);
      setWizardRole("");
      setWizardCompany("");
      setWizardUrl("");
      setWizardJd("");
    } catch (err) {
      setWizardError(
        err instanceof Error ? err.message : "Failed to tailor CV"
      );
    } finally {
      setIsTailoring(false);
    }
  };

  const handleRecomputeAts = async () => {
    if (!activeResume) return;
    setIsRecalculatingAts(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          action: "ats-score",
          resumeId: activeResume.id,
          cvData: activeResume.cvData,
          jobDescription: activeResume.jobDescription,
        }),
      });
      const data = await res.json();
      if (res.ok && data.atsAnalysis) {
        await onUpdateResume(activeResume.id, {
          atsAnalysis: data.atsAnalysis,
        });
      }
    } finally {
      setIsRecalculatingAts(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!activeResume) return;
    setIsGeneratingCover(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          action: "cover-letter",
          resumeId: activeResume.id,
          cvData: activeResume.cvData,
          jobDescription: activeResume.jobDescription,
          targetCompany: activeResume.targetCompany,
          targetRole: activeResume.targetRole,
        }),
      });
      const data = await res.json();
      if (res.ok && data.coverLetter) {
        await onUpdateResume(activeResume.id, {
          coverLetter: data.coverLetter,
        });
      }
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleAddMissingKeywordToSkills = async (keyword: string) => {
    if (!activeResume) return;
    const nextSkills = [...(activeResume.cvData.skills || [])];
    if (nextSkills.length === 0) {
      nextSkills.push({
        id: `skill-${Date.now()}`,
        category: "Core Technologies & Skills",
        items: [keyword],
      });
    } else {
      const first = nextSkills[0];
      if (
        !first.items.some((i) => i.toLowerCase() === keyword.toLowerCase())
      ) {
        nextSkills[0] = {
          ...first,
          items: [...first.items, keyword],
        };
      }
    }

    const nextCvData = {
      ...activeResume.cvData,
      skills: nextSkills,
    };

    const nextAts = {
      ...activeResume.atsAnalysis,
      matchedKeywords: [...activeResume.atsAnalysis.matchedKeywords, keyword],
      missingCriticalKeywords:
        activeResume.atsAnalysis.missingCriticalKeywords.filter(
          (k) => k !== keyword
        ),
      overallScore: Math.min(99, (activeResume.atsAnalysis.overallScore || 75) + 3),
      keywordMatchScore: Math.min(
        100,
        (activeResume.atsAnalysis.keywordMatchScore || 75) + 5
      ),
    };

    await onUpdateResume(activeResume.id, {
      cvData: nextCvData,
      atsAnalysis: nextAts,
    });
  };

  const handleApplyWeakBulletFix = async (
    originalBullet: string,
    suggestedRewrite: string
  ) => {
    if (!activeResume) return;
    const nextExperiences = activeResume.cvData.experiences.map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b) =>
        b.trim() === originalBullet.trim() ? suggestedRewrite : b
      ),
    }));
    const nextProjects = activeResume.cvData.projects.map((proj) => ({
      ...proj,
      bullets: proj.bullets.map((b) =>
        b.trim() === originalBullet.trim() ? suggestedRewrite : b
      ),
    }));

    const nextWeak = activeResume.atsAnalysis.weakBullets.filter(
      (wb) => wb.originalBullet !== originalBullet
    );

    await onUpdateResume(activeResume.id, {
      cvData: {
        ...activeResume.cvData,
        experiences: nextExperiences,
        projects: nextProjects,
      },
      atsAnalysis: {
        ...activeResume.atsAnalysis,
        weakBullets: nextWeak,
        impactMetricsScore: Math.min(
          100,
          (activeResume.atsAnalysis.impactMetricsScore || 80) + 6
        ),
        overallScore: Math.min(
          99,
          (activeResume.atsAnalysis.overallScore || 80) + 3
        ),
      },
    });
  };

  const moveSection = async (key: ResumeSectionKey, direction: -1 | 1) => {
    if (!activeResume) return;
    const order = [
      ...(activeResume.cvData.sectionOrder || DEFAULT_SECTION_ORDER),
    ];
    const idx = order.indexOf(key);
    if (idx < 0) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= order.length) return;
    const temp = order[idx];
    order[idx] = order[targetIdx];
    order[targetIdx] = temp;

    await onUpdateResume(activeResume.id, {
      cvData: {
        ...activeResume.cvData,
        sectionOrder: order,
      },
    });
  };

  const toggleSectionVisibility = async (key: ResumeSectionKey) => {
    if (!activeResume) return;
    const currentVis = {
      ...DEFAULT_VISIBLE_SECTIONS,
      ...(activeResume.cvData.visibleSections || {}),
    };
    currentVis[key] = !currentVis[key];

    await onUpdateResume(activeResume.id, {
      cvData: {
        ...activeResume.cvData,
        visibleSections: currentVis,
      },
    });
  };

  const scoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-700 border-emerald-300 bg-emerald-50";
    if (score >= 70) return "text-amber-800 border-amber-300 bg-amber-50";
    return "text-rose-700 border-rose-300 bg-rose-50";
  };

  return (
    <div className="space-y-5">
      {/* Top Collection & CV Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
              Collections:
            </span>
            {collections.map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => setSelectedCollection(col)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedCollection === col
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          {/* Active Resume Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {filteredResumes.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedId(r.id)}
                className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  activeResume?.id === r.id
                    ? "bg-indigo-50 border-indigo-400 text-slate-900 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                <span className="truncate max-w-[210px]">{r.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                    (r.atsAnalysis?.overallScore || 0) >= 85
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {r.atsAnalysis?.overallScore || 80}% ATS
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onCreateBlankFromMaster}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Clone Master CV
          </button>

          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            One-Click Tailor from Job Description
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      {activeResume ? (
        <div className="space-y-4">
          {/* Formatting & Export Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Template Selector */}
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  ATS Template:
                </label>
                <select
                  value={activeResume.templateId}
                  onChange={(e) =>
                    onUpdateResume(activeResume.id, {
                      templateId: e.target.value as TemplateId,
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-medium focus:border-indigo-600 focus:outline-none shadow-2xs"
                >
                  <option value="harvard">
                    Harvard / Standard Academic ATS
                  </option>
                  <option value="modern">Modern Minimalist ATS</option>
                  <option value="tech">Tech / Engineering Clean ATS</option>
                </select>
              </div>

              {/* Font Selector */}
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Standard Font:
                </label>
                <select
                  value={activeResume.fontFamily}
                  onChange={(e) =>
                    onUpdateResume(activeResume.id, {
                      fontFamily: e.target.value as StandardFontFamily,
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-medium focus:border-indigo-600 focus:outline-none shadow-2xs"
                >
                  <option value="Calibri">Calibri (Sans-Serif)</option>
                  <option value="Arial">Arial (Sans-Serif)</option>
                  <option value="Helvetica">Helvetica (Sans-Serif)</option>
                  <option value="Garamond">Garamond (Academic Serif)</option>
                  <option value="Times New Roman">
                    Times New Roman (Classic Serif)
                  </option>
                </select>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Density:
                </label>
                <select
                  value={activeResume.fontSize}
                  onChange={(e) =>
                    onUpdateResume(activeResume.id, {
                      fontSize: e.target.value as "small" | "medium" | "large",
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-medium focus:border-indigo-600 focus:outline-none shadow-2xs"
                >
                  <option value="small">Compact (Fits dense 1-page)</option>
                  <option value="medium">Standard (10.2pt)</option>
                  <option value="large">Spacious (11pt)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Feature 1: Pangkas ke 2 Halaman */}
              <button
                type="button"
                onClick={() => setIsAutoTrimOpen(true)}
                title="Pangkas konten atau kompres spasi agar pas tepat 2 halaman"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-2xs transition cursor-pointer ${
                  livePageCount > 2.0
                    ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300 animate-pulse"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <Scissors
                  className={`w-3.5 h-3.5 ${
                    livePageCount > 2.0 ? "text-rose-600" : "text-amber-600"
                  }`}
                />
                <span>Pangkas ke 2 Halaman</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    livePageCount > 2.0
                      ? "bg-rose-200 text-rose-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {livePageCount} hal
                </span>
              </button>

              {/* Feature 2: Latihan Wawancara AI */}
              <button
                type="button"
                onClick={() => setIsMockInterviewOpen(true)}
                title="Latihan wawancara AI berbasis CV dan JD dengan evaluasi STAR"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
              >
                <MessageSquareCode className="w-3.5 h-3.5 text-indigo-600" />
                <span>Latihan Wawancara AI</span>
              </button>

              {/* Feature 3: Analisis Sentimen & Tone */}
              <button
                type="button"
                onClick={() => setIsToneSentimentOpen(true)}
                title="Deteksi kata klise dan ubah tone persona CV (Executive / Technical / Product)"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
                <span>Analisis Sentimen & Tone</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await onTrackApplication(activeResume);
                  setTrackedToast(true);
                  setTimeout(() => setTrackedToast(false), 2500);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition cursor-pointer"
              >
                {trackedToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Added to Tracker!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Log to Tracker</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  exportResumeToPdf(
                    "ats-resume-sheet",
                    `${activeResume.cvData.personalInfo.fullName} - ${activeResume.title}`,
                    activeResume.fontFamily,
                    activeResume.cvData.spacingDensity || "normal"
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Export Selectable ATS PDF
              </button>

              {resumes.length > 1 && (
                <button
                  type="button"
                  onClick={() => onDeleteResume(activeResume.id)}
                  title="Delete this tailored CV"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Screen Switcher (visible on < xl screens) */}
          <div className="xl:hidden flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setMobileActivePanel("controls")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                mobileActivePanel === "controls"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Editor & ATS Analysis</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileActivePanel("preview")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                mobileActivePanel === "preview"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Live ATS A4 Preview</span>
            </button>
          </div>

          {/* Split Screen Grid: Left Panel (ATS/Editor/Cover Letter) | Right Panel (Live A4 Preview) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* LEFT PANEL (5 cols on XL) */}
            <div
              className={`xl:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col max-h-[860px] ${
                mobileActivePanel === "controls" ? "block" : "hidden xl:flex"
              }`}
            >
              {/* Left Panel Mode Switcher */}
              <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1">
                <button
                  type="button"
                  onClick={() => setLeftTab("ats")}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    leftTab === "ats"
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="truncate">ATS ({activeResume.atsAnalysis?.overallScore || 85}%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLeftTab("editor")}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    leftTab === "editor"
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="truncate">CV Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLeftTab("coverLetter")}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    leftTab === "coverLetter"
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="truncate">Cover Letter</span>
                </button>
              </div>

              {/* Left Panel Scrollable Content */}
              <div className="p-5 overflow-y-auto space-y-5 flex-1">
                {leftTab === "ats" && (
                  <div className="space-y-5">
                    {/* Score Card */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-center justify-between gap-4 shadow-2xs">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-extrabold text-xl ${scoreColor(
                            activeResume.atsAnalysis?.overallScore || 80
                          )}`}
                        >
                          <span>
                            {activeResume.atsAnalysis?.overallScore || 80}%
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider">
                            ATS Match
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {activeResume.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Collection: {activeResume.collection} •{" "}
                            {activeResume.targetCompany || "General Target"}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-2 text-[11px]">
                            <span className="text-slate-600">
                              Keywords:{" "}
                              <strong className="text-indigo-600 font-bold">
                                {activeResume.atsAnalysis?.keywordMatchScore ||
                                  85}
                                %
                              </strong>
                            </span>
                            <span className="text-slate-600">
                              Metrics Impact:{" "}
                              <strong className="text-emerald-600 font-bold">
                                {activeResume.atsAnalysis?.impactMetricsScore ||
                                  88}
                                %
                              </strong>
                            </span>
                            <span className="text-slate-600">
                              Parser Format:{" "}
                              <strong className="text-emerald-600 font-bold">
                                {activeResume.atsAnalysis?.atsFormattingScore ||
                                  98}
                                %
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRecomputeAts}
                        disabled={isRecalculatingAts}
                        title="Re-analyze CV against Job Description"
                        className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition cursor-pointer"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${
                            isRecalculatingAts ? "animate-spin" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Target Job Description Box */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Target Job Description (JD)
                        </label>
                        <button
                          type="button"
                          onClick={handleRecomputeAts}
                          disabled={isRecalculatingAts}
                          className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                        >
                          {isRecalculatingAts
                            ? "Analyzing..."
                            : "Update & Re-Score ATS"}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={activeResume.jobDescription}
                        onChange={(e) =>
                          onUpdateResume(activeResume.id, {
                            jobDescription: e.target.value,
                          })
                        }
                        placeholder="Paste target Job Description here to check keyword match rate..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                      />
                    </div>

                    {/* Matched Keywords */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Matched JD Keywords (
                        {activeResume.atsAnalysis?.matchedKeywords?.length || 0}
                        )
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(activeResume.atsAnalysis?.matchedKeywords || [])
                          .length > 0 ? (
                          activeResume.atsAnalysis.matchedKeywords.map(
                            (kw, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700"
                              >
                                ✓ {kw}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-xs text-slate-400">
                            No specific keywords matched yet.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Missing Critical Keywords (1-click Add to Skills) */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Missing Keywords — Click to Add to Skills (
                        {activeResume.atsAnalysis?.missingCriticalKeywords
                          ?.length || 0}
                        )
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(
                          activeResume.atsAnalysis?.missingCriticalKeywords ||
                          []
                        ).length > 0 ? (
                          activeResume.atsAnalysis.missingCriticalKeywords.map(
                            (kw, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() =>
                                  handleAddMissingKeywordToSkills(kw)
                                }
                                title="Click to add this keyword to your CV Skills section"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>{kw}</span>
                              </button>
                            )
                          )
                        ) : (
                          <span className="text-xs text-emerald-700 font-semibold">
                            ✓ All critical JD keywords are covered!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Weak Bullets Detector with 1-Click XYZ Fix */}
                    {activeResume.atsAnalysis?.weakBullets &&
                      activeResume.atsAnalysis.weakBullets.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            Measurable Impact Checker ({
                              activeResume.atsAnalysis.weakBullets.length
                            }{" "}
                            bullet upgrades available)
                          </h4>
                          {activeResume.atsAnalysis.weakBullets.map(
                            (wb, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs"
                              >
                                <div className="text-[11px] font-bold text-amber-800">
                                  {wb.section} — {wb.reason}
                                </div>
                                <div className="text-xs text-slate-500 line-through">
                                  &ldquo;{wb.originalBullet}&rdquo;
                                </div>
                                <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg leading-relaxed">
                                  <strong className="text-emerald-900">XYZ Suggestion:</strong>{" "}
                                  {wb.suggestedRewrite}
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApplyWeakBulletFix(
                                      wb.originalBullet,
                                      wb.suggestedRewrite
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                                >
                                  <Check className="w-3 h-3" /> Apply XYZ Rewrite
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {/* Red Flags & Actionable Tips */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        ATS Diagnostics & Recommendations
                      </h4>
                      {activeResume.atsAnalysis?.redFlags?.map((rf, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium"
                        >
                          ⚠️ {rf}
                        </div>
                      ))}
                      {(activeResume.atsAnalysis?.actionableTips || []).map(
                        (tip, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed"
                          >
                            💡 {tip}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {leftTab === "editor" && (
                  <div className="space-y-5">
                    {/* Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          CV Version Title
                        </label>
                        <input
                          type="text"
                          value={activeResume.title}
                          onChange={(e) =>
                            onUpdateResume(activeResume.id, {
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Collection Category
                        </label>
                        <input
                          type="text"
                          value={activeResume.collection}
                          onChange={(e) =>
                            onUpdateResume(activeResume.id, {
                              collection: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Section Ordering & Visibility Control */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Section Order & Visibility
                      </h4>
                      <div className="space-y-1">
                        {(
                          activeResume.cvData.sectionOrder ||
                          DEFAULT_SECTION_ORDER
                        ).map((secKey, idx) => {
                          const isVis =
                            activeResume.cvData.visibleSections?.[secKey] ??
                            true;
                          return (
                            <div
                              key={secKey}
                              className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                            >
                              <span
                                className={
                                  isVis
                                    ? "text-slate-800 font-semibold"
                                    : "text-slate-400 line-through"
                                }
                              >
                                {SECTION_LABELS[secKey]}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveSection(secKey, -1)}
                                  disabled={idx === 0}
                                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveSection(secKey, 1)}
                                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleSectionVisibility(secKey)
                                  }
                                  className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                                >
                                  {isVis ? (
                                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tailored Headline & Summary */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tailored Headline
                        </label>
                        <input
                          type="text"
                          value={activeResume.cvData.personalInfo.headline}
                          onChange={(e) =>
                            onUpdateResume(activeResume.id, {
                              cvData: {
                                ...activeResume.cvData,
                                personalInfo: {
                                  ...activeResume.cvData.personalInfo,
                                  headline: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tailored Professional Summary
                        </label>
                        <textarea
                          rows={4}
                          value={activeResume.cvData.personalInfo.summary}
                          onChange={(e) =>
                            onUpdateResume(activeResume.id, {
                              cvData: {
                                ...activeResume.cvData,
                                personalInfo: {
                                  ...activeResume.cvData.personalInfo,
                                  summary: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                        <InlineAiHelper
                          currentText={activeResume.cvData.personalInfo.summary}
                          contextRole={activeResume.targetRole}
                          apiKey={apiKey}
                          compact
                          onApply={(newText) =>
                            onUpdateResume(activeResume.id, {
                              cvData: {
                                ...activeResume.cvData,
                                personalInfo: {
                                  ...activeResume.cvData.personalInfo,
                                  summary: newText,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Tailored Experience Bullets */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Tailored Experience Bullets
                        </h4>
                        {activeResume.cvData.experiences.length > 0 && (
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            <button
                              type="button"
                              onClick={() => {
                                const next: Record<string, boolean> = {};
                                activeResume.cvData.experiences.forEach((e) => {
                                  next[e.id] = true;
                                });
                                setExpandedEditorExps(next);
                              }}
                              className="hover:text-indigo-600 transition cursor-pointer"
                            >
                              Expand All
                            </button>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() => {
                                const next: Record<string, boolean> = {};
                                activeResume.cvData.experiences.forEach((e) => {
                                  next[e.id] = false;
                                });
                                setExpandedEditorExps(next);
                              }}
                              className="hover:text-indigo-600 transition cursor-pointer"
                            >
                              Collapse All
                            </button>
                          </div>
                        )}
                      </div>

                      {activeResume.cvData.experiences.map((exp, expIdx) => {
                        const isExpanded = expandedEditorExps[exp.id] ?? (expIdx === 0);
                        return (
                          <div
                            key={exp.id}
                            className={`rounded-xl transition-all duration-200 shadow-2xs overflow-hidden ${
                              isExpanded
                                ? "border border-indigo-200 bg-white ring-1 ring-indigo-50/50"
                                : "border border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedEditorExps((prev) => ({
                                  ...prev,
                                  [exp.id]: !isExpanded,
                                }))
                              }
                              aria-expanded={isExpanded}
                              className={`w-full text-left p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                                isExpanded
                                  ? "bg-indigo-50/40 border-b border-indigo-100"
                                  : "hover:bg-slate-50/80"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-900">
                                  <span className="truncate">{exp.role || "Role"}</span>
                                  <span className="text-slate-400 font-normal">@</span>
                                  <span className="text-slate-700 truncate">{exp.company || "Company"}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                                  {(exp.startDate || exp.endDate) && (
                                    <span>
                                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                                    </span>
                                  )}
                                  {(exp.startDate || exp.endDate) && <span className="text-slate-300">•</span>}
                                  <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                                    {exp.bullets.length} bullet{exp.bullets.length === 1 ? "" : "s"}
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`p-1.5 rounded-lg border transition-transform duration-200 shrink-0 ${
                                  isExpanded
                                    ? "bg-indigo-600 border-indigo-600 text-white rotate-180"
                                    : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="p-3.5 space-y-2 bg-slate-50/40 animate-in fade-in-50 duration-150">
                                {exp.bullets.map((b, bIdx) => (
                                  <div key={bIdx} className="space-y-1">
                                    <textarea
                                      rows={2}
                                      value={b}
                                      onChange={(e) => {
                                        const nextExps = [
                                          ...activeResume.cvData.experiences,
                                        ];
                                        const nextBullets = [...exp.bullets];
                                        nextBullets[bIdx] = e.target.value;
                                        nextExps[expIdx] = {
                                          ...exp,
                                          bullets: nextBullets,
                                        };
                                        onUpdateResume(activeResume.id, {
                                          cvData: {
                                            ...activeResume.cvData,
                                            experiences: nextExps,
                                          },
                                        });
                                      }}
                                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                                    />
                                    <InlineAiHelper
                                      currentText={b}
                                      contextRole={
                                        activeResume.targetRole || exp.role
                                      }
                                      apiKey={apiKey}
                                      compact
                                      onApply={(improved) => {
                                        const nextExps = [
                                          ...activeResume.cvData.experiences,
                                        ];
                                        const nextBullets = [...exp.bullets];
                                        nextBullets[bIdx] = improved;
                                        nextExps[expIdx] = {
                                          ...exp,
                                          bullets: nextBullets,
                                        };
                                        onUpdateResume(activeResume.id, {
                                          cvData: {
                                            ...activeResume.cvData,
                                            experiences: nextExps,
                                          },
                                        });
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {leftTab === "coverLetter" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          AI Tailored Cover Letter
                        </h3>
                        <p className="text-xs text-slate-500">
                          Matched to {activeResume.targetCompany || "Company"} •{" "}
                          {activeResume.targetRole || "Target Role"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateCoverLetter}
                        disabled={isGeneratingCover}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
                      >
                        {isGeneratingCover ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {activeResume.coverLetter
                            ? "Regenerate with Gemini"
                            : "Generate Cover Letter"}
                        </span>
                      </button>
                    </div>

                    <textarea
                      rows={16}
                      value={activeResume.coverLetter || ""}
                      onChange={(e) =>
                        onUpdateResume(activeResume.id, {
                          coverLetter: e.target.value,
                        })
                      }
                      placeholder="Click 'Generate Cover Letter' to auto-draft a tailored cover letter from your active CV and target Job Description..."
                      className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 leading-relaxed focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            activeResume.coverLetter || ""
                          );
                          setCopiedCover(true);
                          setTimeout(() => setCopiedCover(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs cursor-pointer"
                      >
                        {copiedCover ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Cover Letter</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL: Live Real-Time A4 Single-Column ATS Preview (7 cols on XL) */}
            <div
              className={`xl:col-span-7 bg-slate-100/70 border border-slate-200 rounded-2xl p-4 md:p-6 overflow-x-auto flex flex-col items-center shadow-xs ${
                mobileActivePanel === "preview" ? "block" : "hidden xl:flex"
              }`}
            >
              <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">
                    Live ATS Print Preview
                  </span>
                  {/* Live Page Count Tracker Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition ${
                      livePageCount > 2.0
                        ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse"
                        : "bg-emerald-50 text-emerald-700 border-emerald-300"
                    }`}
                  >
                    {livePageCount > 2.0 ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>{livePageCount} Halaman (Tumpah ke Hal 3!)</span>
                      </>
                    ) : (
                      <>
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{livePageCount} Halaman (Aman 2 Hal ATS ✓)</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {livePageCount > 2.0 && (
                    <button
                      type="button"
                      onClick={() => setIsAutoTrimOpen(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Pangkas ke 2 Halaman</span>
                    </button>
                  )}
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Standard Fonts • ✓ 100% ATS Parseable
                  </span>
                </div>
              </div>

              <div className="origin-top scale-[0.72] sm:scale-[0.85] md:scale-[0.95] xl:scale-100 transition-transform shadow-md rounded border border-slate-200">
                <AtsResumePreview
                  data={activeResume.cvData}
                  templateId={activeResume.templateId}
                  fontFamily={activeResume.fontFamily}
                  fontSize={activeResume.fontSize}
                  pageLimit={activeResume.pageLimit}
                  spacingDensity={activeResume.cvData.spacingDensity || "normal"}
                  onPageCountChange={(count) => setLivePageCount(count)}
                  sheetId="ats-resume-sheet"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* One-Click Tailoring from Job Description Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    One-Click CV Tailoring & Vacancy Matcher
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gemini analyzes the JD, selects relevant Master Profile
                    items, rewrites bullets in XYZ format, and translates ID → EN
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Role (Optional)
                  </label>
                  <input
                    type="text"
                    value={wizardRole}
                    onChange={(e) => setWizardRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={wizardCompany}
                    onChange={(e) => setWizardCompany(e.target.value)}
                    placeholder="e.g. GoTo / Traveloka / Stripe"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CV Collection Tag
                  </label>
                  <input
                    type="text"
                    value={wizardCollection}
                    onChange={(e) => setWizardCollection(e.target.value)}
                    placeholder="e.g. Frontend Engineer, ML Researcher"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Job URL Fetcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Posting URL (Optional — Auto-extracts JD text)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={wizardUrl}
                    onChange={(e) => setWizardUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleFetchJdFromUrl}
                    disabled={!wizardUrl.trim() || isFetchingUrl}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs disabled:opacity-40 cursor-pointer"
                  >
                    {isFetchingUrl ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    Fetch URL
                  </button>
                </div>
              </div>

              {/* Raw Job Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Description (Paste raw JD in English or Bahasa Indonesia)
                </label>
                <textarea
                  rows={7}
                  value={wizardJd}
                  onChange={(e) => setWizardJd(e.target.value)}
                  placeholder="Paste the full Job Description requirements, responsibilities, and qualifications here..."
                  className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ATS Template Style
                  </label>
                  <select
                    value={wizardTemplate}
                    onChange={(e) =>
                      setWizardTemplate(e.target.value as TemplateId)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  >
                    <option value="harvard">
                      Harvard / Standard Academic ATS
                    </option>
                    <option value="modern">Modern Minimalist ATS</option>
                    <option value="tech">Tech / Engineering Clean ATS</option>
                  </select>
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wizardGenCoverLetter}
                    onChange={(e) => setWizardGenCoverLetter(e.target.checked)}
                    className="accent-indigo-600 rounded"
                  />
                  Also auto-draft a matching tailored Cover Letter
                </label>
              </div>

              {wizardError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {wizardError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isTailoring}
                  onClick={handleRunTailorWizard}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
                >
                  {isTailoring ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Tailoring CV & Scoring ATS with Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Tailored ATS Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Trim to 2 Pages Modal */}
      {isAutoTrimOpen && activeResume && (
        <AutoTrimModal
          isOpen={isAutoTrimOpen}
          onClose={() => setIsAutoTrimOpen(false)}
          activeResume={activeResume}
          estimatedPages={livePageCount}
          apiKey={apiKey}
          onApplyTrim={async (updatedCvData, appliedDensity) => {
            await onUpdateResume(activeResume.id, {
              cvData: {
                ...updatedCvData,
                spacingDensity:
                  appliedDensity || updatedCvData.spacingDensity || "compact",
              },
              pageLimit: 2,
            });
          }}
          onApplyDensityOnly={async (density: SpacingDensity) => {
            await onUpdateResume(activeResume.id, {
              cvData: {
                ...activeResume.cvData,
                spacingDensity: density,
              },
              pageLimit: 2,
            });
          }}
        />
      )}

      {/* AI Mock Interview Modal */}
      {isMockInterviewOpen && activeResume && (
        <MockInterviewModal
          isOpen={isMockInterviewOpen}
          onClose={() => setIsMockInterviewOpen(false)}
          activeResume={activeResume}
          apiKey={apiKey}
        />
      )}

      {/* AI Tone & Sentiment Analyzer Modal */}
      {isToneSentimentOpen && activeResume && (
        <ToneSentimentModal
          isOpen={isToneSentimentOpen}
          onClose={() => setIsToneSentimentOpen(false)}
          activeResume={activeResume}
          apiKey={apiKey}
          onApplyRestyle={async (updatedCvData) => {
            await onUpdateResume(activeResume.id, {
              cvData: updatedCvData,
            });
          }}
        />
      )}
    </div>
  );
};
