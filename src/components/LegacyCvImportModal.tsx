"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  X,
  Loader2,
  GitMerge,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { MasterCareerProfile } from "@/types/resume";

interface LegacyCvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMaster: MasterCareerProfile;
  apiKey?: string;
  onMergeComplete: (updatedMaster: MasterCareerProfile) => Promise<void>;
}

export const LegacyCvImportModal: React.FC<LegacyCvImportModalProps> = ({
  isOpen,
  onClose,
  currentMaster,
  apiKey,
  onMergeComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<Omit<
    MasterCareerProfile,
    "id" | "updatedAt"
  > | null>(null);

  // Checkboxes for selective merge
  const [importPersonalInfo, setImportPersonalInfo] = useState(true);
  const [importExperiences, setImportExperiences] = useState(true);
  const [importEducation, setImportEducation] = useState(true);
  const [importProjects, setImportProjects] = useState(true);
  const [importSkills, setImportSkills] = useState(true);
  const [importCertifications, setImportCertifications] = useState(true);
  const [importExtras, setImportExtras] = useState(true); // publications, awards, volunteer
  const [mergeStrategy, setMergeStrategy] = useState<"merge" | "replace">(
    "merge"
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleUploadAndParse = async () => {
    if (!file) return;
    setIsParsing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-cv", {
        method: "POST",
        headers: {
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to parse CV document");
      }

      setExtracted(data.extractedProfile);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error parsing legacy resume"
      );
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!extracted) return;
    setIsSaving(true);
    try {
      const nextProfile: MasterCareerProfile = {
        ...currentMaster,
      };

      if (importPersonalInfo) {
        nextProfile.personalInfo =
          mergeStrategy === "replace"
            ? extracted.personalInfo
            : {
                fullName:
                  extracted.personalInfo.fullName ||
                  currentMaster.personalInfo.fullName,
                headline:
                  extracted.personalInfo.headline ||
                  currentMaster.personalInfo.headline,
                email:
                  extracted.personalInfo.email ||
                  currentMaster.personalInfo.email,
                phone:
                  extracted.personalInfo.phone ||
                  currentMaster.personalInfo.phone,
                location:
                  extracted.personalInfo.location ||
                  currentMaster.personalInfo.location,
                linkedin:
                  extracted.personalInfo.linkedin ||
                  currentMaster.personalInfo.linkedin,
                github:
                  extracted.personalInfo.github ||
                  currentMaster.personalInfo.github,
                portfolio:
                  extracted.personalInfo.portfolio ||
                  currentMaster.personalInfo.portfolio,
                summary:
                  extracted.personalInfo.summary ||
                  currentMaster.personalInfo.summary,
              };
      }

      // Deduplicating merge helper
      const dedupeMerge = <T,>(
        existing: T[],
        incoming: T[],
        keyFn: (item: T) => string
      ): T[] => {
        if (mergeStrategy === "replace") return incoming;
        const seen = new Set(existing.map((i) => keyFn(i).toLowerCase()));
        const additions = incoming.filter(
          (item) => !seen.has(keyFn(item).toLowerCase())
        );
        return [...existing, ...additions];
      };

      if (importExperiences) {
        nextProfile.experiences = dedupeMerge(
          currentMaster.experiences,
          extracted.experiences.map((e, i) => ({
            ...e,
            id: e.id || `imp-exp-${Date.now()}-${i}`,
          })),
          (e) => `${e.company}::${e.role}::${e.startDate}`
        );
      }

      if (importEducation) {
        nextProfile.education = dedupeMerge(
          currentMaster.education,
          extracted.education.map((e, i) => ({
            ...e,
            id: e.id || `imp-edu-${Date.now()}-${i}`,
          })),
          (e) => `${e.institution}::${e.degree}`
        );
      }

      if (importProjects) {
        nextProfile.projects = dedupeMerge(
          currentMaster.projects,
          extracted.projects.map((p, i) => ({
            ...p,
            id: p.id || `imp-proj-${Date.now()}-${i}`,
          })),
          (p) => p.title
        );
      }

      if (importSkills) {
        if (mergeStrategy === "replace") {
          nextProfile.skills = extracted.skills.map((s, i) => ({
            ...s,
            id: s.id || `imp-skill-${Date.now()}-${i}`,
          }));
        } else {
          const mergedSkills = [...currentMaster.skills];
          for (const inc of extracted.skills) {
            const matchIdx = mergedSkills.findIndex(
              (s) => s.category.toLowerCase() === inc.category.toLowerCase()
            );
            if (matchIdx >= 0) {
              const existingSet = new Set(
                mergedSkills[matchIdx].items.map((x) => x.toLowerCase())
              );
              const newItems = inc.items.filter(
                (x) => !existingSet.has(x.toLowerCase())
              );
              mergedSkills[matchIdx] = {
                ...mergedSkills[matchIdx],
                items: [...mergedSkills[matchIdx].items, ...newItems],
              };
            } else {
              mergedSkills.push({
                ...inc,
                id: inc.id || `imp-skill-${Date.now()}-${mergedSkills.length}`,
              });
            }
          }
          nextProfile.skills = mergedSkills;
        }
      }

      if (importCertifications) {
        nextProfile.certifications = dedupeMerge(
          currentMaster.certifications,
          extracted.certifications.map((c, i) => ({
            ...c,
            id: c.id || `imp-cert-${Date.now()}-${i}`,
          })),
          (c) => `${c.name}::${c.issuer}`
        );
      }

      if (importExtras) {
        nextProfile.publications = dedupeMerge(
          currentMaster.publications,
          extracted.publications || [],
          (p) => p.title
        );
        nextProfile.awards = dedupeMerge(
          currentMaster.awards,
          extracted.awards || [],
          (a) => a.title
        );
        nextProfile.volunteer = dedupeMerge(
          currentMaster.volunteer,
          extracted.volunteer || [],
          (v) => `${v.organization}::${v.role}`
        );
      }

      await onMergeComplete(nextProfile);
      setExtracted(null);
      setFile(null);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Legacy CV Extraction & Smart Ingestion
              </h2>
              <p className="text-xs text-slate-400">
                Upload PDF, DOCX, or Image — Gemini AI extracts, translates (ID
                → EN), and structures your data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {!extracted ? (
            <>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl p-8 cursor-pointer bg-slate-950/40 transition">
                <FileText className="w-10 h-10 text-indigo-400 mb-3" />
                <span className="text-sm font-medium text-slate-200">
                  {file ? file.name : "Click to select your existing CV file"}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Supports PDF (.pdf), Word (.docx), Image (.png, .jpg), or Text
                  (.txt) — Bahasa Indonesia or English
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.webp,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setFile(f);
                    setError(null);
                  }}
                />
              </label>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!file || isParsing}
                  onClick={handleUploadAndParse}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting & Structuring with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Extract Career Data
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-200">
                      Extraction Complete — Review Before Merging
                    </h4>
                    <p className="text-[11px] text-emerald-300/80">
                      Choose which extracted sections to merge into your Master
                      Career Profile.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExtracted(null)}
                  className="text-xs text-slate-300 hover:text-white underline"
                >
                  Upload Different File
                </button>
              </div>

              {/* Merge Strategy Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMergeStrategy("merge")}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    mergeStrategy === "merge"
                      ? "bg-indigo-500/15 border-indigo-500 text-white"
                      : "bg-slate-950/40 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <GitMerge className="w-4 h-4 text-indigo-400" />
                    Smart Merge (Avoid Duplicates)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Keeps your existing entries and appends new non-duplicate
                    items.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMergeStrategy("replace")}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    mergeStrategy === "replace"
                      ? "bg-amber-500/15 border-amber-500 text-white"
                      : "bg-slate-950/40 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                    Overwrite Selected Sections
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Replaces checked sections in your Master Profile with
                    extracted data.
                  </p>
                </button>
              </div>

              {/* Section Checkboxes & Preview Counts */}
              <div className="space-y-2.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-900/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importPersonalInfo}
                    onChange={(e) => setImportPersonalInfo(e.target.checked)}
                    className="mt-1 accent-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white">
                      Personal Info & Summary:{" "}
                    </span>
                    <span className="text-slate-300">
                      {extracted.personalInfo.fullName} —{" "}
                      {extracted.personalInfo.headline} (
                      {extracted.personalInfo.email})
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-900/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importExperiences}
                    onChange={(e) => setImportExperiences(e.target.checked)}
                    className="mt-1 accent-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white">
                      Work Experiences ({extracted.experiences.length} found):{" "}
                    </span>
                    <span className="text-slate-400">
                      {extracted.experiences
                        .map((e) => `${e.role} @ ${e.company}`)
                        .join(" • ") || "None"}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-900/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importProjects}
                    onChange={(e) => setImportProjects(e.target.checked)}
                    className="mt-1 accent-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white">
                      Projects ({extracted.projects.length} found):{" "}
                    </span>
                    <span className="text-slate-400">
                      {extracted.projects.map((p) => p.title).join(" • ") ||
                        "None"}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-900/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importEducation}
                    onChange={(e) => setImportEducation(e.target.checked)}
                    className="mt-1 accent-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white">
                      Education ({extracted.education.length} found):{" "}
                    </span>
                    <span className="text-slate-400">
                      {extracted.education
                        .map((e) => `${e.degree} - ${e.institution}`)
                        .join(" • ") || "None"}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-900/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importSkills}
                    onChange={(e) => setImportSkills(e.target.checked)}
                    className="mt-1 accent-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white">
                      Skills ({extracted.skills.length} categories):{" "}
                    </span>
                    <span className="text-slate-400">
                      {extracted.skills
                        .map((s) => `${s.category} (${s.items.length})`)
                        .join(" • ") || "None"}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-900/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importCertifications}
                    onChange={(e) =>
                      setImportCertifications(e.target.checked)
                    }
                    className="mt-1 accent-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white">
                      Certifications ({extracted.certifications.length} found)
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-900/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importExtras}
                    onChange={(e) => setImportExtras(e.target.checked)}
                    className="mt-1 accent-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white">
                      Publications ({extracted.publications?.length || 0}),
                      Awards ({extracted.awards?.length || 0}), Volunteer (
                      {extracted.volunteer?.length || 0})
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleConfirmImport}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Confirm & Merge into Master Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
