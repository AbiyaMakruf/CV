"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  Languages,
  Wand2,
  Printer,
  Kanban,
  Database,
  Zap,
  Check,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs transition group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  ATS Resume Studio
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Gemini AI
                </span>
              </div>
            </div>
          </Link>

          {/* Links & Primary CTA */}
          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <a href="#features" className="hover:text-slate-900 transition">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-slate-900 transition">
                How It Works
              </a>
              <a href="#ats-rules" className="hover:text-slate-900 transition">
                ATS Guidelines
              </a>
            </nav>

            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-16 sm:pt-24 pb-16 max-w-5xl mx-auto text-center">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[600px] h-[300px] bg-indigo-200/50 rounded-full blur-3xl"></div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Self-Hosted & Privacy-First ATS Career Workspace</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Craft Job-Winning Resumes That{" "}
          <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">
            ATS Algorithms
          </span>{" "}
          & Recruiters Love
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Store your complete career once. Tailor targeted CVs for any job
          description in one click, translate Indonesian career history into
          high-impact English, and export strict single-column vector PDFs.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
          >
            <span>Open Studio Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#preview"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition"
          >
            <span>Explore Features & Architecture</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% ATS-Compliant Layout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Google XYZ Formula Rewrites</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Local SQLite Privacy (No Tracking)</span>
          </div>
        </div>
      </section>

      {/* Interactive UI Mockup / Showcase Section */}
      <section id="preview" className="px-4 sm:px-8 py-10 max-w-6xl mx-auto w-full">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Live Studio Architecture
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                From Raw Job Description to 95% ATS Match in Seconds
              </h2>
            </div>
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              <span>Try Live in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
            {/* Left Box: Feature Highlights */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                    <Wand2 className="w-4 h-4 text-indigo-600" />
                    <span>1-Click Vacancy Tailoring</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Paste any job description or URL. Gemini scans requirements,
                    identifies keyword overlaps, and selects your most relevant
                    experiences.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <Languages className="w-4 h-4 text-emerald-600" />
                    <span>ID → EN Translation Engine</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Write in Indonesian freely. The studio translates your
                    career bullets into active, executive English favored by
                    global tech recruiters.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Google XYZ Formula Enhancer</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Converts weak passive statements (&ldquo;Responsible for API
                    work&rdquo;) into quantified accomplishments (&ldquo;Accomplished
                    [X] as measured by [Y], by doing [Z]&rdquo;).
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/app"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
                >
                  <span>Open Full Application Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Box: Live ATS Score Preview Card */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center font-extrabold text-emerald-700 text-sm">
                    <span>94%</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider">
                      ATS
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Senior Full-Stack Engineer — Grab / GoTo
                    </h3>
                    <p className="text-xs text-slate-500">
                      Collection: Full-Stack & AI • Harvard Academic Format
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
                  Ready to Apply
                </span>
              </div>

              {/* Matched Keywords sample */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Matched Job Description Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Next.js 15",
                    "TypeScript",
                    "PostgreSQL",
                    "System Architecture",
                    "Microservices",
                    "CI/CD Pipelines",
                    "REST APIs",
                    "High Concurrency",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-2xs"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Measurable Impact Rewrite Sample */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Measurable Impact XYZ Formulation
                </span>
                <p className="text-xs text-slate-400 line-through">
                  &ldquo;Membantu mengurus database dan backend service
                  perusahaan.&rdquo;
                </p>
                <p className="text-xs text-slate-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg font-medium leading-relaxed">
                  <strong>XYZ Rewrite:</strong> Architected and optimized
                  PostgreSQL database indexing and caching, decreasing average
                  API latency by 42% across 2.5M daily transactions.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                <span>Standard Font: Calibri / Arial</span>
                <span className="text-emerald-700 font-semibold">
                  ✓ Strict Single-Column Vector Print
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="px-4 sm:px-8 py-16 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Engineered for Precision
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Everything You Need to Beat the 75% ATS Rejection Rate
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Most resumes fail ATS screening due to table formatting, multi-column
            layouts, missing keywords, and unquantified duties. ATS Resume Studio
            eliminates every single failure point.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Master Career Profile
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Store your complete employment history, projects, skills, and
              achievements in one central repository. Write naturally in
              Indonesian or English.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1-Click Vacancy Tailoring
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paste a target job description. The AI creates a tailored version
              matching the exact requirements and re-scores keyword alignment.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Vector ATS A4 PDF Export
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict single-column layout with standard fonts (Calibri, Arial,
              Garamond) and zero HTML tables, ensuring 100% text readability by
              Workday, Taleo, and Greenhouse.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Indonesian → English Translation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inline one-click translation transforms Indonesian job titles and
              bullet descriptions into international corporate standard English.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Kanban className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Application Tracker Kanban
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track which tailored CV version you sent to each company, stage
              status (Wishlist, Applied, Interview, Offer), and interview notes.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Self-Hosted & Private
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Runs locally on SQLite. No third-party account required. Your
              career data never leaves your computer except to your own direct
              Gemini API key.
            </p>
          </div>
        </div>
      </section>

      {/* Strict ATS Rules Comparison Section */}
      <section id="ats-rules" className="px-4 sm:px-8 py-14 max-w-5xl mx-auto w-full">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center">
            Why Generic Resume Builders Fail ATS Scanners
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 text-center max-w-xl mx-auto mt-2">
            Modern corporate applicant tracking systems parse text linearly.
            Graphics, two-column sidebars, and skill bars cause parser crashes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
              <h3 className="text-sm font-bold text-rose-800 flex items-center gap-1.5">
                ✕ What Breaks ATS Parsers
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Two-column layouts that scramble reading order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>HTML tables, text boxes, and floating graphic shapes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Skill progress bars or percentage ratings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Raster image PDFs that cannot be selected as vector text</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                ✓ What ATS Resume Studio Guarantees
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Strict single-column top-to-bottom layout hierarchy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>100% selectable vector text output formatted for A4</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Standard web-safe fonts (Calibri, Arial, Helvetica, Garamond)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Categorized skill keywords recognized by recruiter queries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-8 py-16 max-w-4xl mx-auto w-full text-center">
        <div className="bg-indigo-600 text-white rounded-3xl p-8 sm:p-12 shadow-sm space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Start Crafting Your Tailored ATS Resumes Today
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto leading-relaxed">
            Import your existing CV or start fresh. Free, open, self-hosted, and
            designed for real career advancement.
          </p>
          <div className="pt-4">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-white text-indigo-600 hover:bg-slate-50 shadow-sm transition"
            >
              <span>Launch ATS Studio Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} ATS Resume Studio. Free & Self-Hosted
            Career Builder.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/app" className="text-indigo-600 hover:underline font-semibold">
              Open App Workspace
            </Link>
            <span>•</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-800 transition"
            >
              Gemini API Key
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
