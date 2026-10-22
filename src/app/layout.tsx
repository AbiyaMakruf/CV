import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATS Resume Studio — AI-Powered Master Career & CV Builder",
  description:
    "Self-hosted Master Career Repository, One-Click Job Description CV Tailoring, Indonesian-to-English Career Translation, ATS Score Checker, and Vector PDF Builder powered by Google Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
