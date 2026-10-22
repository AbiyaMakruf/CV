"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  ResumeDocumentData,
  ResumeSectionKey,
  SpacingDensity,
  StandardFontFamily,
  TemplateId,
} from "@/types/resume";
import { DEFAULT_SECTION_ORDER, DEFAULT_VISIBLE_SECTIONS } from "@/lib/db";

interface AtsResumePreviewProps {
  data: ResumeDocumentData;
  templateId: TemplateId;
  fontFamily: StandardFontFamily;
  fontSize: "small" | "medium" | "large";
  pageLimit?: number;
  highlightKeywords?: string[];
  showKeywordHighlights?: boolean;
  sheetId?: string;
  spacingDensity?: SpacingDensity;
  onPageCountChange?: (count: number) => void;
}

const FONT_STACK_MAP: Record<StandardFontFamily, string> = {
  Calibri: "Calibri, 'Segoe UI', Candara, Optima, Arial, sans-serif",
  Arial: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  Helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  Garamond: "Garamond, 'EB Garamond', Georgia, 'Times New Roman', serif",
  "Times New Roman": "'Times New Roman', Times, Georgia, serif",
};

const FONT_SIZE_CONFIG = {
  small: {
    base: "9.5pt",
    lineHeight: "1.32",
    name: "17pt",
    headline: "10pt",
    sectionHeader: "10pt",
    itemTitle: "9.8pt",
    meta: "9pt",
  },
  medium: {
    base: "10.2pt",
    lineHeight: "1.38",
    name: "19pt",
    headline: "10.8pt",
    sectionHeader: "10.8pt",
    itemTitle: "10.5pt",
    meta: "9.5pt",
  },
  large: {
    base: "11pt",
    lineHeight: "1.44",
    name: "21pt",
    headline: "11.5pt",
    sectionHeader: "11.5pt",
    itemTitle: "11.2pt",
    meta: "10pt",
  },
};

export const DENSITY_CONFIG: Record<
  SpacingDensity,
  {
    padding: string;
    lineHeight: string;
    sectionMarginTop: string;
    sectionMarginBottom: string;
    itemMarginBottom: string;
    listMargin: string;
    liMarginBottom: string;
    headerMarginBottom: string;
  }
> = {
  normal: {
    padding: "13mm 15mm",
    lineHeight: "1.38",
    sectionMarginTop: "10px",
    sectionMarginBottom: "6px",
    itemMarginBottom: "7px",
    listMargin: "2px 0 6px 0",
    liMarginBottom: "2px",
    headerMarginBottom: "8px",
  },
  compact: {
    padding: "10mm 12mm",
    lineHeight: "1.28",
    sectionMarginTop: "7px",
    sectionMarginBottom: "4px",
    itemMarginBottom: "4px",
    listMargin: "1px 0 4px 0",
    liMarginBottom: "1.2px",
    headerMarginBottom: "6px",
  },
  "ultra-compact": {
    padding: "7mm 10mm",
    lineHeight: "1.20",
    sectionMarginTop: "5px",
    sectionMarginBottom: "3px",
    itemMarginBottom: "2.5px",
    listMargin: "0 0 2px 0",
    liMarginBottom: "0.5px",
    headerMarginBottom: "4px",
  },
};

export function exportResumeToPdf(
  elementId: string,
  documentTitle: string,
  fontFamily: StandardFontFamily,
  spacingDensity: SpacingDensity = "normal"
) {
  const sourceEl = document.getElementById(elementId);
  if (!sourceEl) {
    window.print();
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const fontStack = FONT_STACK_MAP[fontFamily] || FONT_STACK_MAP.Calibri;
  const pageMargin =
    spacingDensity === "ultra-compact"
      ? "7mm 10mm"
      : spacingDensity === "compact"
      ? "10mm 12mm"
      : "12mm 14mm";

  const listMargin =
    spacingDensity === "ultra-compact"
      ? "0 0 2px 0"
      : spacingDensity === "compact"
      ? "1px 0 3px 0"
      : "2px 0 6px 0";

  const liMargin =
    spacingDensity === "ultra-compact"
      ? "0.5px"
      : spacingDensity === "compact"
      ? "1px"
      : "2px";

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${documentTitle.replace(/</g, "&lt;")}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: ${pageMargin};
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #000000;
      font-family: ${fontStack};
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    ul {
      margin: ${listMargin};
      padding-left: ${spacingDensity === "ultra-compact" ? "13px" : "16px"};
    }
    li {
      margin-bottom: ${liMargin};
    }
    .ats-keep-together {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .ats-section-header {
      break-after: avoid;
      page-break-after: avoid;
    }
    .no-print {
      display: none !important;
    }
  </style>
</head>
<body>
  ${sourceEl.innerHTML}
</body>
</html>`;

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(htmlContent);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1500);
    }, 250);
  }
}

export const AtsResumePreview: React.FC<AtsResumePreviewProps> = ({
  data,
  templateId,
  fontFamily,
  fontSize,
  pageLimit = 1,
  sheetId = "ats-resume-sheet",
  spacingDensity,
  onPageCountChange,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [estimatedPages, setEstimatedPages] = useState<number>(1);

  const density: SpacingDensity = spacingDensity || data.spacingDensity || "normal";
  const densityStyles = DENSITY_CONFIG[density] || DENSITY_CONFIG.normal;
  const fontStack = FONT_STACK_MAP[fontFamily] || FONT_STACK_MAP.Calibri;
  const sizes = FONT_SIZE_CONFIG[fontSize] || FONT_SIZE_CONFIG.medium;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      // 1 A4 page height at 96 CSS DPI: 297mm * 3.7795275591 ≈ 1122.52px
      const a4PageHeightPx = 1122.52;
      const height = el.scrollHeight || el.offsetHeight;
      const paddingPx =
        density === "ultra-compact" ? 53 : density === "compact" ? 75 : 98;
      const totalHeightPx = height + paddingPx;
      const count = Math.max(1, Number((totalHeightPx / a4PageHeightPx).toFixed(1)));
      setEstimatedPages(count);
      onPageCountChange?.(count);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [data, templateId, fontFamily, fontSize, density, onPageCountChange]);

  const sectionOrder: ResumeSectionKey[] =
    data.sectionOrder && data.sectionOrder.length > 0
      ? data.sectionOrder
      : DEFAULT_SECTION_ORDER;

  const visible: Record<ResumeSectionKey, boolean> = {
    ...DEFAULT_VISIBLE_SECTIONS,
    ...(data.visibleSections || {}),
  };

  const { personalInfo } = data;
  const contactParts = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.portfolio,
  ].filter((item) => Boolean(item && item.trim()));

  // Template specific header & section styling (100% single-column ATS compliant)
  const renderSectionHeading = (title: string) => {
    const marginTop = densityStyles.sectionMarginTop;
    const marginBottom = densityStyles.sectionMarginBottom;

    if (templateId === "harvard") {
      return (
        <h2
          className="ats-section-header"
          style={{
            fontSize: sizes.sectionHeader,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "1px solid #000000",
            paddingBottom: "2px",
            marginTop,
            marginBottom,
            color: "#000000",
          }}
        >
          {title}
        </h2>
      );
    }

    if (templateId === "modern") {
      return (
        <h2
          className="ats-section-header"
          style={{
            fontSize: sizes.sectionHeader,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            borderBottom: "1.5px solid #1e293b",
            paddingBottom: "2.5px",
            marginTop,
            marginBottom,
            color: "#0f172a",
          }}
        >
          {title}
        </h2>
      );
    }

    // "tech" template
    return (
      <h2
        className="ats-section-header"
        style={{
          fontSize: sizes.sectionHeader,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          borderBottom: "1px solid #334155",
          paddingBottom: "2px",
          marginTop,
          marginBottom,
          color: "#0f172a",
        }}
      >
        {title}
      </h2>
    );
  };

  const renderSection = (key: ResumeSectionKey) => {
    if (!visible[key]) return null;

    switch (key) {
      case "summary":
        if (!personalInfo.summary?.trim()) return null;
        return (
          <section key="summary" className="ats-keep-together">
            {renderSectionHeading("Professional Summary")}
            <p
              style={{
                margin: `0 0 ${densityStyles.itemMarginBottom} 0`,
                textAlign: "justify",
              }}
            >
              {personalInfo.summary}
            </p>
          </section>
        );

      case "experiences":
        if (!data.experiences || data.experiences.length === 0) return null;
        return (
          <section key="experiences">
            {renderSectionHeading("Professional Experience")}
            {data.experiences.map((exp) => (
              <div
                key={exp.id}
                className="ats-keep-together"
                style={{ marginBottom: densityStyles.itemMarginBottom }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    fontWeight: 700,
                    fontSize: sizes.itemTitle,
                  }}
                >
                  <span>
                    {exp.company}
                    {exp.employmentType ? ` (${exp.employmentType})` : ""}
                  </span>
                  <span style={{ fontSize: sizes.meta, fontWeight: 600 }}>
                    {exp.location}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    fontStyle: templateId === "harvard" ? "italic" : "normal",
                    fontWeight: templateId === "harvard" ? 600 : 700,
                    color: "#1e293b",
                    marginBottom: "2px",
                  }}
                >
                  <span>
                    {exp.role}
                    {templateId === "tech" &&
                      exp.technologies &&
                      exp.technologies.length > 0 && (
                        <span
                          style={{
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: sizes.meta,
                            color: "#334155",
                          }}
                        >
                          {" "}
                          — [{exp.technologies.join(", ")}]
                        </span>
                      )}
                  </span>
                  <span style={{ fontSize: sizes.meta, fontStyle: "normal" }}>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul
                    style={{
                      margin: densityStyles.listMargin,
                      paddingLeft: "16px",
                      listStyleType: "disc",
                    }}
                  >
                    {exp.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: densityStyles.liMarginBottom }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {templateId !== "tech" &&
                  exp.technologies &&
                  exp.technologies.length > 0 && (
                    <div
                      style={{
                        fontSize: sizes.meta,
                        color: "#334155",
                        marginTop: "1px",
                      }}
                    >
                      <strong>Technologies:</strong>{" "}
                      {exp.technologies.join(", ")}
                    </div>
                  )}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!data.projects || data.projects.length === 0) return null;
        return (
          <section key="projects">
            {renderSectionHeading("Key Projects")}
            {data.projects.map((proj) => (
              <div
                key={proj.id}
                className="ats-keep-together"
                style={{ marginBottom: densityStyles.itemMarginBottom }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: sizes.itemTitle }}>
                      {proj.title}
                    </strong>
                    {proj.role && <span> | {proj.role}</span>}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <span
                        style={{
                          fontSize: sizes.meta,
                          color: "#334155",
                        }}
                      >
                        {" "}
                        [{proj.techStack.join(", ")}]
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: sizes.meta }}>
                    {[proj.startDate, proj.endDate].filter(Boolean).join(" – ")}
                    {proj.liveUrl ? ` | ${proj.liveUrl}` : ""}
                  </div>
                </div>
                {proj.description && (
                  <div style={{ margin: "1px 0 2px 0" }}>
                    {proj.description}
                    {proj.metrics ? (
                      <strong> — Impact: {proj.metrics}</strong>
                    ) : null}
                  </div>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul
                    style={{
                      margin: densityStyles.listMargin,
                      paddingLeft: "16px",
                      listStyleType: "disc",
                    }}
                  >
                    {proj.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: densityStyles.liMarginBottom }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        );

      case "skills":
        if (!data.skills || data.skills.length === 0) return null;
        return (
          <section key="skills" className="ats-keep-together">
            {renderSectionHeading("Technical & Core Skills")}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {data.skills.map((cat) => (
                <div key={cat.id}>
                  <strong>{cat.category}:</strong> {cat.items.join(", ")}
                </div>
              ))}
            </div>
          </section>
        );

      case "education":
        if (!data.education || data.education.length === 0) return null;
        return (
          <section key="education">
            {renderSectionHeading("Education")}
            {data.education.map((edu) => (
              <div
                key={edu.id}
                className="ats-keep-together"
                style={{ marginBottom: densityStyles.itemMarginBottom }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    fontWeight: 700,
                    fontSize: sizes.itemTitle,
                  }}
                >
                  <span>{edu.institution}</span>
                  <span style={{ fontSize: sizes.meta, fontWeight: 600 }}>
                    {edu.location}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span>
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    {edu.gpa ? ` — GPA: ${edu.gpa}` : ""}
                    {edu.honors ? ` (${edu.honors})` : ""}
                  </span>
                  <span style={{ fontSize: sizes.meta }}>
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                {edu.highlights && edu.highlights.length > 0 && (
                  <ul
                    style={{
                      margin: densityStyles.listMargin,
                      paddingLeft: "16px",
                      listStyleType: "disc",
                    }}
                  >
                    {edu.highlights.map((h, i) => (
                      <li key={i} style={{ marginBottom: densityStyles.liMarginBottom }}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        );

      case "certifications":
        if (!data.certifications || data.certifications.length === 0)
          return null;
        return (
          <section key="certifications" className="ats-keep-together">
            {renderSectionHeading("Certifications & Licenses")}
            <ul
              style={{
                margin: densityStyles.listMargin,
                paddingLeft: "16px",
                listStyleType: "disc",
              }}
            >
              {data.certifications.map((cert) => (
                <li key={cert.id} style={{ marginBottom: densityStyles.liMarginBottom }}>
                  <strong>{cert.name}</strong> — {cert.issuer} ({cert.issueDate}
                  {cert.credentialId ? `, ID: ${cert.credentialId}` : ""})
                </li>
              ))}
            </ul>
          </section>
        );

      case "publications":
        if (!data.publications || data.publications.length === 0) return null;
        return (
          <section key="publications" className="ats-keep-together">
            {renderSectionHeading("Publications & Research")}
            <ul
              style={{
                margin: densityStyles.listMargin,
                paddingLeft: "16px",
                listStyleType: "disc",
              }}
            >
              {data.publications.map((pub) => (
                <li key={pub.id} style={{ marginBottom: densityStyles.liMarginBottom }}>
                  <strong>{pub.title}</strong> — <em>{pub.publisher}</em> (
                  {pub.date}). {pub.description || ""}
                </li>
              ))}
            </ul>
          </section>
        );

      case "awards":
        if (!data.awards || data.awards.length === 0) return null;
        return (
          <section key="awards" className="ats-keep-together">
            {renderSectionHeading("Honors & Awards")}
            <ul
              style={{
                margin: densityStyles.listMargin,
                paddingLeft: "16px",
                listStyleType: "disc",
              }}
            >
              {data.awards.map((aw) => (
                <li key={aw.id} style={{ marginBottom: densityStyles.liMarginBottom }}>
                  <strong>{aw.title}</strong> — {aw.issuer} ({aw.date}):{" "}
                  {aw.description}
                </li>
              ))}
            </ul>
          </section>
        );

      case "volunteer":
        if (!data.volunteer || data.volunteer.length === 0) return null;
        return (
          <section key="volunteer" className="ats-keep-together">
            {renderSectionHeading("Leadership & Volunteering")}
            {data.volunteer.map((vol) => (
              <div key={vol.id} style={{ marginBottom: densityStyles.itemMarginBottom }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                  }}
                >
                  <span>
                    {vol.role} — {vol.organization}
                  </span>
                  <span style={{ fontSize: sizes.meta, fontWeight: 400 }}>
                    {vol.startDate} – {vol.endDate}
                  </span>
                </div>
                {vol.bullets && vol.bullets.length > 0 && (
                  <ul
                    style={{
                      margin: densityStyles.listMargin,
                      paddingLeft: "16px",
                      listStyleType: "disc",
                    }}
                  >
                    {vol.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: densityStyles.liMarginBottom }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div
      id={sheetId}
      ref={sheetRef}
      className="ats-print-sheet bg-white text-black shadow-2xl mx-auto transition-all"
      style={{
        fontFamily: fontStack,
        fontSize: sizes.base,
        lineHeight: densityStyles.lineHeight,
        width: "210mm",
        minHeight: `${Math.max(pageLimit, Math.ceil(estimatedPages || 1)) * 297}mm`,
        padding: densityStyles.padding,
        color: "#000000",
        backgroundColor: "#ffffff",
        position: "relative",
      }}
    >
      <div ref={contentRef} className="ats-resume-inner-content">
        {/* Top Personal Header */}
        {templateId === "harvard" && (
          <header
            style={{
              textAlign: "center",
              marginBottom: densityStyles.headerMarginBottom,
            }}
          >
            <h1
              style={{
                fontSize: sizes.name,
                fontWeight: 700,
                margin: "0 0 2px 0",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.headline && (
              <div
                style={{
                  fontSize: sizes.headline,
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "3px",
                }}
              >
                {personalInfo.headline}
              </div>
            )}
            <div style={{ fontSize: sizes.meta, color: "#111827" }}>
              {contactParts.join("  •  ")}
            </div>
          </header>
        )}

        {templateId === "modern" && (
          <header
            style={{
              borderBottom: "2px solid #0f172a",
              paddingBottom: "6px",
              marginBottom: densityStyles.headerMarginBottom,
            }}
          >
            <h1
              style={{
                fontSize: sizes.name,
                fontWeight: 800,
                margin: "0 0 2px 0",
                color: "#0f172a",
              }}
            >
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.headline && (
              <div
                style={{
                  fontSize: sizes.headline,
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "4px",
                }}
              >
                {personalInfo.headline}
              </div>
            )}
            <div style={{ fontSize: sizes.meta, color: "#1e293b" }}>
              {contactParts.join("  |  ")}
            </div>
          </header>
        )}

        {templateId === "tech" && (
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderBottom: "1.5px solid #000000",
              paddingBottom: "5px",
              marginBottom: densityStyles.headerMarginBottom,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: sizes.name,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {personalInfo.fullName || "Your Name"}
              </h1>
              {personalInfo.headline && (
                <div
                  style={{
                    fontSize: sizes.headline,
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  {personalInfo.headline}
                </div>
              )}
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: sizes.meta,
                maxWidth: "55%",
                lineHeight: "1.3",
              }}
            >
              <div>
                {[personalInfo.email, personalInfo.phone, personalInfo.location]
                  .filter(Boolean)
                  .join(" | ")}
              </div>
              <div>
                {[
                  personalInfo.linkedin,
                  personalInfo.github,
                  personalInfo.portfolio,
                ]
                  .filter(Boolean)
                  .join(" | ")}
              </div>
            </div>
          </header>
        )}

        {/* Render Ordered Sections */}
        <div>{sectionOrder.map((sectionKey) => renderSection(sectionKey))}</div>
      </div>

      {/* Visual Page Boundary Guides (Hidden in PDF Print) */}
      <div
        className="no-print pointer-events-none"
        style={{
          position: "absolute",
          top: "297mm",
          left: 0,
          right: 0,
          borderTop: "1px dashed #ef4444",
          opacity: 0.6,
        }}
      >
        <span
          style={{
            position: "absolute",
            right: "8px",
            top: "-18px",
            fontSize: "10px",
            fontWeight: 600,
            color: "#dc2626",
            background: "#fee2e2",
            padding: "1px 7px",
            borderRadius: "4px",
            fontFamily: "sans-serif",
          }}
        >
          End of Page 1 (297mm A4)
        </span>
      </div>

      <div
        className="no-print pointer-events-none"
        style={{
          position: "absolute",
          top: "594mm",
          left: 0,
          right: 0,
          borderTop: estimatedPages > 2.0 ? "2px dashed #dc2626" : "1px dashed #f59e0b",
          opacity: 0.85,
        }}
      >
        <span
          style={{
            position: "absolute",
            right: "8px",
            top: "-18px",
            fontSize: "10px",
            fontWeight: 700,
            color: estimatedPages > 2.0 ? "#991b1b" : "#b45309",
            background: estimatedPages > 2.0 ? "#fecaca" : "#fef3c7",
            padding: "1px 7px",
            borderRadius: "4px",
            fontFamily: "sans-serif",
            border: estimatedPages > 2.0 ? "1px solid #f87171" : "1px solid #fcd34d",
          }}
        >
          {estimatedPages > 2.0
            ? "⚠️ BATAS MAKSIMAL 2 HALAMAN — KONTEN TUMPAH KE HALAMAN 3!"
            : "End of Page 2 (Batas Maksimal 2 Halaman ATS)"}
        </span>
      </div>

      {estimatedPages > 2.0 && (
        <div
          className="no-print pointer-events-none"
          style={{
            position: "absolute",
            top: "891mm",
            left: 0,
            right: 0,
            borderTop: "1px dashed #ef4444",
            opacity: 0.6,
          }}
        >
          <span
            style={{
              position: "absolute",
              right: "8px",
              top: "-18px",
              fontSize: "10px",
              fontWeight: 600,
              color: "#dc2626",
              background: "#fee2e2",
              padding: "1px 7px",
              borderRadius: "4px",
              fontFamily: "sans-serif",
            }}
          >
            End of Page 3 (Danger Zone — Pangkas ke 2 Halaman)
          </span>
        </div>
      )}
    </div>
  );
};
