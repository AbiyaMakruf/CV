"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Database,
  FileCheck2,
  Kanban,
  Upload,
  Settings,
  KeyRound,
  Loader2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import {
  BackupPayload,
  JobApplicationRecord,
  MasterCareerProfile,
  TailoredResumeRecord,
} from "@/types/resume";
import { MasterProfileEditor } from "@/components/MasterProfileEditor";
import { TailoredCvStudio } from "@/components/TailoredCvStudio";
import { ApplicationTracker } from "@/components/ApplicationTracker";
import { LegacyCvImportModal } from "@/components/LegacyCvImportModal";
import { SettingsModal } from "@/components/SettingsModal";

type MainWorkspaceTab = "studio" | "master" | "tracker";

const LOCAL_STORAGE_KEY_ENC = "ats_cv_gemini_key_v1";

function encodeKey(raw: string): string {
  try {
    return btoa(unescape(encodeURIComponent(raw)));
  } catch {
    return raw;
  }
}

function decodeKey(encoded: string): string {
  try {
    return decodeURIComponent(escape(atob(encoded)));
  } catch {
    return encoded;
  }
}

export default function AppWorkspacePage() {
  const [activeTab, setActiveTab] = useState<MainWorkspaceTab>("studio");
  const [isLoading, setIsLoading] = useState(true);

  const [masterProfile, setMasterProfile] =
    useState<MasterCareerProfile | null>(null);
  const [tailoredResumes, setTailoredResumes] = useState<
    TailoredResumeRecord[]
  >([]);
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);

  const [localApiKey, setLocalApiKey] = useState<string>("");
  const [hasServerApiKey, setHasServerApiKey] = useState<boolean>(false);
  const [maskedServerApiKey, setMaskedServerApiKey] = useState<string>("");

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const loadAppState = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/state");
      const data = await res.json();
      if (res.ok) {
        setMasterProfile(data.masterProfile);
        setTailoredResumes(data.tailoredResumes || []);
        setApplications(data.applications || []);
        setHasServerApiKey(Boolean(data.hasServerApiKey));
        setMaskedServerApiKey(data.maskedServerApiKey || "");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedEnc = localStorage.getItem(LOCAL_STORAGE_KEY_ENC);
    if (savedEnc) {
      setLocalApiKey(decodeKey(savedEnc));
    }
    loadAppState();
  }, []);

  const handleSaveMasterProfile = async (updated: MasterCareerProfile) => {
    const res = await fetch("/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "masterProfile",
        masterProfile: updated,
      }),
    });
    const data = await res.json();
    if (res.ok && data.masterProfile) {
      setMasterProfile(data.masterProfile);
    }
  };

  const handleCreateBlankFromMaster = async () => {
    if (!masterProfile) return;
    const res = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${masterProfile.personalInfo.headline || "Tailored CV"} — Copy`,
        collection: "General",
        targetRole: masterProfile.personalInfo.headline,
        targetCompany: "",
      }),
    });
    const data = await res.json();
    if (res.ok && data.resume) {
      setTailoredResumes((prev) => [data.resume, ...prev]);
    }
  };

  const handleUpdateResume = async (
    id: string,
    patch: Partial<TailoredResumeRecord>
  ) => {
    setTailoredResumes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
    const res = await fetch("/api/resumes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    const data = await res.json();
    if (res.ok && data.resume) {
      setTailoredResumes((prev) =>
        prev.map((r) => (r.id === id ? data.resume : r))
      );
    }
  };

  const handleDeleteResume = async (id: string) => {
    await fetch(`/api/resumes?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setTailoredResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleTrackApplicationFromResume = async (
    resume: TailoredResumeRecord
  ) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: resume.targetCompany || "Target Company",
        roleTitle: resume.targetRole || resume.title,
        jobUrl: resume.jobUrl || "",
        location: resume.cvData.personalInfo.location || "",
        status: "APPLIED",
        appliedDate: new Date().toISOString().slice(0, 10),
        notes: `Tailored CV (${resume.atsAnalysis?.overallScore || 85}% ATS Match) submitted.`,
        tailoredResumeId: resume.id,
      }),
    });
    const data = await res.json();
    if (res.ok && data.application) {
      setApplications((prev) => [data.application, ...prev]);
    }
  };

  const handleCreateApplication = async (
    input: Omit<
      JobApplicationRecord,
      "id" | "createdAt" | "updatedAt" | "tailoredResumeTitle"
    >
  ) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (res.ok && data.application) {
      setApplications((prev) => [data.application, ...prev]);
    }
  };

  const handleUpdateApplication = async (
    id: string,
    patch: Partial<JobApplicationRecord>
  ) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
    const res = await fetch("/api/applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    const data = await res.json();
    if (res.ok && data.application) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? data.application : a))
      );
    }
  };

  const handleDeleteApplication = async (id: string) => {
    await fetch(`/api/applications?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveApiKey = async (
    apiKey: string,
    persistToServer: boolean
  ) => {
    setLocalApiKey(apiKey);
    if (apiKey) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ENC, encodeKey(apiKey));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ENC);
    }

    if (persistToServer) {
      const res = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "apiKey", apiKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setHasServerApiKey(Boolean(data.hasServerApiKey));
        setMaskedServerApiKey(data.maskedServerApiKey || "");
      }
    }
  };

  const handleExportBackup = async () => {
    const res = await fetch("/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "exportBackup" }),
    });
    const backup = await res.json();
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ats-career-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = async (payload: BackupPayload) => {
    const res = await fetch("/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "importBackup", payload }),
    });
    const data = await res.json();
    if (res.ok) {
      setMasterProfile(data.masterProfile);
      setTailoredResumes(data.tailoredResumes || []);
      setApplications(data.applications || []);
    }
  };

  const isKeyConfigured = Boolean(localApiKey || hasServerApiKey);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="no-print sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 shadow-2xs">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-700 transition mr-1"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link href="/" className="hover:opacity-85 transition">
                  <h1 className="text-base font-extrabold tracking-tight text-slate-900">
                    ATS Resume Studio
                  </h1>
                </Link>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Master Career Repository • ID→EN Translation • JD Matcher &
                Vector PDF
              </p>
            </div>
          </div>

          {/* Center Workspace Switcher */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("studio")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "studio"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <span>Tailored CV Studio</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
                {tailoredResumes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("master")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "master"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Master Career Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tracker")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "tracker"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Kanban className="w-4 h-4 text-indigo-600" />
              <span>Application Tracker</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
                {applications.length}
              </span>
            </button>
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Import Legacy CV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isKeyConfigured
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                  : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
              }`}
            >
              {isKeyConfigured ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gemini Key Ready</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Set Gemini API Key</span>
                </>
              )}
              <Settings className="w-3.5 h-3.5 ml-0.5 opacity-75" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 lg:px-8 py-6">
        {isLoading || !masterProfile ? (
          <div className="h-[65vh] flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">
              Loading your Master Career Repository & Tailored CVs...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "studio" && (
              <TailoredCvStudio
                resumes={tailoredResumes}
                masterProfile={masterProfile}
                apiKey={localApiKey}
                onSelectOrCreateResume={(newResume) => {
                  setTailoredResumes((prev) => [
                    newResume,
                    ...prev.filter((r) => r.id !== newResume.id),
                  ]);
                }}
                onUpdateResume={handleUpdateResume}
                onDeleteResume={handleDeleteResume}
                onCreateBlankFromMaster={handleCreateBlankFromMaster}
                onTrackApplication={handleTrackApplicationFromResume}
              />
            )}

            {activeTab === "master" && (
              <MasterProfileEditor
                profile={masterProfile}
                apiKey={localApiKey}
                onSave={handleSaveMasterProfile}
                onOpenImportModal={() => setIsImportModalOpen(true)}
              />
            )}

            {activeTab === "tracker" && (
              <ApplicationTracker
                applications={applications}
                resumes={tailoredResumes}
                onCreate={handleCreateApplication}
                onUpdate={handleUpdateApplication}
                onDelete={handleDeleteApplication}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {masterProfile && (
        <LegacyCvImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          currentMaster={masterProfile}
          apiKey={localApiKey}
          onMergeComplete={handleSaveMasterProfile}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        localApiKey={localApiKey}
        hasServerApiKey={hasServerApiKey}
        maskedServerApiKey={maskedServerApiKey}
        onSaveApiKey={handleSaveApiKey}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />
    </div>
  );
}
