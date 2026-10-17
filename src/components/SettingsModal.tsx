"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Download,
  Upload,
  ShieldCheck,
  Check,
  X,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { BackupPayload } from "@/types/resume";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  localApiKey: string;
  hasServerApiKey: boolean;
  maskedServerApiKey: string;
  onSaveApiKey: (apiKey: string, persistToServer: boolean) => Promise<void>;
  onExportBackup: () => Promise<void>;
  onImportBackup: (payload: BackupPayload) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  localApiKey,
  hasServerApiKey,
  maskedServerApiKey,
  onSaveApiKey,
  onExportBackup,
  onImportBackup,
}) => {
  const [keyInput, setKeyInput] = useState(localApiKey);
  const [showKey, setShowKey] = useState(false);
  const [persistServer, setPersistServer] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  React.useEffect(() => {
    setKeyInput(localApiKey);
  }, [localApiKey]);

  if (!isOpen) return null;

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveApiKey(keyInput.trim(), persistServer);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportSuccess(false);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as BackupPayload;
      if (!parsed.masterProfile) {
        throw new Error("Invalid backup file: missing masterProfile object.");
      }
      await onImportBackup(parsed);
      setImportSuccess(true);
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : "Failed to import JSON backup."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Privacy, Gemini API Key & Data Backup
              </h2>
              <p className="text-xs text-slate-400">
                100% Self-Hosted SQLite + Encrypted Local Storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gemini API Key Section */}
        <form onSubmit={handleSaveKey} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              Google Gemini API Key
            </label>
            {hasServerApiKey && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                Active Key: {maskedServerApiKey}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Powers Legacy CV multimodal extraction, Indonesian → English
            translation, XYZ bullet optimization, and 1-Click JD Tailoring. Get
            a free key from{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 underline"
            >
              Google AI Studio
            </a>
            .
          </p>

          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={persistServer}
              onChange={(e) => setPersistServer(e.target.checked)}
              className="accent-indigo-500"
            />
            Also persist key in local self-hosted SQLite database (in addition
            to encoded browser localStorage)
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : savedSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <KeyRound className="w-3.5 h-3.5" />
              )}
              <span>{savedSuccess ? "API Key Saved!" : "Save API Key"}</span>
            </button>
          </div>
        </form>

        {/* Full JSON Backup Export / Import */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Full Career Database Backup (JSON)
          </h3>
          <p className="text-xs text-slate-400">
            Export your entire Master Career Profile, all Tailored CV versions,
            Cover Letters, and Job Application Tracker history into a portable
            JSON file.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={onExportBackup}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export All Data (.JSON)
            </button>

            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer">
              <Upload className="w-4 h-4 text-indigo-400" />
              Import Backup (.JSON)
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>

          {importError && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {importError}
            </div>
          )}

          {importSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              ✓ Backup successfully restored!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
