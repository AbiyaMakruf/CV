# AGENT.md — AI Coding Agent & Developer Guide

Dokumen ini merupakan panduan arsitektur, konvensi kode, dan instruksi operasional untuk AI Agent (Antigravity, Cursor, Copilot, Claude, dll.) maupun developer yang bekerja pada repositori **Personal AI-Powered ATS Resume Builder (`ATS Resume Studio`)**.

---

## 1. Gambaran Umum Proyek (Project Context)

**ATS Resume Studio** adalah aplikasi web *full-stack* dan *self-hosted* untuk mengelola **Master Career Profile** (*Single Source of Truth*) serta menghasilkan **Tailored ATS-Friendly CV** dan **Cover Letter** secara dinamis untuk lowongan kerja tertentu menggunakan **Google Gemini API (`@google/genai`)**.

### Fitur Utama yang Harus Dijaga:
1. **Master Career Repository**: Menyimpan seluruh riwayat karier (Personal Info, Work Experience, Projects, Education, Certifications, Categorized Skills, Publications, Honors/Awards, Volunteer). Mendukung input **Bahasa Indonesia** maupun **Bahasa Inggris**.
2. **Inline Gemini AI Optimization**: Tombol AI kontekstual di setiap *summary* dan *bullet point* untuk mengubah kalimat menjadi **Formula XYZ** (*Accomplished [X] as measured by [Y], by doing [Z]*) serta menerjemahkan Bahasa Indonesia ke Bahasa Inggris profesional (*ID → EN Translate*).
3. **Legacy CV Extraction & Ingestion**: Ekstraksi dokumen CV lama (`.pdf`, `.docx`, `.png`, `.jpg`, `.txt`) menggunakan Gemini Multimodal API & `mammoth` ke dalam skema JSON terstruktur dengan modal *Review & Smart Merge* (mencegah duplikasi data).
4. **One-Click CV Tailoring & Vacancy Matcher**: Menganalisis *Job Description (JD)* atau *Job URL*, memilih pengalaman/proyek paling relevan dari Master Profile, menulis ulang *bullet points* tanpa fabrikasi (*100% honest*), dan menghitung skor kecocokan ATS (0–100%).
5. **ATS Score & Keyword Gap Analyzer**: Menampilkan *Matched Keywords*, *Missing Critical Keywords* (dengan tombol *1-click Add to Skills*), deteksi *Weak Bullets* (kurang metrik/angka) beserta saran perbaikan otomatis, dan *Red Flags*.
6. **Single-Column Selectable Vector PDF Export**: Menyediakan 3 template ATS standar (*Harvard Academic*, *Modern Minimalist*, *Tech Clean*) dengan font standar (`Calibri`, `Arial`, `Helvetica`, `Garamond`, `Times New Roman`) yang diekspor sebagai teks vektor yang 100% *selectable* (bukan gambar/raster).
7. **Application Tracker & Full JSON Backup**: Pelacak lamaran kerja model Kanban & Tabel yang terhubung ke versi CV spesifik, serta fitur *Export/Import Full JSON Backup*.

---

## 2. Tech Stack & Struktur Direktori

- **Framework**: Next.js 15 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + CSS Print Media Queries (`@media print`) untuk ekspor PDF A4 presisi
- **Database**: SQLite dengan Prisma ORM (`prisma/schema.prisma`, file DB lokal di `prisma/dev.db`)
- **AI SDK**: `@google/genai` (mendukung fallback otomatis `gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-1.5-flash` dan `gemini-2.5-pro` → `gemini-1.5-pro`)
- **Document Parsing**: `mammoth` (untuk `.docx`) + Gemini Multimodal `inlineData` (untuk `.pdf` dan gambar)

```text
├── prisma/
│   └── schema.prisma                # Skema SQLite: MasterProfile, TailoredResume, JobApplication, AppSetting
├── src/
│   ├── types/
│   │   └── resume.ts                # Definisi tipe TypeScript utama untuk seluruh aplikasi
│   ├── lib/
│   │   ├── db.ts                    # Prisma client singleton, seeding otomatis, CRUD helpers, Backup JSON
│   │   └── gemini.ts                # Layanan terpusat Google Gemini API + JSON Schema & Heuristic ATS Fallback
│   ├── components/
│   │   ├── AtsResumePreview.tsx     # Render dokumen A4 Single-Column (Harvard, Modern, Tech) & Vector PDF Exporter
│   │   ├── TailoredCvStudio.tsx     # Split-screen editor, One-Click JD Wizard, ATS Score Sidebar, Cover Letter
│   │   ├── MasterProfileEditor.tsx  # Editor Master Career Profile dengan tab & tombol AI inline
│   │   ├── InlineAiHelper.tsx       # Komponen tombol AI inline (XYZ Formula, ID->EN, Concise, Executive)
│   │   ├── LegacyCvImportModal.tsx  # Modal unggah CV lama (PDF/DOCX/Image) & Review Merge
│   │   ├── ApplicationTracker.tsx   # Pelacak lamaran kerja (Kanban Board & Tabel)
│   │   └── SettingsModal.tsx        # Pengaturan API Key lokal & Export/Import JSON Backup
│   └── app/
│       ├── api/
│       │   ├── state/route.ts       # GET/PUT state utama, MasterProfile, API Key, Backup JSON
│       │   ├── resumes/route.ts     # POST/PUT/DELETE TailoredResume
│       │   ├── applications/route.ts# POST/PUT/DELETE JobApplication
│       │   ├── ai/route.ts          # Endpoint aksi AI (polish, tailor, ats-score, cover-letter, fetch-jd)
│       │   └── parse-cv/route.ts    # Endpoint multipart upload & ekstraksi CV lama
│       ├── globals.css              # Konfigurasi Tailwind v4 & aturan @media print A4
│       ├── layout.tsx               # Root layout aplikasi
│       └── page.tsx                 # Halaman dashboard utama
├── .env.example                     # Contoh variabel environment
└── package.json
```

---

## 3. Aturan Penting untuk AI Agent (Development Rules)

1. **Kepatuhan Standar ATS (Strict ATS Compliance)**:
   - Jangan pernah menggunakan layout multi-kolom berbasis tabel HTML (`<table>`), grafik progres bar untuk *skills*, atau ikon dekoratif di dalam komponen [`AtsResumePreview.tsx`](src/components/AtsResumePreview.tsx).
   - Pastikan ekspor PDF selalu mempertahankan teks asli yang dapat diseleksi (*selectable text*) menggunakan [`exportResumeToPdf`](src/components/AtsResumePreview.tsx) dan aturan `@media print`.
2. **Integritas Data & Kejujuran AI (Zero Hallucination on Facts)**:
   - Saat memodifikasi prompt di [`src/lib/gemini.ts`](src/lib/gemini.ts), pastikan instruksi sistem selalu melarang pembuatan perusahaan, gelar, atau sertifikasi palsu. AI hanya boleh memilih, menerjemahkan (Indonesia → Inggris), dan mempertajam kalimat dari `MasterCareerProfile`.
3. **Structured JSON Output**:
   - Semua panggilan ekstraksi dan analisis Gemini wajib menggunakan `responseMimeType: "application/json"` dan `responseSchema` (menggunakan `Type` dari `@google/genai`) agar struktur data yang diterima frontend selalu konsisten.
4. **Resiliensi Tanpa API Key (Graceful Offline/Heuristic Fallback)**:
   - Pertahankan fungsi [`runHeuristicAtsCheck`](src/lib/gemini.ts) agar pengguna tetap dapat mengedit CV, melihat skor ATS berbasis aturan, dan mengekspor PDF meskipun belum memasukkan `GEMINI_API_KEY`.
5. **Keamanan & Privasi**:
   - Jangan pernah melakukan commit file `.env` atau file database lokal `prisma/*.db` ke Git.

---

## 4. Perintah Pengembangan & Verifikasi

- **Install dependencies**: `npm install`
- **Sinkronisasi skema database SQLite**: `npx prisma db push`
- **Menjalankan server development**: `npm run dev`
- **Verifikasi build & tipe TypeScript**: `npm run build`
