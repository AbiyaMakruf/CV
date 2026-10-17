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

  // Sync when external profile updates (e.g. after Legacy CV import)
  React.useEffect(() => {
    setDraft(profile);
  }, [profile]);

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
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-2">
            <Languages className="w-3.5 h-3.5" />
            <span>Single Source of Truth • Supports Bahasa Indonesia & English Input</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Master Career Repository
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Store your complete career history here. Write in Indonesian or
            English — use inline Gemini AI buttons to translate & optimize into
            the XYZ Formula.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenImportModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition cursor-pointer"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            Import Legacy CV (PDF/DOCX/Img)
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition cursor-pointer"
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
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === t.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === t.id
                    ? "bg-indigo-800 text-indigo-100"
                    : "bg-slate-800 text-slate-400"
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
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Personal Contact & Executive Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
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
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
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
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
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
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
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
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
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
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
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
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
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
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
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
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
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
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
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
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Work Experience ({draft.experiences.length})
            </h3>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  experiences: [
                    {
                      id: `exp-${Date.now()}`,
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
                })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Work Experience
            </button>
          </div>

          {draft.experiences.map((exp, expIdx) => (
            <div
              key={exp.id}
              className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {exp.role || "Role"} @ {exp.company || "Company"}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate} •{" "}
                    {exp.location}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      experiences: draft.experiences.filter(
                        (_, i) => i !== expIdx
                      ),
                    })
                  }
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white disabled:opacity-50"
                  />
                </div>
                <div className="flex items-end pb-1.5">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
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
                      className="accent-indigo-500"
                    />
                    Currently working here
                  </label>
                </div>
              </div>

              {/* Bullet Points with Inline AI */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
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
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Bullet
                  </button>
                </div>

                {exp.bullets.map((bullet, bIdx) => (
                  <div
                    key={bIdx}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-slate-500 mt-2">•</span>
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
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
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
                        className="text-slate-500 hover:text-rose-400 p-1 mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
                <label className="block text-[11px] text-slate-400 mb-1">
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
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Projects Portfolio ({draft.projects.length})
            </h3>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  projects: [
                    {
                      id: `proj-${Date.now()}`,
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
                })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>

          {draft.projects.map((proj, pIdx) => (
            <div
              key={proj.id}
              className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      projects: draft.projects.filter((_, i) => i !== pIdx),
                    })
                  }
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
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
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
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
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Bullet
                  </button>
                </div>
                {proj.bullets.map((b, bIdx) => (
                  <div
                    key={bIdx}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80"
                  >
                    <div className="flex items-start gap-2">
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
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
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
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "education" && (
        <div className="space-y-6">
          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </div>

            {draft.education.map((edu, idx) => (
              <div
                key={edu.id}
                className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">
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
                    className="text-slate-500 hover:text-rose-400"
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
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
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
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
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
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
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
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
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
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
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
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>

            {draft.certifications.map((cert, idx) => (
              <div
                key={cert.id}
                className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
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
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
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
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
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
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
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
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
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
                    className="text-slate-500 hover:text-rose-400 p-1"
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
        <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Categorized Technical & Soft Skills
              </h3>
              <p className="text-xs text-slate-400">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="space-y-3">
            {draft.skills.map((cat, idx) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
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
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white"
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
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        skills: draft.skills.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-slate-500 hover:text-rose-400 p-1.5"
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
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
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
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Publication
              </button>
            </div>
            {draft.publications.map((pub, idx) => (
              <div
                key={pub.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2.5"
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
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
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
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
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
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
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
                    className="flex-1 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
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
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Honors & Awards */}
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
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
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Award
              </button>
            </div>
            {draft.awards.map((aw, idx) => (
              <div
                key={aw.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2.5"
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
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
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
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
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
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
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
                    className="flex-1 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        awards: draft.awards.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Volunteer */}
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
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
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Volunteer
              </button>
            </div>
            {draft.volunteer.map((vol, idx) => (
              <div
                key={vol.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2.5"
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
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
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
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
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
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
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
                    className="flex-1 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        volunteer: draft.volunteer.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-slate-500 hover:text-rose-400"
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
