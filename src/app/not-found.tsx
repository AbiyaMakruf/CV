import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-900 text-center">
      <h2 className="text-3xl font-extrabold tracking-tight">404 — Halaman Tidak Ditemukan</h2>
      <p className="mt-2 text-sm text-slate-600 max-w-md">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-sm"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
