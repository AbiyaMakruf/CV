"use client";

import React, { useRef } from "react";
import {
  ResumeDocumentData,
  ResumeSectionKey,
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

export function exportResumeToPdf(
  elementId: string,
  documentTitle: string,
  fontFamily: StandardFontFamily
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
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${documentTitle.replace(/</g, "&lt;")}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm;
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
      margin: 2px 0 6px 0;
      padding-left: 16px;
    }
    li {
      margin-bottom: 2px;
    }
    .ats-keep-together {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .ats-section-header {
      break-after: avoid;
      page-break-after: avoid;
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
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const fontStack = FONT_STACK_MAP[fontFamily] || FONT_STACK_MAP.Calibri;
  const sizes = FONT_SIZE_CONFIG[fontSize] || FONT_SIZE_CONFIG.medium;

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
            marginTop: "10px",
            marginBottom: "6px",
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
            paddingBottom: "3px",
            marginTop: "11px",
            marginBottom: "6px",
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
          marginTop: "9px",
          marginBottom: "5px",
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
                margin: "0 0 6px 0",
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
                style={{ marginBottom: "8px" }}
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
                    marginBottom: "3px",
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
                      margin: "2px 0 3px 0",
                      paddingLeft: "16px",
                      listStyleType: "disc",
                    }}
                  >
                    {exp.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>
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
                style={{ marginBottom: "7px" }}
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
                      margin: "2px 0 2px 0",
                      paddingLeft: "16px",
                      listStyleType: "disc",
                    }}
                  >
                    {proj.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: "1.5px" }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
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
                style={{ marginBottom: "6px" }}
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
                      margin: "2px 0 2px 0",
                      paddingLeft: "16px",
                      listStyleType: "disc",
                    }}
                  >
                    {edu.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
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
                margin: "2px 0 4px 0",
                paddingLeft: "16px",
                listStyleType: "disc",
              }}
            >
              {data.certifications.map((cert) => (
                <li key={cert.id} style={{ marginBottom: "2px" }}>
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
                margin: "2px 0 4px 0",
                paddingLeft: "16px",
                listStyleType: "disc",
              }}
            >
              {data.publications.map((pub) => (
                <li key={pub.id} style={{ marginBottom: "2px" }}>
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
                margin: "2px 0 4px 0",
                paddingLeft: "16px",
                listStyleType: "disc",
              }}
            >
              {data.awards.map((aw) => (
                <li key={aw.id} style={{ marginBottom: "2px" }}>
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
              <div key={vol.id} style={{ marginBottom: "5px" }}>
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
                      margin: "2px 0 2px 0",
                      paddingLeft: "16px",
                      listStyleType: "disc",
                    }}
                  >
                    {vol.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
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
        lineHeight: sizes.lineHeight,
        width: "210mm",
        minHeight: pageLimit === 2 ? "594mm" : "297mm",
        padding: "13mm 15mm",
        color: "#000000",
        backgroundColor: "#ffffff",
        position: "relative",
      }}
    >
      {/* Top Personal Header */}
      {templateId === "harvard" && (
        <header
          style={{
            textAlign: "center",
            marginBottom: "8px",
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
            paddingBottom: "7px",
            marginBottom: "8px",
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
            paddingBottom: "6px",
            marginBottom: "8px",
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
              lineHeight: "1.35",
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

      {/* Visual Page Boundary Guide (Hidden in PDF Print) */}
      <div
        className="no-print pointer-events-none"
        style={{
          position: "absolute",
          top: "297mm",
          left: 0,
          right: 0,
          borderTop: "1px dashed #ef4444",
          opacity: 0.5,
        }}
      >
        <span
          style={{
            position: "absolute",
            right: "8px",
            top: "-18px",
            fontSize: "10px",
            color: "#dc2626",
            background: "#fee2e2",
            padding: "1px 6px",
            borderRadius: "4px",
            fontFamily: "sans-serif",
          }}
        >
          End of Page 1 (A4 Boundary)
        </span>
      </div>
    </div>
  );
};
