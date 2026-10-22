# AGENT.md — AI Coding Agent & Developer Architecture Guide

Dokumen ini merupakan panduan arsitektur sistem, konvensi kode, spesifikasi modul, dan instruksi operasional untuk AI Coding Agent (Antigravity, Cursor, Copilot, Claude) maupun engineer yang mengembangkan repositori **Personal AI-Powered ATS Resume Builder (`ATS Resume Studio`)**.

---

## 1. Gambaran Umum Proyek & Filosofi Desain

**ATS Resume Studio** adalah aplikasi web *full-stack* dan *self-hosted* kelas produksi yang berfungsi sebagai repositori karier terpusat (**Master Career Profile**) dan generator CV ramah ATS dinamis berbasis **Google Gemini API (`@google/genai`)**.

### Prinsip Utama yang Wajib Dijaga:
1. **Strict Light Mode (Anti AI-Wrapper Cliché)**:
   - Seluruh UI menggunakan tema terang modern (*clean light SaaS aesthetic* seperti Linear, Stripe, dan Notion).
   - Latar belakang menggunakan `bg-slate-50` / `bg-white`, teks kontras `text-slate-900`, border halus `border-slate-200`, dan bayangan tipis `shadow-xs / shadow-sm`.
   - Dilarang menambahkan tema gelap neon, glowing purple gradient, atau ornamen visual kecerdasan buatan murahan yang merusak kesan profesional.
2. **Kepatuhan ATS 100% (Strict Single-Column ATS Standards)**:
   - Parser ATS (Workday, Greenhouse, Lever, Taleo) gagal membaca tabel multi-kolom HTML (`<table>`), grafik bar progres kemampuan, dan ikon SVG dekoratif di dalam badan CV.
   - Dokumen wajib single-column bersih dengan font standar ATS (`Calibri`, `Arial`, `Helvetica`, `Garamond`, `Times New Roman`).
   - Ekspor PDF wajib berupa **teks vektor murni yang dapat diseleksi (*selectable text*)**, bukan hasil raster/gambar.
3. **Integritas Data & Kejujuran Mutlak (Zero Hallucination)**:
   - AI hanya bertugas memilih, menata, menerjemahkan (Bahasa Indonesia ➔ Inggris), dan mengoptimalkan formula XYZ dari pengalaman nyata di Master Profile.
   - Dilarang mengarang perusahaan fiktif, gelar palsu, atau kredensial yang tidak ada di profil master.
4. **Resiliensi & Model Fallback**:
   - Memprioritaskan model Gemini generasi terbaru: `gemini-3.8-flash` dan `gemini-flash-latest`.
   - Tetap menyediakan fallback heuristik deterministik jika pengguna belum memasukkan API Key.

---

## 2. Struktur Direktori & Modul Aplikasi

```text
├── prisma/
│   ├── dev.db                       # Database SQLite lokal (diabaikan oleh .gitignore)
│   └── schema.prisma                # Skema data: MasterProfile, TailoredResume, JobApplication, AppSetting
├── src/
│   ├── types/
│   │   └── resume.ts                # Kontrak data TypeScript untuk seluruh entitas, ATS scoring, dan modul AI
│   ├── lib/
│   │   ├── db.ts                    # Prisma singleton, thread-safe seed lock (upsert), CRUD, Backup JSON
│   │   └── gemini.ts                # Service terpusat Gemini API (@google/genai) dengan Structured JSON Schema
│   ├── components/
│   │   ├── LandingPage.tsx          # Halaman depan modern (Hero, Mockup, Fitur, Template, FAQ, CTA)
│   │   ├── AtsResumePreview.tsx     # Renderer A4 Single-Column (Harvard, Modern, Tech) & Vector PDF Exporter
│   │   ├── TailoredCvStudio.tsx     # Workspace split-screen editor, selector koleksi, cover letter & toolbar
│   │   ├── MasterProfileEditor.tsx  # Editor 6 tab Master Profile karier + integrasi AI inline
│   │   ├── InlineAiHelper.tsx       # Tombol AI inline (XYZ Formula, ID->EN, Concise, Executive)
│   │   ├── AutoTrimModal.tsx        # Fitur pangkas ke 2 halaman (Spacing Compression & AI Condenser)
│   │   ├── MockInterviewModal.tsx   # Simulasi latihan wawancara AI (STAR method evaluation & model answer)
│   │   ├── ToneSentimentModal.tsx   # Analisis sentimen, detektor kata klise, & 3 preset tone slider
│   │   ├── LegacyCvImportModal.tsx  # Modal ekstraksi CV lama (PDF/DOCX/Image) & selective merge review
│   │   ├── ApplicationTracker.tsx   # Pelacak lamaran (Papan Kanban pastel & Tabel)
│   │   └── SettingsModal.tsx        # Pengaturan API Key lokal & Full JSON Backup (Export/Import)
│   └── app/
│       ├── api/
│       │   ├── state/route.ts       # Endpoint sinkronisasi state Master Profile, API Key, dan Backup JSON
│       │   ├── resumes/route.ts     # Endpoint CRUD Tailored CV instances
│       │   ├── applications/route.ts# Endpoint CRUD pelacak lamaran pekerjaan
│       │   ├── ai/route.ts          # Endpoint terpusat aksi Gemini AI
│       │   └── parse-cv/route.ts    # Endpoint upload multipart CV lama (PDF/DOCX/Image)
│       ├── app/
│       │   └── page.tsx             # Halaman utama Studio Workspace (/app)
│       ├── globals.css              # Aturan Tailwind v4, scrollbar terang, dan @media print A4 presisi
│       ├── layout.tsx               # Root layout Next.js (Light Mode default)
│       ├── page.tsx                 # Root entrypoint yang menampilkan LandingPage.tsx (/)
│       └── not-found.tsx            # Halaman 404 modern
├── .env.example                     # Contoh variabel lingkungan
├── package.json
└── tsconfig.json
```

---

## 3. Spesifikasi API Endpoint Terpusat (`/api/ai`)

Semua interaksi AI dikelola melalui satu endpoint terpusat di `src/app/api/ai/route.ts` dengan parameter `action`:

| `action` | Fungsi | Model Rekomendasi | Output |
| :--- | :--- | :--- | :--- |
| `polish` | Mengubah teks ke formula XYZ / terjemahan ID ➔ EN profesional | `gemini-3.8-flash` | `{ improvedText, alternatives, explanation }` |
| `fetch-jd` | Mengambil dan membersihkan teks mentah dari URL lowongan kerja publik | Native fetch | `{ jobDescription }` |
| `tailor` | Menyelaraskan Master Profile dengan JD target, memilih proyek/skill relevan | `gemini-3.8-flash` | `{ resume }` (Tailored CV instance) |
| `ats-score` | Menghitung kecocokan kata kunci, metrik angka, dan format ATS | `gemini-3.8-flash` | `{ atsAnalysis }` (Skor 0-100, gap keywords, weak bullets) |
| `cover-letter`| Membuat draf surat lamaran kerja terpersonalisasi | `gemini-3.8-flash` | `{ coverLetter }` |
| `trim-pages` | Memangkas bullet point panjang agar pas tepat di 2 halaman | `gemini-3.8-flash` | `{ condensedCvData, summaryOfChanges }` |
| `interview-questions` | Membuat 5 pertanyaan wawancara (Teknis & Behavioral STAR) | `gemini-3.8-flash` | `{ questions: [...] }` |
| `evaluate-answer` | Mengevaluasi jawaban kandidat berdasarkan metode STAR | `gemini-3.8-flash` | `{ score, starFeedback, idealAnswer, strengths, weaknesses }` |
| `analyze-tone` | Menganalisis nada bahasa, skor percaya diri, dan deteksi kata klise | `gemini-3.8-flash` | `{ sentiment, confidenceScore, cliches, toneRecommendations }` |
| `restyle-tone` | Menulis ulang summary & bullet points ke tone target (Executive / Technical / Product) | `gemini-3.8-flash` | `{ restyledCvData }` |

---

## 4. Aturan Penting bagi Pengembang & Agent

1. **Stabilitas Database SQLite (Thread-Safe Initialization)**:
   - File database SQLite terletak di `prisma/dev.db`.
   - Jangan pernah menghapus fungsi `ensureDatabaseSeeded()` di [`src/lib/db.ts`](src/lib/db.ts). Fungsi ini mencegah race condition `P2002: Unique constraint failed` saat inisialisasi awal.
2. **Kepatuhan Cetak PDF Presisi**:
   - Komponen [`AtsResumePreview.tsx`](src/components/AtsResumePreview.tsx) menggunakan aturan `@page { size: A4 portrait; margin: 12mm 14mm; }`.
   - Semua elemen section wajib memiliki kelas `ats-keep-together` (`break-inside: avoid`) agar judul bagian tidak terpisah secara canggung di halaman berikutnya (*orphan headers*).
3. **Format JSON Mode & Zod Schema**:
   - Selalu sertakan `responseMimeType: "application/json"` dan `responseSchema` pada pemanggilan `@google/genai` untuk mencegah parsing error akibat teks markdown pembungkus (` ```json `).
4. **Verifikasi Build**:
   - Sebelum melakukan commit atau melaporkan tugas selesai, selalu jalankan `npm run build` untuk memastikan kompilasi TypeScript dan Next.js App Router 100% bebas error.

---

## 5. Ringkasan Deployment & Infrastruktur

- **Tipe Hosting Wajib**: **KVM VPS** (bukan Shared Hosting, karena batasan proses Node.js dan isu file-locking SQLite di atas NFS).
- **Rekomendasi Hosting**: **Hostinger KVM 1 VPS** (4 GB RAM, ~Rp116.000/bln) atau **IDCloudHost Cloud VPS** (2–4 GB RAM, ~Rp87.000–Rp149.000/bln).
- **Metode Deployment Paling Ideal**: Pasang **Coolify** di VPS Linux untuk mendapatkan integrasi otomatis Git push, sertifikat SSL HTTPS otomatis, dan penyimpanan SQLite persisten.
