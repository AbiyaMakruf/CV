"use client";

import React, { useState } from "react";
import {
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  Award,
  BookOpen,
  HeartHandshake,
  Plus,
  Trash2,
  Save,
  Upload,
  Check,
  Loader2,
  Languages,
  ChevronDown,
} from "lucide-react";
import { MasterCareerProfile } from "@/types/resume";
import { InlineAiHelper } from "@/components/InlineAiHelper";

interface MasterProfileEditorProps {
  profile: MasterCareerProfile;
  apiKey?: string;
  onSave: (updated: MasterCareerProfile) => Promise<void>;
  onOpenImportModal: () => void;
}

type MasterTab =
  | "personal"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "extras";

export const MasterProfileEditor: React.FC<MasterProfileEditorProps> = ({
  profile,
  apiKey,
  onSave,
  onOpenImportModal,
}) => {
  const [draft, setDraft] = useState<MasterCareerProfile>(profile);
  const [activeTab, setActiveTab] = useState<MasterTab>("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Accordion expansion states
  const [expandedExperiences, setExpandedExperiences] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (profile.experiences && profile.experiences.length > 0) {
      initial[profile.experiences[0].id] = true;
    }
    return initial;
  });

  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (profile.projects && profile.projects.length > 0) {
      initial[profile.projects[0].id] = true;
    }
    return initial;
  });

  // Sync when external profile updates (e.g. after Legacy CV import)
  React.useEffect(() => {
    setDraft(profile);
    setExpandedExperiences((prev) => {
      if (Object.keys(prev).length === 0 && profile.experiences && profile.experiences.length > 0) {
        return { [profile.experiences[0].id]: true };
      }
      return prev;
    });
    setExpandedProjects((prev) => {
      if (Object.keys(prev).length === 0 && profile.projects && profile.projects.length > 0) {
        return { [profile.projects[0].id]: true };
      }
      return prev;
    });
  }, [profile]);

  const toggleExperience = (id: string) => {
    setExpandedExperiences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAllExperiences = () => {
    const all: Record<string, boolean> = {};
    draft.experiences.forEach((exp) => {
      all[exp.id] = true;
    });
    setExpandedExperiences(all);
  };

  const collapseAllExperiences = () => {
    const all: Record<string, boolean> = {};
    draft.experiences.forEach((exp) => {
      all[exp.id] = false;
    });
    setExpandedExperiences(all);
  };

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAllProjects = () => {
    const all: Record<string, boolean> = {};
    draft.projects.forEach((proj) => {
      all[proj.id] = true;
    });
    setExpandedProjects(all);
  };

  const collapseAllProjects = () => {
    const all: Record<string, boolean> = {};
    draft.projects.forEach((proj) => {
      all[proj.id] = false;
    });
    setExpandedProjects(all);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(draft);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: MasterTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "personal", label: "Personal & Summary", icon: <User className="w-4 h-4" /> },
    {
      id: "experience",
      label: "Work Experience",
      icon: <Briefcase className="w-4 h-4" />,
      count: draft.experiences.length,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderGit2 className="w-4 h-4" />,
      count: draft.projects.length,
    },
    {
      id: "education",
      label: "Education & Certs",
      icon: <GraduationCap className="w-4 h-4" />,
      count: draft.education.length + draft.certifications.length,
    },
    {
      id: "skills",
      label: "Skills & Tech",
      icon: <Wrench className="w-4 h-4" />,
      count: draft.skills.length,
    },
    {
      id: "extras",
      label: "Publications, Awards & Volunteer",
      icon: <Award className="w-4 h-4" />,
      count:
        draft.publications.length +
        draft.awards.length +
        draft.volunteer.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Languages className="w-3.5 h-3.5 text-indigo-600" />
            <span>Single Source of Truth • Supports Bahasa Indonesia & English Input</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Master Career Repository
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Store your complete career history here. Write in Indonesian or
            English — use inline Gemini AI buttons to translate & optimize into
            the XYZ Formula.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenImportModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition cursor-pointer"
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            Import Legacy CV (PDF/DOCX/Img)
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : savedToast ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{savedToast ? "Saved to Master DB!" : "Save Master Profile"}</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === t.id
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === t.id
                    ? "bg-indigo-700 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "personal" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Personal Contact & Executive Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={draft.personalInfo.fullName}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      fullName: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Professional Headline / Target Title
              </label>
              <input
                type="text"
                value={draft.personalInfo.headline}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      headline: e.target.value,
                    },
                  })
                }
                placeholder="e.g. Senior Full-Stack Engineer & AI Architect"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={draft.personalInfo.email}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      email: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone / WhatsApp
              </label>
              <input
                type="text"
                value={draft.personalInfo.phone}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      phone: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location (City, Country)
              </label>
              <input
                type="text"
                value={draft.personalInfo.location}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      location: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={draft.personalInfo.linkedin}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      linkedin: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GitHub URL
              </label>
              <input
                type="text"
                value={draft.personalInfo.github}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      github: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portfolio / Personal Website
              </label>
              <input
                type="text"
                value={draft.personalInfo.portfolio}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      portfolio: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Master Professional Summary (Supports Bahasa Indonesia or English)
            </label>
            <textarea
              rows={4}
              value={draft.personalInfo.summary}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  personalInfo: {
                    ...draft.personalInfo,
                    summary: e.target.value,
                  },
                })
              }
              placeholder="Write your career summary in Indonesian or English..."
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
            />
            <InlineAiHelper
              currentText={draft.personalInfo.summary}
              contextRole={draft.personalInfo.headline}
              apiKey={apiKey}
              onApply={(newText) =>
                setDraft({
                  ...draft,
                  personalInfo: { ...draft.personalInfo, summary: newText },
                })
              }
            />
          </div>
        </div>
      )}

      {activeTab === "experience" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Work Experience ({draft.experiences.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any role to expand or collapse details.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {draft.experiences.length > 0 && (
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={expandAllExperiences}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                  >
                    Expand All
                  </button>
                  <span className="h-3.5 w-px bg-slate-200 my-auto" />
                  <button
                    type="button"
                    onClick={collapseAllExperiences}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const newExpId = `exp-${Date.now()}`;
                  setDraft({
                    ...draft,
                    experiences: [
                      {
                        id: newExpId,
                        company: "New Company",
                        role: "Software Engineer",
                        employmentType: "Full-time",
                        location: "Jakarta, Indonesia",
                        startDate: "Jan 2025",
                        endDate: "Present",
                        current: true,
                        bullets: [
                          "Membangun sistem backend mikroservis yang meningkatkan kecepatan pemrosesan data sebesar 40%.",
                        ],
                        technologies: ["TypeScript", "Node.js"],
                      },
                      ...draft.experiences,
                    ],
                  });
                  setExpandedExperiences((prev) => ({ ...prev, [newExpId]: true }));
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Work Experience
              </button>
            </div>
          </div>

          {draft.experiences.map((exp, expIdx) => {
            const isExpanded = !!expandedExperiences[exp.id];
            const bulletCount = exp.bullets.filter((b) => b && b.trim().length > 0).length;

            return (
              <div
                key={exp.id}
                className={`rounded-2xl transition-all duration-200 shadow-2xs overflow-hidden ${
                  isExpanded
                    ? "border border-indigo-200 bg-white ring-1 ring-indigo-50/50"
                    : "border border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {/* Clickable Accordion Header Bar */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExperience(exp.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExperience(exp.id);
                    }
                  }}
                  aria-expanded={isExpanded}
                  className={`w-full text-left p-3.5 sm:p-4.5 flex items-start sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                    isExpanded
                      ? "bg-indigo-50/40 border-b border-indigo-100"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`p-1.5 rounded-lg border transition-transform duration-200 mt-0.5 sm:mt-0 shrink-0 ${
                        isExpanded
                          ? "bg-indigo-600 border-indigo-600 text-white rotate-180"
                          : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {exp.role || "Untitled Role"}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">at</span>
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {exp.company || "Company Name"}
                        </span>
                        {exp.current && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-slate-500">
                        {(exp.startDate || exp.endDate) && (
                          <span>
                            {exp.startDate || "Start"} – {exp.current ? "Present" : exp.endDate || "End"}
                          </span>
                        )}
                        {exp.location && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="truncate max-w-[200px]">{exp.location}</span>
                          </>
                        )}
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                          {bulletCount} bullet{bulletCount === 1 ? "" : "s"}
                        </span>
                        {exp.technologies && exp.technologies.length > 0 && (
                          <>
                            <span className="hidden sm:inline text-slate-300">•</span>
                            <div className="hidden sm:inline-flex items-center gap-1">
                              {exp.technologies.slice(0, 3).map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px]"
                                >
                                  {tech}
                                </span>
                              ))}
                              {exp.technologies.length > 3 && (
                                <span className="text-[10px] text-slate-400">
                                  +{exp.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 self-start sm:self-center">
                    <button
                      type="button"
                      title="Delete Experience"
                      aria-label="Delete experience"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDraft({
                          ...draft,
                          experiences: draft.experiences.filter((_, i) => i !== expIdx),
                        });
                      }}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Editing Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4 bg-white animate-in fade-in-50 duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const next = [...draft.experiences];
                            next[expIdx] = { ...exp, company: e.target.value };
                            setDraft({ ...draft, experiences: next });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Role / Job Title
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const next = [...draft.experiences];
                            next[expIdx] = { ...exp, role: e.target.value };
                            setDraft({ ...draft, experiences: next });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const next = [...draft.experiences];
                            next[expIdx] = { ...exp, location: e.target.value };
                            setDraft({ ...draft, experiences: next });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => {
                            const next = [...draft.experiences];
                            next[expIdx] = { ...exp, startDate: e.target.value };
                            setDraft({ ...draft, experiences: next });
                          }}
                          placeholder="e.g. Jan 2024"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="text"
                          value={exp.endDate}
                          disabled={exp.current}
                          onChange={(e) => {
                            const next = [...draft.experiences];
                            next[expIdx] = { ...exp, endDate: e.target.value };
                            setDraft({ ...draft, experiences: next });
                          }}
                          placeholder="e.g. Dec 2025 or Present"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>
                      <div className="flex items-end pb-1.5">
                        <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => {
                              const next = [...draft.experiences];
                              next[expIdx] = {
                                ...exp,
                                current: e.target.checked,
                                endDate: e.target.checked ? "Present" : exp.endDate,
                              };
                              setDraft({ ...draft, experiences: next });
                            }}
                            className="accent-indigo-600 rounded"
                          />
                          Currently working here
                        </label>
                      </div>
                    </div>

                    {/* Bullet Points with Inline AI */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-800">
                          Impact Bullet Points (Input in Indonesian or English)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...draft.experiences];
                            next[expIdx] = {
                              ...exp,
                              bullets: [...exp.bullets, ""],
                            };
                            setDraft({ ...draft, experiences: next });
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Bullet
                        </button>
                      </div>

                      {exp.bullets.map((bullet, bIdx) => (
                        <div
                          key={bIdx}
                          className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 shadow-2xs"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-slate-400 mt-2">•</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => {
                                const next = [...draft.experiences];
                                const nextBullets = [...exp.bullets];
                                nextBullets[bIdx] = e.target.value;
                                next[expIdx] = { ...exp, bullets: nextBullets };
                                setDraft({ ...draft, experiences: next });
                              }}
                              placeholder="e.g. Meningkatkan performa API hingga 45% dengan optimasi query PostgreSQL dan caching Redis..."
                              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...draft.experiences];
                                next[expIdx] = {
                                  ...exp,
                                  bullets: exp.bullets.filter((_, i) => i !== bIdx),
                                };
                                setDraft({ ...draft, experiences: next });
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100 transition cursor-pointer mt-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="pl-4">
                            <InlineAiHelper
                              currentText={bullet}
                              contextRole={exp.role}
                              apiKey={apiKey}
                              onApply={(improved) => {
                                const next = [...draft.experiences];
                                const nextBullets = [...exp.bullets];
                                nextBullets[bIdx] = improved;
                                next[expIdx] = { ...exp, bullets: nextBullets };
                                setDraft({ ...draft, experiences: next });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Technologies Used */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Technologies Used (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={exp.technologies.join(", ")}
                        onChange={(e) => {
                          const next = [...draft.experiences];
                          next[expIdx] = {
                            ...exp,
                            technologies: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          };
                          setDraft({ ...draft, experiences: next });
                        }}
                        placeholder="TypeScript, Next.js, Go, PostgreSQL, Docker"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Projects Portfolio ({draft.projects.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any project to expand or collapse details.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {draft.projects.length > 0 && (
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={expandAllProjects}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                  >
                    Expand All
                  </button>
                  <span className="h-3.5 w-px bg-slate-200 my-auto" />
                  <button
                    type="button"
                    onClick={collapseAllProjects}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const newProjId = `proj-${Date.now()}`;
                  setDraft({
                    ...draft,
                    projects: [
                      {
                        id: newProjId,
                        title: "New Technical Project",
                        role: "Lead Developer",
                        startDate: "2026",
                        endDate: "2026",
                        description:
                          "High-impact full-stack or AI application solving a real-world engineering problem.",
                        bullets: [
                          "Designed and deployed scalable architecture handling 1,000+ concurrent requests.",
                        ],
                        techStack: ["Next.js", "TypeScript", "Gemini API"],
                        metrics: "99.9% uptime",
                        liveUrl: "",
                        repoUrl: "",
                      },
                      ...draft.projects,
                    ],
                  });
                  setExpandedProjects((prev) => ({ ...prev, [newProjId]: true }));
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
          </div>

          {draft.projects.map((proj, pIdx) => {
            const isExpanded = !!expandedProjects[proj.id];
            const bulletCount = proj.bullets.filter((b) => b && b.trim().length > 0).length;

            return (
              <div
                key={proj.id}
                className={`rounded-2xl transition-all duration-200 shadow-2xs overflow-hidden ${
                  isExpanded
                    ? "border border-indigo-200 bg-white ring-1 ring-indigo-50/50"
                    : "border border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {/* Clickable Accordion Header Bar */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleProject(proj.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleProject(proj.id);
                    }
                  }}
                  aria-expanded={isExpanded}
                  className={`w-full text-left p-3.5 sm:p-4.5 flex items-start sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                    isExpanded
                      ? "bg-indigo-50/40 border-b border-indigo-100"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`p-1.5 rounded-lg border transition-transform duration-200 mt-0.5 sm:mt-0 shrink-0 ${
                        isExpanded
                          ? "bg-indigo-600 border-indigo-600 text-white rotate-180"
                          : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {proj.title || "Untitled Project"}
                        </span>
                        {proj.role && (
                          <>
                            <span className="text-xs text-slate-400 font-normal">as</span>
                            <span className="text-xs font-semibold text-slate-700 truncate">
                              {proj.role}
                            </span>
                          </>
                        )}
                        {proj.metrics && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 truncate max-w-[220px]">
                            ⚡ {proj.metrics}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-slate-500">
                        {(proj.startDate || proj.endDate) && (
                          <span>
                            {proj.startDate || ""}
                            {proj.startDate && proj.endDate ? " – " : ""}
                            {proj.endDate || ""}
                          </span>
                        )}
                        {(proj.startDate || proj.endDate) && <span className="text-slate-300">•</span>}
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                          {bulletCount} highlight{bulletCount === 1 ? "" : "s"}
                        </span>
                        {proj.techStack && proj.techStack.length > 0 && (
                          <>
                            <span className="text-slate-300">•</span>
                            <div className="inline-flex flex-wrap items-center gap-1">
                              {proj.techStack.slice(0, 3).map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                              {proj.techStack.length > 3 && (
                                <span className="text-[10px] text-slate-400 font-medium">
                                  +{proj.techStack.length - 3} more
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 self-start sm:self-center">
                    <button
                      type="button"
                      title="Delete Project"
                      aria-label="Delete project"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDraft({
                          ...draft,
                          projects: draft.projects.filter((_, i) => i !== pIdx),
                        });
                      }}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Editing Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4 bg-white animate-in fade-in-50 duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[pIdx] = { ...proj, title: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          value={proj.role || ""}
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[pIdx] = { ...proj, role: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          placeholder="e.g. Lead Developer, Full-Stack Engineer"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Key Metrics / Quantified Impact
                        </label>
                        <input
                          type="text"
                          value={proj.metrics || ""}
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[pIdx] = { ...proj, metrics: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          placeholder="e.g. 94% accuracy, 2,500+ active users"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Start Date / Year
                        </label>
                        <input
                          type="text"
                          value={proj.startDate || ""}
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[pIdx] = { ...proj, startDate: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          placeholder="e.g. Jan 2025 or 2025"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          End Date / Year
                        </label>
                        <input
                          type="text"
                          value={proj.endDate || ""}
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[pIdx] = { ...proj, endDate: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          placeholder="e.g. Present or 2026"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Project Link / GitHub URL
                        </label>
                        <input
                          type="text"
                          value={proj.liveUrl || ""}
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[pIdx] = { ...proj, liveUrl: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          placeholder="https://github.com/... or https://..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tech Stack (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={proj.techStack.join(", ")}
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[pIdx] = {
                              ...proj,
                              techStack: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            };
                            setDraft({ ...draft, projects: next });
                          }}
                          placeholder="React, TypeScript, Node.js, Tailwind CSS"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={proj.description}
                        onChange={(e) => {
                          const next = [...draft.projects];
                          next[pIdx] = { ...proj, description: e.target.value };
                          setDraft({ ...draft, projects: next });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-800">
                          Project Highlights / Bullets
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...draft.projects];
                            next[pIdx] = {
                              ...proj,
                              bullets: [...proj.bullets, ""],
                            };
                            setDraft({ ...draft, projects: next });
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Bullet
                        </button>
                      </div>
                      {proj.bullets.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 shadow-2xs"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-slate-400 mt-2">•</span>
                            <textarea
                              rows={2}
                              value={b}
                              onChange={(e) => {
                                const next = [...draft.projects];
                                const nextBullets = [...proj.bullets];
                                nextBullets[bIdx] = e.target.value;
                                next[pIdx] = { ...proj, bullets: nextBullets };
                                setDraft({ ...draft, projects: next });
                              }}
                              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...draft.projects];
                                next[pIdx] = {
                                  ...proj,
                                  bullets: proj.bullets.filter((_, i) => i !== bIdx),
                                };
                                setDraft({ ...draft, projects: next });
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100 transition cursor-pointer mt-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="pl-4">
                            <InlineAiHelper
                              currentText={b}
                              contextRole={proj.title}
                              apiKey={apiKey}
                              onApply={(improved) => {
                                const next = [...draft.projects];
                                const nextBullets = [...proj.bullets];
                                nextBullets[bIdx] = improved;
                                next[pIdx] = { ...proj, bullets: nextBullets };
                                setDraft({ ...draft, projects: next });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "education" && (
        <div className="space-y-6">
          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Education ({draft.education.length})
              </h3>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    education: [
                      ...draft.education,
                      {
                        id: `edu-${Date.now()}`,
                        institution: "University Name",
                        degree: "Bachelor of Science",
                        fieldOfStudy: "Computer Science",
                        location: "Indonesia",
                        startDate: "2019",
                        endDate: "2023",
                        gpa: "3.85 / 4.00",
                        honors: "",
                        highlights: [],
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </div>

            {draft.education.map((edu, idx) => (
              <div
                key={edu.id}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900">
                    {edu.institution}
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        education: draft.education.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const next = [...draft.education];
                      next[idx] = { ...edu, institution: e.target.value };
                      setDraft({ ...draft, education: next });
                    }}
                    placeholder="Institution"
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const next = [...draft.education];
                      next[idx] = { ...edu, degree: e.target.value };
                      setDraft({ ...draft, education: next });
                    }}
                    placeholder="Degree (e.g. Bachelor of Engineering)"
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => {
                      const next = [...draft.education];
                      next[idx] = { ...edu, fieldOfStudy: e.target.value };
                      setDraft({ ...draft, education: next });
                    }}
                    placeholder="Field of Study"
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => {
                      const next = [...draft.education];
                      next[idx] = { ...edu, startDate: e.target.value };
                      setDraft({ ...draft, education: next });
                    }}
                    placeholder="Start Date"
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => {
                      const next = [...draft.education];
                      next[idx] = { ...edu, endDate: e.target.value };
                      setDraft({ ...draft, education: next });
                    }}
                    placeholder="End Date"
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <input
                    type="text"
                    value={edu.gpa || ""}
                    onChange={(e) => {
                      const next = [...draft.education];
                      next[idx] = { ...edu, gpa: e.target.value };
                      setDraft({ ...draft, education: next });
                    }}
                    placeholder="GPA (e.g. 3.86 / 4.00)"
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Certifications ({draft.certifications.length})
              </h3>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    certifications: [
                      ...draft.certifications,
                      {
                        id: `cert-${Date.now()}`,
                        name: "Certification Name",
                        issuer: "Issuing Organization",
                        issueDate: "2025",
                        credentialId: "",
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>

            {draft.certifications.map((cert, idx) => (
              <div
                key={cert.id}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-center shadow-2xs"
              >
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => {
                    const next = [...draft.certifications];
                    next[idx] = { ...cert, name: e.target.value };
                    setDraft({ ...draft, certifications: next });
                  }}
                  placeholder="Certification Name"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => {
                    const next = [...draft.certifications];
                    next[idx] = { ...cert, issuer: e.target.value };
                    setDraft({ ...draft, certifications: next });
                  }}
                  placeholder="Issuer"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <input
                  type="text"
                  value={cert.issueDate}
                  onChange={(e) => {
                    const next = [...draft.certifications];
                    next[idx] = { ...cert, issueDate: e.target.value };
                    setDraft({ ...draft, certifications: next });
                  }}
                  placeholder="Issue Date"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cert.credentialId || ""}
                    onChange={(e) => {
                      const next = [...draft.certifications];
                      next[idx] = { ...cert, credentialId: e.target.value };
                      setDraft({ ...draft, certifications: next });
                    }}
                    placeholder="Credential ID"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        certifications: draft.certifications.filter(
                          (_, i) => i !== idx
                        ),
                      })
                    }
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Categorized Technical & Soft Skills
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Group your skills logically for ATS keyword scannability
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  skills: [
                    ...draft.skills,
                    {
                      id: `skill-${Date.now()}`,
                      category: "New Skill Category",
                      items: ["Skill 1", "Skill 2"],
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="space-y-3">
            {draft.skills.map((cat, idx) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 items-center shadow-2xs"
              >
                <input
                  type="text"
                  value={cat.category}
                  onChange={(e) => {
                    const next = [...draft.skills];
                    next[idx] = { ...cat, category: e.target.value };
                    setDraft({ ...draft, skills: next });
                  }}
                  placeholder="Category (e.g. Cloud & DevOps)"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={cat.items.join(", ")}
                    onChange={(e) => {
                      const next = [...draft.skills];
                      next[idx] = {
                        ...cat,
                        items: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      };
                      setDraft({ ...draft, skills: next });
                    }}
                    placeholder="Comma-separated skills..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        skills: draft.skills.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "extras" && (
        <div className="space-y-6">
          {/* Publications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Publications ({draft.publications.length})
              </h3>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    publications: [
                      ...draft.publications,
                      {
                        id: `pub-${Date.now()}`,
                        title: "Paper / Article Title",
                        publisher: "Conference or Journal",
                        date: "2025",
                        description: "",
                      },
                    ],
                  })
                }
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Publication
              </button>
            </div>
            {draft.publications.map((pub, idx) => (
              <div
                key={pub.id}
                className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-2.5 shadow-2xs"
              >
                <input
                  type="text"
                  value={pub.title}
                  onChange={(e) => {
                    const next = [...draft.publications];
                    next[idx] = { ...pub, title: e.target.value };
                    setDraft({ ...draft, publications: next });
                  }}
                  placeholder="Title"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <input
                  type="text"
                  value={pub.publisher}
                  onChange={(e) => {
                    const next = [...draft.publications];
                    next[idx] = { ...pub, publisher: e.target.value };
                    setDraft({ ...draft, publications: next });
                  }}
                  placeholder="Publisher / Venue"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <input
                  type="text"
                  value={pub.date}
                  onChange={(e) => {
                    const next = [...draft.publications];
                    next[idx] = { ...pub, date: e.target.value };
                    setDraft({ ...draft, publications: next });
                  }}
                  placeholder="Date"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pub.description || ""}
                    onChange={(e) => {
                      const next = [...draft.publications];
                      next[idx] = { ...pub, description: e.target.value };
                      setDraft({ ...draft, publications: next });
                    }}
                    placeholder="Impact / Summary"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        publications: draft.publications.filter(
                          (_, i) => i !== idx
                        ),
                      })
                    }
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Honors & Awards */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Honors & Awards ({draft.awards.length})
              </h3>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    awards: [
                      ...draft.awards,
                      {
                        id: `award-${Date.now()}`,
                        title: "Award Title",
                        issuer: "Organization",
                        date: "2025",
                        description: "",
                      },
                    ],
                  })
                }
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Award
              </button>
            </div>
            {draft.awards.map((aw, idx) => (
              <div
                key={aw.id}
                className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-2.5 shadow-2xs"
              >
                <input
                  type="text"
                  value={aw.title}
                  onChange={(e) => {
                    const next = [...draft.awards];
                    next[idx] = { ...aw, title: e.target.value };
                    setDraft({ ...draft, awards: next });
                  }}
                  placeholder="Award Title"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <input
                  type="text"
                  value={aw.issuer}
                  onChange={(e) => {
                    const next = [...draft.awards];
                    next[idx] = { ...aw, issuer: e.target.value };
                    setDraft({ ...draft, awards: next });
                  }}
                  placeholder="Issuer"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <input
                  type="text"
                  value={aw.date}
                  onChange={(e) => {
                    const next = [...draft.awards];
                    next[idx] = { ...aw, date: e.target.value };
                    setDraft({ ...draft, awards: next });
                  }}
                  placeholder="Date"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aw.description}
                    onChange={(e) => {
                      const next = [...draft.awards];
                      next[idx] = { ...aw, description: e.target.value };
                      setDraft({ ...draft, awards: next });
                    }}
                    placeholder="Details"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        awards: draft.awards.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Volunteer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                Leadership & Volunteering ({draft.volunteer.length})
              </h3>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    volunteer: [
                      ...draft.volunteer,
                      {
                        id: `vol-${Date.now()}`,
                        organization: "Organization",
                        role: "Role",
                        startDate: "2024",
                        endDate: "Present",
                        bullets: ["Contributed to community mentoring."],
                      },
                    ],
                  })
                }
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Volunteer
              </button>
            </div>
            {draft.volunteer.map((vol, idx) => (
              <div
                key={vol.id}
                className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-2.5 shadow-2xs"
              >
                <input
                  type="text"
                  value={vol.organization}
                  onChange={(e) => {
                    const next = [...draft.volunteer];
                    next[idx] = { ...vol, organization: e.target.value };
                    setDraft({ ...draft, volunteer: next });
                  }}
                  placeholder="Organization"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <input
                  type="text"
                  value={vol.role}
                  onChange={(e) => {
                    const next = [...draft.volunteer];
                    next[idx] = { ...vol, role: e.target.value };
                    setDraft({ ...draft, volunteer: next });
                  }}
                  placeholder="Role"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <input
                  type="text"
                  value={`${vol.startDate} - ${vol.endDate}`}
                  onChange={(e) => {
                    const parts = e.target.value.split("-");
                    const next = [...draft.volunteer];
                    next[idx] = {
                      ...vol,
                      startDate: parts[0]?.trim() || "",
                      endDate: parts[1]?.trim() || "",
                    };
                    setDraft({ ...draft, volunteer: next });
                  }}
                  placeholder="Start - End"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={vol.bullets[0] || ""}
                    onChange={(e) => {
                      const next = [...draft.volunteer];
                      next[idx] = { ...vol, bullets: [e.target.value] };
                      setDraft({ ...draft, volunteer: next });
                    }}
                    placeholder="Key impact bullet"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        volunteer: draft.volunteer.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
