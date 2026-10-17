import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATS Resume Studio — Personal AI-Powered Career & CV Builder",
  description:
    "Self-hosted Master Career Repository, One-Click Job Description CV Tailoring, Indonesian-to-English Career Translation, ATS Score Checker, and Vector PDF Builder powered by Google Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
