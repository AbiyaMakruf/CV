"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  FileText,
  Database,
  Target,
  Languages,
  Printer,
  Kanban,
  ShieldCheck,
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  ExternalLink,
  Menu,
  X,
  Star,
  Award,
  Zap,
  AlertCircle,
  FileCheck2,
  Layers,
  Lock,
  Search,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Cpu,
} from "lucide-react";

export interface LandingPageProps {
  onOpenStudio?: () => void;
  studioHref?: string;
}

export function LandingPage({
  onOpenStudio,
  studioHref = "/app",
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<
    "studio" | "xyz" | "comparison"
  >("studio");
  const [selectedTemplate, setSelectedTemplate] = useState<
    "harvard" | "modern" | "tech"
  >("harvard");
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  const handleCtaClick = (e: React.MouseEvent) => {
    if (onOpenStudio) {
      e.preventDefault();
      onOpenStudio();
    }
  };

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const copySampleCv = () => {
    const text = `ALEXANDER PRATAMA, S.Kom.
Jakarta, Indonesia | +62 812-3456-7890 | alex.pratama@email.com
linkedin.com/in/alexander-pratama | github.com/alexpratama

PROFESSIONAL SUMMARY
Senior Fullstack Engineer with 6+ years of experience engineering high-throughput distributed web systems, financial microservices, and cloud-native architectures. Track record of optimizing API latency by 42% and scaling platforms to 250,000+ daily active users using Go, Next.js, and PostgreSQL.

WORK EXPERIENCE
Senior Software Engineer | PT Tech Solusi Digital (2022 - Present)
- Architected high-throughput checkout microservice using Next.js, Node.js, and Go, reducing API response time by 42% and handling 150k+ daily transactions.
- Refactored monolithic relational queries with automated Redis caching, reducing PostgreSQL server load by 45% during peak flash-sale campaigns.
- Spearheaded CI/CD migration to automated Docker workflows on AWS EKS, shrinking deployment cycle times from 45 minutes to under 8 minutes.

Software Engineer | PT Finansial Pintar Indonesia (2019 - 2022)
- Engineered idempotent payment reconciliation engine processing $2.4M in monthly transactions with 99.98% audit precision.
- Designed 18+ high-volume RESTful APIs consumed by mobile and web frontends, maintaining 99.95% system uptime.

EDUCATION
Bachelor of Science in Computer Science | Universitas Indonesia (2015 - 2019)
- GPA: 3.84 / 4.00 (Cum Laude)

SKILLS & CERTIFICATIONS
- Languages: TypeScript, JavaScript, Go, Python, SQL
- Frameworks: React, Next.js, Node.js, Express, Tailwind CSS
- Databases & Cloud: PostgreSQL, Redis, Docker, AWS (ECS, S3), Git, CI/CD
- Certifications: AWS Certified Solutions Architect - Associate (2023)`;

    navigator.clipboard.writeText(text);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. STICKY NAVBAR */}
      {/* ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    ATS Studio
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  Resume Engineering & Matcher
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a
                href="#fitur"
                className="hover:text-indigo-600 transition-colors"
              >
                Fitur Utama
              </a>
              <a
                href="#cara-kerja"
                className="hover:text-indigo-600 transition-colors"
              >
                Cara Kerja
              </a>
              <a
                href="#template-ats"
                className="hover:text-indigo-600 transition-colors"
              >
                Template ATS
              </a>
              <a
                href="#perbandingan"
                className="hover:text-indigo-600 transition-colors"
              >
                Keunggulan
              </a>
              <a href="#faq" className="hover:text-indigo-600 transition-colors">
                FAQ
              </a>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setIsSampleModalOpen(true)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
              >
                Lihat Contoh
              </button>
              <Link
                href={studioHref}
                onClick={handleCtaClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all active:scale-[0.98]"
              >
                <span>Buka Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href={studioHref}
                onClick={handleCtaClick}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Buka Studio
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
              <a
                href="#fitur"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-50"
              >
                Fitur Utama
              </a>
              <a
                href="#cara-kerja"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-50"
              >
                Cara Kerja
              </a>
              <a
                href="#template-ats"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-50"
              >
                Template ATS
              </a>
              <a
                href="#perbandingan"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-50"
              >
                Keunggulan
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-50"
              >
                FAQ
              </a>
            </nav>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSampleModalOpen(true);
                }}
                className="w-full py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg text-center"
              >
                Lihat Contoh CV ATS
              </button>
              <Link
                href={studioHref}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleCtaClick(e);
                }}
                className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 text-center rounded-lg shadow-sm"
              >
                Mulai Sekarang Gratis
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. HERO SECTION */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-slate-200/80 bg-linear-to-b from-white via-slate-50/50 to-slate-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold shadow-xs mb-6">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>
                Rekayasa CV Standar Workday & Greenhouse • Bebas Halusinasi
              </span>
            </div>

            {/* Main H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Buat CV Standar ATS yang{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-indigo-800">
                Lolos Screening HR & AI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Bukan sekadar AI template biasa. Simpan Master Profile karier Anda,
              sesuaikan dengan Job Description dalam 1-klik, dan ekspor ke PDF
              vektor single-column 100% lolos uji ATS.
            </p>

            {/* Dual CTA buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href={studioHref}
                onClick={handleCtaClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Mulai Buat CV Gratis</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsSampleModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Lihat Contoh CV ATS</span>
              </button>
            </div>

            {/* Reassurance Micro-copy */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Tanpa Login Berbelit
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Data Aman Tersimpan Lokal
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Format PDF Vektor Resmi A4
              </span>
            </div>
          </div>

          {/* Trust stats counter */}
          <div className="mt-14 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                100%
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                Parseable ATS
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Workday, Greenhouse, Taleo
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                0%
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                Fabrikasi Data
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Anti halusinasi & rekayasa palsu
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Formula XYZ
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                Standar Google Inc.
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Accomplished X, by Y, via Z
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ID ➔ Global
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                Bilingual Translator
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Bhs Indonesia ke Executive English
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. LIVE INTERACTIVE PREVIEW MOCKUP SECTION */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              Antarmuka Studio yang Cepat, Bersih & Presisi
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Lihat bagaimana ATS Studio membedah Job Description, mencocokkan
              kata kunci, dan merekayasa resume single-column berkualitas tinggi.
            </p>

            {/* Interactive Mode Tabs */}
            <div className="mt-6 inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setActivePreviewTab("studio")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activePreviewTab === "studio"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Split-Screen Studio Mockup
              </button>
              <button
                onClick={() => setActivePreviewTab("xyz")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activePreviewTab === "xyz"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Formula XYZ & Translator
              </button>
              <button
                onClick={() => setActivePreviewTab("comparison")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activePreviewTab === "comparison"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Format ATS vs. CV Grafis
              </button>
            </div>
          </div>

          {/* Interactive Container */}
          <div className="max-w-5xl mx-auto">
            {activePreviewTab === "studio" && (
              <div className="bg-slate-900/5 p-2 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xl">
                {/* Mockup Window Chrome */}
                <div className="bg-slate-800 text-slate-200 px-4 py-2.5 rounded-t-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    </div>
                    <span className="text-slate-400 font-mono text-[11px] ml-2">
                      ATS Studio — Target: Senior Software Engineer @ GoTo /
                      Shopee
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Workday Ready
                    </span>
                  </div>
                </div>

                {/* Studio Mockup Body */}
                <div className="bg-slate-50 border-x border-b border-slate-200 rounded-b-xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: ATS Analysis & Matcher */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Score Card */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Skor Kecocokan ATS
                          </span>
                          <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
                            94
                            <span className="text-base font-normal text-slate-500">
                              /100
                            </span>
                          </div>
                        </div>
                        <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> High Match
                        </div>
                      </div>

                      {/* Mini Progress bars */}
                      <div className="mt-4 space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between text-slate-600 font-medium mb-1">
                            <span>Keyword Relevance</span>
                            <span className="font-semibold text-slate-900">
                              96%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-1.5 rounded-full w-[96%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-slate-600 font-medium mb-1">
                            <span>Google XYZ Impact Metrics</span>
                            <span className="font-semibold text-slate-900">
                              91%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-1.5 rounded-full w-[91%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-slate-600 font-medium mb-1">
                            <span>Single-Column Layout Compliance</span>
                            <span className="font-semibold text-slate-900">
                              100%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-1.5 rounded-full w-[100%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Extracted Matched Keywords */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-indigo-600" />
                          Kata Kunci Teridentifikasi
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          8 Cocok
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[
                          "Next.js",
                          "TypeScript",
                          "Microservices",
                          "PostgreSQL",
                          "Redis",
                          "CI/CD Pipeline",
                          "Docker",
                          "RESTful API",
                        ].map((kw) => (
                          <span
                            key={kw}
                            className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                          >
                            <Check className="w-2.5 h-2.5" />
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* Missing Critical Keywords alert */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-medium text-amber-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Saran tambahan: AWS S3, Kubernetes
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Button in Mockup */}
                    <Link
                      href={studioHref}
                      onClick={handleCtaClick}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Coba Sesuaikan CV Anda Sekarang</span>
                    </Link>
                  </div>

                  {/* Right Column: Live Harvard Clean Sheet Mockup */}
                  <div className="lg:col-span-7 bg-white border border-slate-300 rounded-xl p-5 sm:p-6 shadow-sm text-slate-900 font-serif leading-relaxed">
                    <div className="border-b border-slate-800 pb-2 mb-3 text-center">
                      <div className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                        ALEXANDER PRATAMA, S.Kom.
                      </div>
                      <div className="text-[11px] text-slate-600 font-sans mt-0.5 flex flex-wrap justify-center gap-x-2">
                        <span>Jakarta, Indonesia</span>
                        <span>•</span>
                        <span>+62 812-3456-7890</span>
                        <span>•</span>
                        <span>alex.pratama@email.com</span>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">
                          linkedin.com/in/alexpratama
                        </span>
                      </div>
                    </div>

                    {/* Experience section */}
                    <div className="mb-4">
                      <div className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-0.5 mb-1.5 font-sans">
                        Work Experience
                      </div>
                      <div className="text-xs">
                        <div className="flex justify-between font-sans font-bold">
                          <span>Senior Software Engineer</span>
                          <span className="text-slate-600 font-normal">
                            2022 – Present
                          </span>
                        </div>
                        <div className="text-slate-600 italic text-[11px] font-sans mb-1">
                          PT Tech Solusi Nusantara — Jakarta, ID
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-800">
                          <li>
                            Architected and deployed high-throughput checkout
                            microservice using{" "}
                            <strong className="font-semibold text-indigo-700 bg-indigo-50/60 px-0.5 rounded">
                              Next.js & Go
                            </strong>
                            , reducing latency by 42% and processing 150k+ daily
                            transactions.
                          </li>
                          <li>
                            Refactored relational queries with automated{" "}
                            <strong className="font-semibold text-indigo-700 bg-indigo-50/60 px-0.5 rounded">
                              Redis caching
                            </strong>
                            , cutting server resource costs by 45% during peak
                            traffic.
                          </li>
                          <li>
                            Implemented robust automated testing via GitHub
                            Actions CI/CD, boosting test coverage from 44% to
                            89%.
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Skills section */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-0.5 mb-1 font-sans">
                        Technical Skills
                      </div>
                      <div className="text-[11px] space-y-0.5 font-sans">
                        <div>
                          <strong className="font-semibold">
                            Core Tech Stack:
                          </strong>{" "}
                          TypeScript, Next.js, React, Node.js, Go, PostgreSQL,
                          Redis, Docker
                        </div>
                        <div>
                          <strong className="font-semibold">
                            Cloud & Architecture:
                          </strong>{" "}
                          AWS (EKS, S3), CI/CD, Microservices, Event-Driven
                          Design
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === "xyz" && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
                <div className="max-w-2xl mx-auto text-center mb-8">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-semibold mb-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Formula XYZ Standar Google Executive
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Transformasi Pengalaman Menjadi Nilai Terukur
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Bukan sekadar daftar tugas biasa. Ubah kalimat pasif menjadi
                    pencapaian dengan formula:{" "}
                    <em>Accomplished [X] as measured by [Y] by doing [Z]</em>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before card */}
                  <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1.5">
                        <X className="w-4 h-4 text-rose-500" />
                        Sebelumnya (Biasa & Lemah)
                      </span>
                      <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px]">
                        Kurang Terukur
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 italic border-l-2 border-rose-300 pl-3 py-1">
                      &quot;Membantu membuat fitur pembayaran website toko online
                      dan memperbaiki bug agar tidak lambat.&quot;
                    </p>
                    <div className="mt-4 text-xs text-rose-800 space-y-1">
                      <div className="flex items-center gap-1">
                        • Tidak ada metrik persentase peningkatan
                      </div>
                      <div className="flex items-center gap-1">
                        • Action verb lemah (&quot;membantu&quot;)
                      </div>
                      <div className="flex items-center gap-1">
                        • Tidak menyebutkan teknologi spesifik
                      </div>
                    </div>
                  </div>

                  {/* After card */}
                  <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Setelah ATS Studio (Executive English)
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                        Google XYZ Ready
                      </span>
                    </div>
                    <p className="text-sm text-slate-900 font-medium border-l-2 border-emerald-400 pl-3 py-1">
                      &quot;Engineered high-concurrency payment microservice
                      handling 150k+ daily transactions, slashing latency by 42%
                      via Next.js and Redis connection pooling.&quot;
                    </p>
                    <div className="mt-4 text-xs text-emerald-800 space-y-1">
                      <div className="flex items-center gap-1">
                        ✓ Action verb kuat: <em>Engineered</em>
                      </div>
                      <div className="flex items-center gap-1">
                        ✓ Metrik dampak terukur: <em>150k+ daily, -42% latency</em>
                      </div>
                      <div className="flex items-center gap-1">
                        ✓ Keyword industri: <em>Next.js, Redis, Microservice</em>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === "comparison" && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
                <div className="text-center max-w-xl mx-auto mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Mengapa CV Berdesain Rumit Sering Gagal di ATS?
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Robot ATS membaca dokumen secara linear (kiri ke kanan).
                    Elemen grafis dan kolom ganda membuat teks bertabrakan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-3">
                      <AlertCircle className="w-4 h-4" />
                      CV Canva / Desain 2-Kolom Grafis
                    </div>
                    <ul className="text-xs text-slate-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                        <span>
                          Kolom ganda membuat urutan baca ATS tercampur
                          berantakan.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                        <span>
                          Grafik skill rating (misal bintang 5/5) tidak terbaca
                          sebagai teks skill.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                        <span>
                          Export PDF sering berupa gambar/raster bukan font
                          vektor asli.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-emerald-300 rounded-xl p-5 bg-emerald-50/30">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ATS Resume Studio (Single-Column Vector)
                    </div>
                    <ul className="text-xs text-slate-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>
                          100% single-column layout terbaca runtut oleh Workday
                          & Greenhouse.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>
                          Font standar teruji (Calibri, Arial, Garamond,
                          Helvetica).
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>
                          PDF teks vektor murni (selectable & searchable text)
                          ukuran A4 standar.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. CORE FEATURES GRID */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="fitur" className="py-16 sm:py-24 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Fitur Lengkap Dirancang untuk Profesional
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Semua yang Anda Butuhkan untuk Menembus Filter HR
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Dibangun dengan pendekatan arsitektur karier modern. Bukan sekadar
              tebak-tebakan kata kunci.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                1. Master Career Repository
              </h3>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mt-1">
                Single Source of Truth
              </p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Simpan seluruh riwayat karier, proyek, sertifikasi, dan
                keterampilan Anda di satu tempat yang aman. Tidak perlu lagi
                mengetik ulang riwayat hidup dari nol untuk setiap lamaran kerja.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                2. One-Click Vacancy Matcher
              </h3>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mt-1">
                JD Parsing & Keyword Extraction
              </p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Cukup tempelkan teks deskripsi pekerjaan (Job Description). AI
                otomatis membedah kualifikasi utama, hard skills yang
                disyaratkan, dan menyesuaikan fokus resume dalam hitungan detik.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Formula XYZ & AI Translator
              </h3>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mt-1">
                ID ➔ Executive English
              </p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Ubah catatan pengalaman kerja berbahasa Indonesia sehari-hari
                menjadi bullet point Bahasa Inggris eksekutif berstandar Google:{" "}
                <em>Accomplished [X] as measured by [Y] by doing [Z]</em>.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                4. ATS Compatibility & Gap Scorer
              </h3>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mt-1">
                0-100% Score & Red Flag Detector
              </p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Evaluasi instan sebelum Anda melamar. Deteksi kata kunci yang
                terlewat, perbaiki kalimat pasif yang lemah, dan pastikan tidak
                ada format yang memicu penolakan otomatis oleh sistem ATS.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                5. Selectable Vector PDF Export
              </h3>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mt-1">
                Harvard, Modern & Tech Clean
              </p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Pilih format teruji Harvard Academic, Modern Minimalist, atau
                Tech Clean. Dicetak langsung dengan standar browser print engine
                ke PDF vektor murni ukuran A4 (bukan screenshot gambar).
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                6. Job Application Tracker
              </h3>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mt-1">
                Kanban Pipeline Terintegrasi
              </p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Pantau setiap tahapan lamaran (Wishlist, Applied, Interview,
                Offer, Rejected). Setiap kartu terhubung langsung dengan versi CV
                yang Anda kirimkan ke perusahaan tersebut.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. INTERACTIVE ATS TEMPLATE COMPARISON */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section
        id="template-ats"
        className="py-16 sm:py-24 bg-white border-y border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-semibold mb-3">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Format Standar Industri Global
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              3 Template Presisi 100% Lolos Parsing ATS
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Seluruh template mengikuti struktur single-column linear ketat tanpa
              tabel bertumpuk, sehingga 100% kompatibel dengan sistem Workday,
              Taleo, Greenhouse, dan Lever.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left selector */}
            <div className="lg:col-span-5 space-y-3">
              <button
                onClick={() => setSelectedTemplate("harvard")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  selectedTemplate === "harvard"
                    ? "bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base">
                    Harvard Academic Standard
                  </span>
                  {selectedTemplate === "harvard" && (
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Format paling otoritatif dan konservatif. Menggunakan garis
                  pemisah tegas dan tipografi klasik. Sangat disukai untuk
                  manajemen, konsultan, finance, dan enterprise.
                </p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span>Font: Garamond / Times</span>
                  <span>•</span>
                  <span>Header: Garis Solid Hitam</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("modern")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  selectedTemplate === "modern"
                    ? "bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base">
                    Modern Minimalist
                  </span>
                  {selectedTemplate === "modern" && (
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Desain bersih kontemporer dengan hierarki visual modern dan
                  jarak whitespace seimbang. Cocok untuk produk, tech startup,
                  dan corporate modern.
                </p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span>Font: Calibri / Arial</span>
                  <span>•</span>
                  <span>Header: Slate Divider</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedTemplate("tech")}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  selectedTemplate === "tech"
                    ? "bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base">
                    Tech Clean Engineer
                  </span>
                  {selectedTemplate === "tech" && (
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Kepadatan informasi tinggi yang memprioritaskan kategori skill
                  teknis, repo GitHub, dan metrik kinerja sistem. Standar
                  favorit Silicon Valley & tech unicorns.
                </p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span>Font: Helvetica / Arial</span>
                  <span>•</span>
                  <span>Badge Tech Stack Eksplisit</span>
                </div>
              </button>
            </div>

            {/* Right live preview */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Printer className="w-4 h-4 text-indigo-600" />
                  Pratinjau Lembar A4 (Single-Column)
                </div>
                <div className="text-xs text-slate-500">
                  Rasio Standar Cetak 210 × 297 mm
                </div>
              </div>

              {/* Simulated Sheet */}
              <div
                className={`bg-white border border-slate-300 p-6 sm:p-8 rounded-lg shadow-sm ${
                  selectedTemplate === "harvard"
                    ? "font-serif text-slate-900"
                    : "font-sans text-slate-900"
                }`}
              >
                {/* Header */}
                <div
                  className={`text-center pb-3 mb-4 ${
                    selectedTemplate === "harvard"
                      ? "border-b border-slate-900"
                      : selectedTemplate === "modern"
                      ? "border-b-2 border-slate-800"
                      : "border-b border-slate-300"
                  }`}
                >
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                    ALEXANDER PRATAMA
                  </h3>
                  <div className="text-xs text-slate-600 mt-1 flex flex-wrap justify-center gap-x-2">
                    <span>Jakarta, Indonesia</span>
                    <span>•</span>
                    <span>alex.pratama@email.com</span>
                    <span>•</span>
                    <span>+62 812-3456-7890</span>
                    <span>•</span>
                    <span className="text-indigo-600">
                      linkedin.com/in/alexpratama
                    </span>
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <div
                    className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                      selectedTemplate === "harvard"
                        ? "border-b border-slate-900 pb-0.5"
                        : selectedTemplate === "modern"
                        ? "border-b-1.5 border-slate-700 pb-1"
                        : "bg-slate-100 px-2 py-0.5 rounded text-slate-800"
                    }`}
                  >
                    Experience
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Senior Backend Engineer — FinTech Corp</span>
                      <span className="text-slate-600 font-normal">
                        2022 - Present
                      </span>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-[11.5px]">
                      <li>
                        Architected high-throughput payment settlement engine
                        processing $3.2M daily GMV with zero downtime.
                      </li>
                      <li>
                        Cut database CPU utilization from 78% to 32% by
                        introducing Redis caching cluster and index tuning.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div
                    className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${
                      selectedTemplate === "harvard"
                        ? "border-b border-slate-900 pb-0.5"
                        : selectedTemplate === "modern"
                        ? "border-b-1.5 border-slate-700 pb-1"
                        : "bg-slate-100 px-2 py-0.5 rounded text-slate-800"
                    }`}
                  >
                    Technical Competencies
                  </div>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    <strong>Languages & Frameworks:</strong> TypeScript, Go,
                    Python, Next.js, Node.js, PostgreSQL, Redis, Docker, AWS
                    (ECS, S3).
                  </p>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Tersedia di editor ATS Resume Studio
                </span>
                <Link
                  href={studioHref}
                  onClick={handleCtaClick}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Gunakan Template Ini <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. HOW IT WORKS (CARA KERJA - 3 LANGKAH) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="cara-kerja" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-semibold mb-3">
              <CheckCheck className="w-3.5 h-3.5 text-indigo-600" />
              Alur Kerja 3 Langkah
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Dari Profil Karier ke CV Siap Kirim dalam 2 Menit
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Proses rekayasa CV yang terstruktur, cepat, dan sepenuhnya berada
              di bawah kendali Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Masukkan Profil Karier
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Import CV lama Anda dalam format PDF/DOCX atau isi langsung ke
                Master Profile. Simpan pengalaman, pendidikan, dan proyek Anda
                sekali untuk selamanya.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Tempel Deskripsi Pekerjaan (JD)
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Salin lowongan kerja target Anda. Engine ATS kami langsung
                mengekstrak kata kunci wajib, mendeteksi kesenjangan skill, dan
                merekomendasikan penyesuaian.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Review & Ekspor PDF A4
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Review skor ATS, poles bullet point dengan Formula Google XYZ,
                dan langsung cetak dokumen PDF vektor standar A4 yang siap lolos
                Workday & Greenhouse.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href={studioHref}
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
            >
              <span>Mulai Tahap 1 Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. COMPARISON TABLE: CV BIASA VS ATS STUDIO */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="perbandingan" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Perbandingan: Mengapa ATS Studio Berbeda
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Bukan sekadar prompt ChatGPT lepas atau software desain visual yang
              malah merusak format parsing.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Parameter Evaluasi</th>
                  <th className="p-4 sm:p-5 text-slate-500">
                    Template Grafis (Canva)
                  </th>
                  <th className="p-4 sm:p-5 text-slate-500">
                    Prompt AI Biasa (ChatGPT)
                  </th>
                  <th className="p-4 sm:p-5 text-indigo-700 bg-indigo-50/70">
                    ATS Resume Studio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Kompatibilitas Workday / ATS
                  </td>
                  <td className="p-4 sm:p-5 text-rose-600">
                    Rendah (Teks tumpang tindih)
                  </td>
                  <td className="p-4 sm:p-5 text-amber-600">
                    Tidak Terjamin (Raw text)
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-indigo-50/30">
                    100% Single-Column Teruji
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Pencegahan Halusinasi AI
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">N/A (Manual)</td>
                  <td className="p-4 sm:p-5 text-rose-600">
                    Sering mengarang pengalaman
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-indigo-50/30">
                    Zero Hallucination (Hanya Data Asli)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Ekstraksi Kata Kunci JD
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">Tidak ada</td>
                  <td className="p-4 sm:p-5 text-amber-600">Manual per prompt</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-indigo-50/30">
                    Otomatis 1-Klik & Gap Score
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Formula Google XYZ
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">Tidak ada</td>
                  <td className="p-4 sm:p-5 text-amber-600">
                    Harus dipandu berulang kali
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-indigo-50/30">
                    Built-in Otomatis
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Format Ekspor PDF
                  </td>
                  <td className="p-4 sm:p-5 text-amber-600">
                    Sering berupa bitmap/raster
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">Copy paste teks</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-indigo-50/30">
                    Vektor PDF Cetak A4 Asli
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">
                    Pipeline Pelacak Lamaran
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">Tidak ada</td>
                  <td className="p-4 sm:p-5 text-slate-400">Tidak ada</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-indigo-50/30">
                    Kanban Board Terintegrasi
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 8. FAQ SECTION */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Jawaban transparan seputar cara kerja sistem ATS, keamanan data,
              dan ekspor resume.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Mengapa CV format dua kolom atau grafis sering ditolak sistem ATS?",
                a: "Aplikasi ATS (Applicant Tracking System) seperti Workday, Taleo, dan Greenhouse membaca file secara linear (dari kiri atas terus ke bawah). Ketika resume menggunakan layout dua kolom atau tabel visual yang kompleks, teks dari kolom kanan dan kiri sering tertumpuk dalam satu baris, membuat pengalaman kerja Anda terbaca rancu atau bahkan gagal diparsing sama sekali.",
              },
              {
                q: "Apakah data riwayat karier saya aman?",
                a: "Sangat aman. Seluruh data riwayat profil karier Anda disimpan di perangkat lokal (browser Anda) dan database lokal proyek Anda. Kami tidak menjual riwayat karier Anda ke pihak ketiga maupun menggunakannya untuk melatih model publik.",
              },
              {
                q: "Apakah fitur AI akan mengarang pengalaman palsu (halusinasi)?",
                a: "Tidak. Kami menerapkan prinsip ketat Zero Hallucination. AI kami diprogram khusus hanya untuk merekayasa struktur kalimat dari pengalaman asli Anda agar sesuai dengan Google XYZ Formula dan kata kunci lowongan, tanpa pernah menambahkan perusahaan palsu atau gelar yang tidak Anda miliki.",
              },
              {
                q: "Bagaimana cara kerja terjemahan Bahasa Indonesia ke Executive English?",
                a: "Sistem mengenali konteks pengalaman kerja lokal di Indonesia (misal: memimpin proyek, membuat backend, mengelola klien) dan mengonversinya ke dalam action verbs bahasa Inggris yang umum digunakan pada standar rekruitmen teknologi global seperti 'Spearheaded', 'Architected', 'Orchestrated', dan 'Delivered'.",
              },
              {
                q: "Apakah hasil ekspor berupa file PDF vektor asli?",
                a: "Ya. Kami menggunakan mesin print engine browser standar yang menghasilkan PDF berbasis teks vektor (selectable text, font embedding murni, ukuran A4 pas 1 lembar), bukan tangkapan layar gambar atau raster yang tidak bisa dibaca oleh robot ATS.",
              },
              {
                q: "Apakah saya bisa menyimpan lebih dari satu versi CV untuk pekerjaan berbeda?",
                a: "Tentu saja. Anda memiliki satu Master Career Profile sebagai sumber utama, lalu Anda dapat membuat puluhan variasi Tailored CV yang masing-masing dioptimalkan untuk lowongan kerja spesifik.",
              },
            ].map((faq, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 9. BOTTOM CTA BANNER */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-linear-to-b from-white to-slate-100 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                100% Free & Open To Customize
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Siap Menembus Screening HR & Menangkan Wawancara Pertama Anda?
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                Tinggalkan format Canva yang rentan eror. Buat Master Profile Anda
                sekarang dan sesuaikan dengan lowongan kerja impian dalam 1-klik.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={studioHref}
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.99]"
                >
                  <span>Buka Studio Sekarang</span>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </Link>
                <button
                  onClick={() => setIsSampleModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
                >
                  Lihat Contoh CV Resmi
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 10. FOOTER */}
      {/* ──────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900">
                ATS Resume Studio
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500">
                Designed for Indonesian & Global Tech Talent
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
              <a href="#fitur" className="hover:text-indigo-600">
                Fitur
              </a>
              <a href="#cara-kerja" className="hover:text-indigo-600">
                Cara Kerja
              </a>
              <a href="#template-ats" className="hover:text-indigo-600">
                Template ATS
              </a>
              <a href="#perbandingan" className="hover:text-indigo-600">
                Keunggulan
              </a>
              <a href="#faq" className="hover:text-indigo-600">
                FAQ
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <div>
              &copy; {new Date().getFullYear()} ATS Resume Studio. All rights
              reserved.
            </div>
            <div>
              100% Single-Column Linear Compliance • Workday & Greenhouse
              Compatible
            </div>
          </div>
        </div>
      </footer>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SAMPLE ATS CV MODAL */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isSampleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Contoh CV Standar ATS (Harvard Single-Column)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySampleCv}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                >
                  {copiedSample ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      Salin Teks
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsSampleModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
                  aria-label="Tutup modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: A4 Sheet Preview */}
            <div className="p-6 overflow-y-auto space-y-4 bg-slate-100/50">
              <div className="bg-white p-8 rounded-xl border border-slate-300 shadow-sm font-serif text-slate-900 text-xs leading-relaxed max-w-2xl mx-auto">
                <div className="text-center border-b border-slate-900 pb-2 mb-3">
                  <div className="text-xl font-bold font-sans tracking-tight">
                    ALEXANDER PRATAMA, S.Kom.
                  </div>
                  <div className="text-[11px] text-slate-600 font-sans mt-0.5">
                    Jakarta, Indonesia | +62 812-3456-7890 |
                    alex.pratama@email.com | linkedin.com/in/alexpratama |
                    github.com/alexpratama
                  </div>
                </div>

                <div className="mb-3">
                  <div className="font-sans font-bold text-xs uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1">
                    Professional Summary
                  </div>
                  <p className="text-[11px] text-slate-800">
                    Senior Fullstack Engineer with 6+ years of experience
                    engineering high-throughput distributed web systems,
                    financial microservices, and cloud-native architectures.
                    Track record of optimizing API latency by 42% and scaling
                    platforms to 250,000+ daily active users using Go, Next.js,
                    and PostgreSQL.
                  </p>
                </div>

                <div className="mb-3">
                  <div className="font-sans font-bold text-xs uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1.5">
                    Work Experience
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between font-sans font-bold">
                        <span>Senior Software Engineer</span>
                        <span className="text-slate-600 font-normal">
                          2022 - Present
                        </span>
                      </div>
                      <div className="text-slate-600 italic text-[10.5px] font-sans mb-0.5">
                        PT Tech Solusi Digital — Jakarta, Indonesia
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-800">
                        <li>
                          Architected high-throughput checkout microservice
                          using Next.js, Node.js, and Go, reducing API response
                          time by 42% and handling 150k+ daily transactions.
                        </li>
                        <li>
                          Refactored monolithic relational queries with automated
                          Redis caching, reducing PostgreSQL server load by 45%
                          during peak flash-sale campaigns.
                        </li>
                        <li>
                          Spearheaded CI/CD migration to automated Docker
                          workflows on AWS EKS, shrinking deployment cycle times
                          from 45 minutes to under 8 minutes.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex justify-between font-sans font-bold">
                        <span>Software Engineer</span>
                        <span className="text-slate-600 font-normal">
                          2019 - 2022
                        </span>
                      </div>
                      <div className="text-slate-600 italic text-[10.5px] font-sans mb-0.5">
                        PT Finansial Pintar Indonesia — Jakarta, Indonesia
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-800">
                        <li>
                          Engineered idempotent payment reconciliation engine
                          processing $2.4M in monthly transactions with 99.98%
                          audit precision.
                        </li>
                        <li>
                          Designed 18+ high-volume RESTful APIs consumed by
                          mobile and web frontends, maintaining 99.95% system
                          uptime.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="font-sans font-bold text-xs uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1">
                    Education
                  </div>
                  <div className="flex justify-between font-sans font-bold text-[11px]">
                    <span>Universitas Indonesia — Bachelor of Computer Science</span>
                    <span className="text-slate-600 font-normal">
                      2015 - 2019
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-600 font-sans">
                    GPA: 3.84 / 4.00 (Cum Laude)
                  </div>
                </div>

                <div>
                  <div className="font-sans font-bold text-xs uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1">
                    Technical Skills & Certifications
                  </div>
                  <div className="font-sans text-[11px] text-slate-800 space-y-0.5">
                    <div>
                      <strong>Languages & Frameworks:</strong> TypeScript, Go,
                      Python, React, Next.js, Node.js, Express, PostgreSQL,
                      Redis
                    </div>
                    <div>
                      <strong>Cloud & Tooling:</strong> Docker, Kubernetes, AWS
                      (ECS, S3), Git, CI/CD GitHub Actions
                    </div>
                    <div>
                      <strong>Certification:</strong> AWS Certified Solutions
                      Architect - Associate (2023)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Format 100% kompatibel dengan Workday, Greenhouse & Taleo
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSampleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Tutup
                </button>
                <Link
                  href={studioHref}
                  onClick={(e) => {
                    setIsSampleModalOpen(false);
                    handleCtaClick(e);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Gunakan Format Ini di Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
