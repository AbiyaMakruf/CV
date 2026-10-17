# Personal AI-Powered ATS Resume Builder (`ATS Resume Studio`)

Aplikasi web *full-stack* dan *self-hosted* untuk mengelola **Master Career Profile** (*Single Source of Truth*) serta membuat **CV ramah ATS (Applicant Tracking System)** yang disesuaikan secara cerdas untuk setiap lowongan pekerjaan menggunakan **Google Gemini API**.

---

## ✨ Fitur Utama

### 1. Master Career Profile (*Single Source of Truth*)
- Repositori karier terpusat untuk menyimpan seluruh data profesional Anda di satu tempat:
  - **Personal Information & Professional Summary**
  - **Work Experience** (Perusahaan, Role, Tanggal, Lokasi, *Bullet points*, Teknologi)
  - **Key Projects** (Judul, Role, Deskripsi, *Tech Stack*, Metrik/Dampak, Link)
  - **Education & Certifications**
  - **Technical & Soft Skills** (Dikategorikan secara rapi untuk pemindaian ATS)
  - **Publications, Honors & Awards, serta Leadership/Volunteering**
- **Dukungan Bilingual (Bahasa Indonesia & Bahasa Inggris)**: Tulis pencapaian kerja dalam Bahasa Indonesia atau Bahasa Inggris, lalu optimalkan secara instan dengan tombol **Inline Gemini AI**:
  - **XYZ Formula**: Mengubah kalimat menjadi rumus standar industri (*Accomplished [X] as measured by [Y], by doing [Z]*).
  - **ID → EN Translate**: Menerjemahkan Bahasa Indonesia menjadi Bahasa Inggris profesional berdampak tinggi.
  - **Concise** & **Executive**: Memadatkan kalimat atau meningkatkan nada kepemimpinan eksekutif.

### 2. Ekstraksi & Ingesti CV Lama (*Legacy CV Ingestion*)
- Unggah file CV lama Anda dalam format **PDF (`.pdf`), Word (`.docx`), Gambar (`.png`, `.jpg`), atau Teks (`.txt`)**.
- Menggunakan **Gemini Multimodal API** dan `mammoth` untuk mengekstrak, menerjemahkan (ID → EN), dan menyusun data mentah ke dalam skema JSON `MasterCareerProfile`.
- Dilengkapi modal **Review & Smart Merge** untuk memilih bagian yang ingin diimpor sekaligus mencegah duplikasi data.

### 3. Koleksi CV Terkustomisasi & *One-Click Vacancy Matcher*
- Kelola berbagai versi CV berdasarkan kategori/koleksi (misalnya: *Full-Stack & AI*, *Frontend Engineer*, *ML Researcher*, *Tech Lead*).
- **One-Click Tailoring dari Job Description (JD)**:
  - Tempelkan **URL Lowongan Kerja** (ekstraksi otomatis) atau teks **Job Description** mentah.
  - Gemini menganalisis kata kunci utama, memilih pengalaman & proyek paling relevan dari Master Profile, menulis ulang *bullet points* secara jujur dengan rumus XYZ, menerjemahkan teks Bahasa Indonesia ke Bahasa Inggris, dan menyusun *Professional Summary* yang selaras dengan target posisi.

### 4. Pemeriksa Skor ATS & Analisis *Keyword Gap* (0 – 100%)
- **Skor Kompatibilitas ATS**: Menghitung skor gabungan dari *Keyword Match Rate* (45%), *Impact Metrics* (35%), dan *ATS Parser Formatting* (20%).
- **Matched vs. Missing Critical Keywords**: Menampilkan kata kunci JD yang sudah cocok dan kata kunci penting yang belum ada (dilengkapi tombol **1-Click `+ Add to Skills`**).
- **Measurable Impact Checker**: Mendeteksi *bullet points* yang belum memiliki angka/metrik terukur dan menyediakan saran penulisan ulang XYZ yang dapat diterapkan dalam 1 klik.

### 5. Template Standar ATS & Ekspor PDF Vektor (*Selectable Text*)
- Tersedia 3 template bersih satu kolom (*single-column*) tanpa tabel atau grafik yang merusak parser ATS:
  - **Harvard / Standard Academic ATS Style**
  - **Modern Minimalist ATS Style**
  - **Tech / Engineering Clean ATS Style**
- Mendukung pilihan font standar ATS (`Calibri`, `Arial`, `Helvetica`, `Garamond`, `Times New Roman`), pengaturan kepadatan halaman, pengurutan ulang bagian (*reorder & hide/show sections*), serta ekspor **PDF vektor A4** dengan teks yang 100% dapat diseleksi (*selectable text*).

### 6. Generator Cover Letter, Application Tracker & Backup JSON
- **Cover Letter Generator**: Membuat draf surat lamaran kerja yang disesuaikan dengan CV aktif dan target JD.
- **Application Tracker (Kanban & Tabel)**: Melacak status lamaran kerja (*Wishlist*, *Applied*, *Interview*, *Offer*, *Rejected*) lengkap dengan tautan ke versi CV yang dikirimkan.
- **Privasi & Backup Penuh**: Simpan API Key secara lokal (`.env`, SQLite lokal, atau `localStorage` terenkripsi) dan ekspor/impor seluruh database karier sebagai satu file `.json`.

---

## 🛠️ Tech Stack

- **Frontend & Fullstack**: Next.js 15 (App Router, TypeScript, React 19, Tailwind CSS v4, Lucide Icons)
- **Database**: SQLite dengan Prisma ORM (`@prisma/client`)
- **AI Engine**: Google Gemini SDK (`@google/genai`) dengan *Structured Outputs* (`responseSchema`)
- **Document Parsing**: `mammoth` (DOCX) & Gemini Multimodal API (PDF/Image)
- **PDF Engine**: Native Vector A4 Print-to-PDF Engine dengan kontrol paginasi ketat (`break-inside: avoid`)

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/AbiyaMakruf/CV.git
cd CV
npm install
```

### 2. Konfigurasi Environment & Database SQLite
Salin file `.env.example` menjadi `.env` (atau biarkan default):
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
```
> **Catatan**: Anda juga dapat mengatur atau mengubah `GEMINI_API_KEY` langsung dari antarmuka aplikasi melalui tombol **Set Gemini API Key** di pojok kanan atas tanpa perlu mengedit file `.env`.

Inisialisasi skema database SQLite lokal:
```bash
npx prisma db push
```

### 3. Jalankan Server Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📂 Dokumentasi Tambahan
Lihat [AGENT.md](./AGENT.md) untuk panduan arsitektur internal, skema data, dan instruksi pengembangan bagi AI Agent maupun kontributor.
