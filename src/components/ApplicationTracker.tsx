"use client";

import React, { useState } from "react";
import {
  Kanban,
  Table,
  Plus,
  ExternalLink,
  Trash2,
  Calendar,
  Building2,
  FileCheck2,
  X,
} from "lucide-react";
import {
  ApplicationStatus,
  JobApplicationRecord,
  TailoredResumeRecord,
} from "@/types/resume";

interface ApplicationTrackerProps {
  applications: JobApplicationRecord[];
  resumes: TailoredResumeRecord[];
  onCreate: (
    input: Omit<
      JobApplicationRecord,
      "id" | "createdAt" | "updatedAt" | "tailoredResumeTitle"
    >
  ) => Promise<void>;
  onUpdate: (
    id: string,
    patch: Partial<JobApplicationRecord>
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const COLUMNS: {
  status: ApplicationStatus;
  label: string;
  badgeClass: string;
}[] = [
  {
    status: "WISHLIST",
    label: "Wishlist / Saved",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    status: "APPLIED",
    label: "Applied",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    status: "INTERVIEW",
    label: "Interviewing",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    status: "OFFER",
    label: "Offer Received",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    status: "REJECTED",
    label: "Rejected / Archived",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  resumes,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("APPLIED");
  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [salaryRange, setSalaryRange] = useState("");
  const [tailoredResumeId, setTailoredResumeId] = useState<string>(
    resumes[0]?.id || ""
  );
  const [notes, setNotes] = useState("");

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) return;
    await onCreate({
      companyName: companyName.trim(),
      roleTitle: roleTitle.trim(),
      jobUrl: jobUrl.trim(),
      location: location.trim(),
      status,
      appliedDate,
      salaryRange: salaryRange.trim(),
      notes: notes.trim(),
      tailoredResumeId: tailoredResumeId || null,
    });
    setCompanyName("");
    setRoleTitle("");
    setJobUrl("");
    setLocation("");
    setSalaryRange("");
    setNotes("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Job Application Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track where each tailored CV was sent, interview stages, and notes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Table
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Application
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {COLUMNS.map((col) => {
            const items = applications.filter((a) => a.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3.5 flex flex-col min-h-[420px]"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${col.badgeClass}`}
                  >
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {items.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition space-y-2.5 shadow-xs hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {app.roleTitle}
                          </h4>
                          <div className="text-xs text-indigo-600 font-semibold flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            <span>{app.companyName}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDelete(app.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {app.tailoredResumeTitle && (
                        <div className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-700 font-medium flex items-center gap-1.5">
                          <FileCheck2 className="w-3 h-3 shrink-0 text-indigo-600" />
                          <span className="truncate">
                            CV: {app.tailoredResumeTitle}
                          </span>
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                          {app.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {app.appliedDate || "N/A"}
                        </span>
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline inline-flex items-center gap-0.5"
                          >
                            Posting <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      {/* Status Mover */}
                      <select
                        value={app.status}
                        onChange={(e) =>
                          onUpdate(app.id, {
                            status: e.target.value as ApplicationStatus,
                          })
                        }
                        className="w-full px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition cursor-pointer"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.status} value={c.status}>
                            Move to: {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/50">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/75">
                <th className="py-3.5 px-4 font-semibold">Company</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Tailored CV Used</th>
                <th className="py-3.5 px-4 font-semibold">Applied Date</th>
                <th className="py-3.5 px-4 font-semibold">Notes</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {app.companyName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{app.roleTitle}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        onUpdate(app.id, {
                          status: e.target.value as ApplicationStatus,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.status} value={c.status}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-indigo-600 font-medium">
                    {app.tailoredResumeTitle || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{app.appliedDate}</td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {app.notes}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(app.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No applications recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Application Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Log Job Application
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Tokopedia / Grab"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as ApplicationStatus)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                >
                  {COLUMNS.map((c) => (
                    <option key={c.status} value={c.status}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applied Date
                </label>
                <input
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Linked Tailored CV Version
                </label>
                <select
                  value={tailoredResumeId}
                  onChange={(e) => setTailoredResumeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                >
                  <option value="">— None —</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.atsAnalysis?.overallScore || 80}% ATS)
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Posting URL
                </label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Interview Progress
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
              >
                Save Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
