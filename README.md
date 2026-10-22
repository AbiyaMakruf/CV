# Personal AI-Powered ATS Resume Builder (`ATS Resume Studio`)

Aplikasi web *full-stack* dan *self-hosted* modern untuk mengelola **Master Career Profile** (*Single Source of Truth*), menghasilkan **CV ramah ATS (Applicant Tracking System)** yang disesuaikan secara instan dengan Job Description menggunakan **Google Gemini API**, melakukan **simulasi latihan wawancara AI**, menganalisis **nada bahasa/sentimen**, serta mengekspor **PDF vektor A4 single-column** yang 100% *parseable*.

---

## ✨ Fitur-Fitur Unggulan

### 1. Desain Modern Clean Light Mode (Anti AI-Wrapper Cliché)
- Desain antarmuka bersih, elegan, dan profesional bergaya SaaS modern (seperti Linear, Stripe, dan Notion).
- Bebas dari warna gelap neon/purple glow AI murahan.
- Terdiri dari **Landing Page publik (`/`)** yang berorientasi konversi dan **Studio Workspace (`/app`)** yang terintegrasi.
- **Mobile-Friendly**: Panel split-screen responsif dengan toggle cepat antara editor dan live preview di layar smartphone/tablet.

### 2. Auto-Trim to 2 Pages (Pangkas Otomatis ke Tepat 2 Halaman)
- **Live Page Overflow Tracker**: Menghitung tinggi dokumen cetak A4 secara presisi. Memberikan peringatan instan jika isi CV tumpah ke halaman ketiga (`⚠️ 2.4 Halaman`).
- **Opsi Presisi Spasi & Tipografi**: Menyesuaikan margin kertas A4 (13mm ➔ 8mm), jarak antar-bagian, dan ukuran font secara dinamis sehingga CV 2.2 – 2.6 halaman langsung pas rapi di 2 halaman tanpa mengubah teks.
- **AI Smart Content Condenser**: Menggunakan Gemini AI untuk meringkas bullet point yang panjang menjadi 1 baris tajam berformula XYZ Google (*Accomplished X as measured by Y, by doing Z*) dengan jaminan **100% mempertahankan angka, metrik, persentase, dan tech stack asli**.

### 3. Simulasi Latihan Wawancara AI (AI Mock Interview)
- Menghasilkan **5 pertanyaan wawancara realistis** (Teknis, Behavioral STAR, dan Situasional) yang disesuaikan secara spesifik dengan CV aktif dan target Job Description.
- Evaluasi jawaban instan:
  - Skor Kesiapan (0–100%) dan *Overall Verdict*.
  - **Analisis 4 Pilar STAR**: Pengecekan *Situation*, *Task*, *Action*, dan *Result* terukur.
  - Analisis Kelebihan (*Strengths*) dan Area Perbaikan (*Weaknesses*).
  - **Model Jawaban Ideal (FAANG/Top Tech Model Answer)** yang siap dipelajari.

### 4. Analisis Sentimen & Tone Transformer
- **Pengukur Kekuatan Bahasa**: Skor *Confidence*, *Impact*, dan *Clarity* (0–100%).
- **Detektor Kata Klise & Buzzwords**: Mendeteksi kata-kata pasif tanpa bukti seperti *"hardworking"*, *"team player"*, *"responsible for"* dan menyarankan kata kerja aktif (*power verbs*).
- **3 Preset Nada Bahasa (1-Click Restyler)**:
  1. *Executive & Strategic Leader* (Fokus ROI bisnis, kepemimpinan tim, efisiensi skala besar).
  2. *Technical Deep-Dive Specialist* (Fokus latensi P95/P99, reliabilitas sistem, algoritma).
  3. *Product & Innovation Driver* (Fokus empati pengguna, A/B testing, konversi/retensi).

### 5. Master Career Profile (*Single Source of Truth*)
- Repositori terpusat untuk menyimpan seluruh riwayat karier:
  - *Personal Info & Summary*
  - *Work Experience* (Perusahaan, Role, Tanggal, Lokasi, Bullet points, Tech stack)
  - *Key Projects* (Judul, Role, Deskripsi, Metrik Dampak, Link)
  - *Education & Certifications*
  - *Categorized Skills* (Bahasa Pemrograman, Framework, Cloud, Tools, Bahasa)
  - *Publications, Honors & Awards, Volunteer*
- **Dukungan Bilingual (Bahasa Indonesia & English)** dengan tombol **Inline Gemini AI**:
  - *XYZ Formula Generator*
  - *ID ➔ EN Professional Translator*
  - *Concise ATS* & *Executive Tone*

### 6. Ekstraksi CV Lama (*Legacy CV Ingestion*)
- Unggah file CV lama dalam format **PDF (`.pdf`), Word (`.docx`), Gambar (`.png`, `.jpg`), atau Teks (`.txt`)**.
- Gemini Multimodal API dan `mammoth` mengekstrak dan menata data mentah ke skema JSON.
- Dilengkapi modal **Review & Smart Merge** untuk memilih bagian yang ingin diimpor dan mencegah data ganda.

### 7. One-Click Vacancy Matcher & ATS Compatibility Score
- Tempelkan **URL Lowongan Kerja** (auto-scrape) atau teks **Job Description (JD)** mentah.
- Gemini memilih proyek & pengalaman paling relevan, menyesuaikan kata kunci, dan menyusun *tailored CV*.
- **Skor ATS 0–100%**: Menampilkan kata kunci yang cocok (*Matched Keywords*), kata kunci yang kurang (*Missing Critical Keywords* dengan tombol 1-klik `+ Add to Skills`), serta deteksi *bullet points* lemah.

### 8. Template Standar ATS & Ekspor PDF Vektor Asli
- 3 template single-column bersih tanpa elemen tabel yang merusak parser ATS:
  - **Harvard / Standard Academic ATS Style**
  - **Modern Minimalist ATS Style**
  - **Tech / Engineering Clean ATS Style**
- Pilihan font standar ATS (`Calibri`, `Arial`, `Helvetica`, `Garamond`, `Times New Roman`).
- Ekspor PDF vektor A4 dengan **teks yang 100% dapat diseleksi (*selectable text*)**.

### 9. Application Tracker (Kanban & Tabel) & Full JSON Backup
- Pelacak lamaran kerja bergaya Kanban pastel (*Wishlist*, *Applied*, *Interview*, *Offer*, *Rejected*) dan tampilan tabel yang terhubung langsung ke versi CV yang dikirimkan.
- Simpan API Key secara lokal (`.env`, SQLite lokal, atau browser storage terenkripsi).
- Ekspor & Impor seluruh database karier Anda ke dalam satu file `.json`.

---

## 🛠️ Tech Stack

- **Frontend & Fullstack**: Next.js 15 (App Router, TypeScript, React 19, Tailwind CSS v4, Lucide Icons)
- **Database & State**: SQLite dengan Prisma ORM (`@prisma/client`)
- **AI Engine**: Google Gemini API SDK (`@google/genai`) dengan model generasi terbaru `gemini-3.8-flash` & `gemini-flash-latest` (Structured JSON Outputs)
- **Document Parsing**: `mammoth` (DOCX) & Gemini Multimodal (`application/pdf`, images)
- **PDF Engine**: Native Vector A4 Print Engine dengan pagination controller presisi (`break-inside: avoid`)

---

## 🚀 Panduan Menjalankan Secara Lokal

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/AbiyaMakruf/Personal-AIPoweredATSBuilder.git
cd Personal-AIPoweredATSBuilder
npm install
```

### 2. Inisialisasi Database SQLite
Salin file `.env.example` menjadi `.env`:
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
```
> **Tips**: Anda juga dapat memasukkan atau mengganti `GEMINI_API_KEY` langsung melalui tombol **Set Gemini API Key** di pojok kanan atas aplikasi web.

Inisialisasi tabel database SQLite:
```bash
npx prisma db push
```

### 3. Jalankan Server Development
```bash
npm run dev
```
Buka browser Anda di:
- **Landing Page Publik**: [http://localhost:3000](http://localhost:3000) (atau port 3001 jika port 3000 digunakan)
- **Studio CV Workspace**: [http://localhost:3000/app](http://localhost:3000/app)

---

## ☁️ Panduan & Rekomendasi Hosting

Berdasarkan arsitektur **Next.js 15 App Router + Prisma ORM + SQLite**, berikut adalah panduan pemilihan hosting:

### Mengapa Wajib Memilih VPS KVM (Bukan Shared Hosting)?
1. **Prisma Engine Binary**: Prisma menjalankan binary Rust native (`libquery_engine`). Pada shared hosting (cPanel/CageFS), eksekusi binary pihak ketiga di direktori user kerap diblokir (*noexec*).
2. **Karakteristik SQLite**: SQLite bekerja berbasis file lokal. Shared hosting menggunakan *network storage pool* (NFS) bersama yang rentan memicu *database disk image is malformed* atau *database locked*. Pada VPS, SQLite berjalan di atas SSD NVMe lokal dengan latensi sub-milidetik.
3. **Kebutuhan Memori `next build`**: Kompilasi Next.js 15 App Router membutuhkan RAM 1.5 GB – 2.5 GB. Batas RAM shared hosting (512 MB – 1 GB) hampir dipastikan mengalami *Out of Memory (OOM) crash*.

### Matriks Perbandingan Provider Hosting

| Provider | Paket Rekomendasi | Spesifikasi | Estimasi Biaya / Bulan | Catatan & Kesesuaian |
| :--- | :--- | :--- | :--- | :--- |
| **Hostinger** *(Paling Direkomendasikan)* | **KVM 1 VPS** | 1 vCPU, 4 GB RAM, 50 GB NVMe | **~Rp116.900 – Rp193.900** | Rasio RAM/Harga terbaik (4 GB RAM); NVMe kencang; data center SG (latensi ke ID ~15ms). |
| **IDCloudHost** | **Cloud VPS Compute** | 1–2 vCPU, 2–4 GB RAM, 40 GB NVMe | **~Rp87.000 – Rp149.000** | Data center Jakarta Tier 3/4; sistem saldo fleksibel per jam/bulan via QRIS/VA lokal. |
| **Rumahweb** | **VPS Linux Paket M/L** | 1–2 vCPU, 2–4 GB RAM, 40–80 GB SSD | **~Rp120.000 – Rp245.000** | Data center DCI Indonesia; tim support berbahasa Indonesia 24/7. |

### Rekomendasi Deployment Termudah: VPS + Coolify ("Self-Hosted Vercel")
Jika Anda menyewa VPS KVM di Hostinger atau IDCloudHost, Anda dapat menginstal **Coolify** secara gratis hanya dengan satu perintah di terminal server:
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```
**Keuntungan Coolify**:
- Terhubung langsung ke repositori GitHub `https://github.com/AbiyaMakruf/Personal-AIPoweredATSBuilder.git`. Setiap kali Anda melakukan `git push`, aplikasi otomatis ter-build dan ter-deploy.
- Menggunakan *Persistent Volume* di VPS sehingga database SQLite lokal Anda tidak akan pernah hilang.
- Mengelola domain, sertifikat SSL HTTPS gratis (Let's Encrypt), dan reverse proxy secara otomatis.

---

## 📂 Dokumentasi Teknis Internal
Silakan baca [AGENT.md](./AGENT.md) untuk pedoman arsitektur kode, spesifikasi endpoint AI, dan panduan kontribusi bagi AI Agent maupun software engineer.
