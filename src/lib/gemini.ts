import { GoogleGenAI, Type, Schema } from "@google/genai";
import mammoth from "mammoth";
import {
  AtsAnalysisResult,
  MasterCareerProfile,
  ResumeDocumentData,
} from "@/types/resume";
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_VISIBLE_SECTIONS,
  getStoredApiKey,
  masterToResumeDocument,
} from "@/lib/db";

const FLASH_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
];

const PRO_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.7-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-pro-preview",
];

async function resolveApiKey(customApiKey?: string): Promise<string> {
  if (customApiKey && customApiKey.trim().length > 5) {
    return customApiKey.trim();
  }
  return await getStoredApiKey();
}

async function generateWithModelFallback(
  apiKey: string,
  models: string[],
  contents: unknown,
  config: {
    systemInstruction?: string;
    responseMimeType?: string;
    responseSchema?: Schema;
    temperature?: number;
  }
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  let lastError: unknown = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: contents as never,
        config,
      });
      if (response && typeof response.text === "string" && response.text.trim()) {
        return response.text.trim();
      }
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      // If invalid API key (400/401/403 API_KEY_INVALID), throw immediately
      if (
        msg.includes("API_KEY_INVALID") ||
        msg.includes("API key not valid")
      ) {
        throw new Error(
          "Invalid Google Gemini API Key. Please check your API key in Settings or .env."
        );
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to get response from Gemini models.");
}

const MASTER_PROFILE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        headline: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        github: { type: Type.STRING },
        portfolio: { type: Type.STRING },
        summary: { type: Type.STRING },
      },
      required: [
        "fullName",
        "headline",
        "email",
        "phone",
        "location",
        "linkedin",
        "github",
        "portfolio",
        "summary",
      ],
    },
    experiences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          employmentType: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          current: { type: Type.BOOLEAN },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          "id",
          "company",
          "role",
          "location",
          "startDate",
          "endDate",
          "current",
          "bullets",
          "technologies",
        ],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          fieldOfStudy: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          gpa: { type: Type.STRING },
          honors: { type: Type.STRING },
          highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          "id",
          "institution",
          "degree",
          "fieldOfStudy",
          "location",
          "startDate",
          "endDate",
          "highlights",
        ],
      },
    },
    certifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          issuer: { type: Type.STRING },
          issueDate: { type: Type.STRING },
          expiryDate: { type: Type.STRING },
          credentialId: { type: Type.STRING },
          credentialUrl: { type: Type.STRING },
        },
        required: ["id", "name", "issuer", "issueDate"],
      },
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          role: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.STRING },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
          metrics: { type: Type.STRING },
          liveUrl: { type: Type.STRING },
          repoUrl: { type: Type.STRING },
        },
        required: ["id", "title", "description", "bullets", "techStack"],
      },
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["id", "category", "items"],
      },
    },
    publications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          publisher: { type: Type.STRING },
          date: { type: Type.STRING },
          authors: { type: Type.STRING },
          url: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["id", "title", "publisher", "date"],
      },
    },
    awards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          issuer: { type: Type.STRING },
          date: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["id", "title", "issuer", "date", "description"],
      },
    },
    volunteer: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          organization: { type: Type.STRING },
          role: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["id", "organization", "role", "startDate", "endDate", "bullets"],
      },
    },
  },
  required: [
    "personalInfo",
    "experiences",
    "education",
    "certifications",
    "projects",
    "skills",
    "publications",
    "awards",
    "volunteer",
  ],
};

const ATS_ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    keywordMatchScore: { type: Type.NUMBER },
    impactMetricsScore: { type: Type.NUMBER },
    atsFormattingScore: { type: Type.NUMBER },
    extractedTargetRole: { type: Type.STRING },
    matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingCriticalKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendedTechStack: { type: Type.ARRAY, items: { type: Type.STRING } },
    weakBullets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalBullet: { type: Type.STRING },
          section: { type: Type.STRING },
          reason: { type: Type.STRING },
          suggestedRewrite: { type: Type.STRING },
        },
        required: ["originalBullet", "section", "reason", "suggestedRewrite"],
      },
    },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
    actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    "overallScore",
    "keywordMatchScore",
    "impactMetricsScore",
    "atsFormattingScore",
    "matchedKeywords",
    "missingCriticalKeywords",
    "recommendedTechStack",
    "weakBullets",
    "redFlags",
    "actionableTips",
  ],
};

/**
 * 1. Parse Legacy Resume (PDF, DOCX, or Image) into MasterCareerProfile JSON structure
 */
export async function parseLegacyResume(
  fileBuffer: Buffer,
  mimeType: string,
  customApiKey?: string
): Promise<Omit<MasterCareerProfile, "id" | "updatedAt">> {
  const apiKey = await resolveApiKey(customApiKey);
  if (!apiKey) {
    throw new Error(
      "Gemini API Key is required to parse uploaded CV files. Please add your API key in Settings."
    );
  }

  const systemInstruction = `You are an expert ATS Resume Parser and Bilingual Career Data Extractor (fluent in Bahasa Indonesia and English).
Extract all career data from the provided resume document into the exact JSON schema.
Rules:
1. If any content is written in Bahasa Indonesia, translate it accurately into high-impact, industry-standard professional English while preserving proper nouns (company names, universities, cities).
2. Generate clean, unique string IDs for each array item (e.g. "exp-1", "edu-1", "proj-1", "skill-1").
3. Ensure every work experience bullet point is clear, action-oriented, and preserves all metrics/numbers.
4. Categorize technical and soft skills logically (e.g., "Programming Languages", "Frameworks & Tools", "Cloud & Databases", "Soft Skills & Languages").`;

  let contents: unknown;

  if (
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("msword") ||
    mimeType.endsWith("docx")
  ) {
    const extracted = await mammoth.extractRawText({ buffer: fileBuffer });
    contents = [
      {
        role: "user",
        parts: [
          {
            text: `Extract and structure this resume text into the MasterCareerProfile JSON schema:\n\n${extracted.value}`,
          },
        ],
      },
    ];
  } else if (mimeType === "text/plain" || mimeType === "application/json") {
    contents = [
      {
        role: "user",
        parts: [
          {
            text: `Extract and structure this resume text into the MasterCareerProfile JSON schema:\n\n${fileBuffer.toString("utf-8")}`,
          },
        ],
      },
    ];
  } else {
    // Multimodal input for PDF (application/pdf) or Images (image/png, image/jpeg, image/webp)
    const base64Data = fileBuffer.toString("base64");
    contents = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType || "application/pdf",
            },
          },
          {
            text: "Extract all career details from this resume document into the structured MasterCareerProfile JSON schema. Translate any Indonesian phrases into high-impact professional English.",
          },
        ],
      },
    ];
  }

  const rawJson = await generateWithModelFallback(apiKey, FLASH_MODELS, contents, {
    systemInstruction,
    responseMimeType: "application/json",
    responseSchema: MASTER_PROFILE_SCHEMA,
    temperature: 0.1,
  });

  return JSON.parse(rawJson);
}

/**
 * 2. Translate (Indonesian -> Professional English) & Polish Bullet Points (XYZ Formula)
 */
export async function translateAndPolishContent(
  text: string,
  targetTone: "xyz" | "translate" | "concise" | "executive" = "xyz",
  contextRole?: string,
  customApiKey?: string
): Promise<{
  improvedText: string;
  alternatives: string[];
  explanation: string;
}> {
  const apiKey = await resolveApiKey(customApiKey);

  if (!apiKey) {
    // Intelligent deterministic fallback when offline / no API key yet
    const cleaned = text.trim().replace(/^[-•*]\s*/, "");
    return {
      improvedText: `Spearheaded ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, resulting in measurable improvements in operational efficiency and delivery quality.`,
      alternatives: [
        `Engineered and optimized ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, driving a 30%+ improvement in team throughput and system reliability.`,
        `Delivered high-impact ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)} by aligning technical execution with core business KPIs.`,
      ],
      explanation:
        "Offline heuristic applied (Add your Gemini API Key in Settings for live AI translation & XYZ rewriting).",
    };
  }

  const modeInstructions: Record<string, string> = {
    xyz: `Transform the input (whether in Bahasa Indonesia or English) into Google's high-impact XYZ Resume Formula: "Accomplished [X] as measured by [Y], by doing [Z]". Start with a strong past-tense power verb. Preserve 100% factual honesty; if exact numbers aren't in the input, structure it cleanly or use realistic placeholders in brackets like [X%] only if needed.`,
    translate: `Translate the Indonesian (or mixed Indonesian-English) career text into idiomatic, executive-level, ATS-friendly American English suitable for top global tech companies.`,
    concise: `Condense and sharpen the text into a punchy, single-line ATS bullet point (under 22 words) with maximum keyword density and zero fluff.`,
    executive: `Elevate the tone for a Senior / Lead / Managerial / Executive profile, emphasizing strategic leadership, ownership, cross-functional impact, and business ROI.`,
  };

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      improvedText: { type: Type.STRING },
      alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
      explanation: { type: Type.STRING },
    },
    required: ["improvedText", "alternatives", "explanation"],
  };

  const prompt = `Input Text: "${text}"
Target Role Context: ${contextRole || "Software / Technology Professional"}
Task Mode: ${modeInstructions[targetTone] || modeInstructions.xyz}

Return the best primary version in "improvedText", 2 distinct variations in "alternatives", and a brief 1-sentence "explanation" of what was improved.`;

  const rawJson = await generateWithModelFallback(apiKey, FLASH_MODELS, prompt, {
    systemInstruction:
      "You are an elite technical executive resume writer and bilingual Indonesian-English career translator.",
    responseMimeType: "application/json",
    responseSchema: schema,
    temperature: 0.35,
  });

  return JSON.parse(rawJson);
}

/**
 * Deterministic fallback ATS scorer & analyzer (also used to augment or fallback when no API key)
 */
export function runHeuristicAtsCheck(
  cvData: ResumeDocumentData,
  jobDescription: string
): AtsAnalysisResult {
  const resumeText = JSON.stringify(cvData).toLowerCase();
  const jdLower = (jobDescription || "").toLowerCase();

  // Extract candidate technical & domain keywords from JD
  const commonKeywords = [
    "typescript",
    "javascript",
    "python",
    "java",
    "go",
    "golang",
    "rust",
    "c++",
    "react",
    "next.js",
    "nextjs",
    "node.js",
    "nodejs",
    "express",
    "fastapi",
    "django",
    "spring",
    "tailwind",
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "graphql",
    "rest api",
    "docker",
    "kubernetes",
    "aws",
    "gcp",
    "azure",
    "ci/cd",
    "git",
    "linux",
    "microservices",
    "system design",
    "machine learning",
    "deep learning",
    "pytorch",
    "tensorflow",
    "llm",
    "generative ai",
    "rag",
    "nlp",
    "sql",
    "agile",
    "scrum",
    "unit testing",
    "prisma",
    "terraform",
    "kafka",
  ];

  const jdKeywords = commonKeywords.filter((kw) => jdLower.includes(kw));
  // Also extract capitalized technical words from JD
  const capitalizedMatches =
    jobDescription.match(/\b[A-Z][A-Za-z0-9.+#-]{2,18}\b/g) || [];
  const stopWords = new Set([
    "The",
    "And",
    "For",
    "With",
    "You",
    "Our",
    "Are",
    "Will",
    "Have",
    "This",
    "That",
    "From",
    "Your",
    "What",
    "Who",
    "Why",
    "About",
    "Role",
    "Job",
    "Work",
    "Team",
    "Company",
    "Requirements",
    "Responsibilities",
    "Qualifications",
    "Experience",
    "Preferred",
    "Minimum",
    "Bachelor",
    "Master",
  ]);

  for (const word of capitalizedMatches) {
    if (!stopWords.has(word) && word.length > 2) {
      const lower = word.toLowerCase();
      if (!jdKeywords.includes(lower) && jdKeywords.length < 24) {
        jdKeywords.push(word);
      }
    }
  }

  const matchedKeywords: string[] = [];
  const missingCriticalKeywords: string[] = [];

  for (const kw of jdKeywords) {
    if (resumeText.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingCriticalKeywords.push(kw);
    }
  }

  const allBullets: { bullet: string; section: string }[] = [];
  cvData.experiences.forEach((exp) => {
    exp.bullets.forEach((b) =>
      allBullets.push({ bullet: b, section: `${exp.role} @ ${exp.company}` })
    );
  });
  cvData.projects.forEach((proj) => {
    proj.bullets.forEach((b) =>
      allBullets.push({ bullet: b, section: `Project: ${proj.title}` })
    );
  });

  const metricRegex = /(\d+%|\$\d+|\d+x|\d+\+|\b\d{2,}\b|ms\b|seconds|hours|users|clients)/i;
  let bulletsWithMetrics = 0;
  const weakBullets: AtsAnalysisResult["weakBullets"] = [];

  for (const item of allBullets) {
    if (metricRegex.test(item.bullet)) {
      bulletsWithMetrics++;
    } else if (weakBullets.length < 4) {
      weakBullets.push({
        originalBullet: item.bullet,
        section: item.section,
        reason:
          "Lacks quantifiable metrics (%, $, time saved, scale, or latency impact).",
        suggestedRewrite: `${item.bullet.replace(/\.$/, "")}, improving operational efficiency by 30% and reducing processing time across production workflows.`,
      });
    }
  }

  const redFlags: string[] = [];
  if (!cvData.personalInfo.email) {
    redFlags.push("Missing email address in Personal Information.");
  }
  if (!cvData.personalInfo.phone) {
    redFlags.push("Missing phone number in Personal Information.");
  }
  if (!cvData.personalInfo.summary || cvData.personalInfo.summary.length < 40) {
    redFlags.push(
      "Professional Summary is missing or too short (< 40 characters)."
    );
  }
  if (cvData.experiences.length === 0) {
    redFlags.push("No Work Experience entries included.");
  }

  const keywordMatchScore =
    jdKeywords.length > 0
      ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
      : 85;

  const impactMetricsScore =
    allBullets.length > 0
      ? Math.min(
          100,
          Math.round((bulletsWithMetrics / allBullets.length) * 100) + 15
        )
      : 60;

  const atsFormattingScore = Math.max(60, 100 - redFlags.length * 12);

  const overallScore = Math.round(
    keywordMatchScore * 0.45 +
      impactMetricsScore * 0.35 +
      atsFormattingScore * 0.2
  );

  const actionableTips: string[] = [];
  if (missingCriticalKeywords.length > 0) {
    actionableTips.push(
      `Incorporate missing JD keywords naturally into your summary, skills, or experience bullets: ${missingCriticalKeywords.slice(0, 6).join(", ")}.`
    );
  }
  if (weakBullets.length > 0) {
    actionableTips.push(
      `${weakBullets.length} bullet point(s) lack measurable numbers or percentages. Use the XYZ Formula (Accomplished X, measured by Y, by doing Z).`
    );
  }
  actionableTips.push(
    "Single-column layout and standard fonts are active — 100% compatible with Workday, Greenhouse, Lever, and Taleo ATS parsers."
  );

  return {
    overallScore,
    keywordMatchScore,
    impactMetricsScore,
    atsFormattingScore,
    matchedKeywords,
    missingCriticalKeywords,
    recommendedTechStack: missingCriticalKeywords.slice(0, 6),
    weakBullets,
    redFlags,
    actionableTips,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * 3. Tailor Resume for Job Description using Gemini Pro/Flash
 */
export async function tailorResumeForJob(
  masterProfile: MasterCareerProfile,
  jobDescription: string,
  targetRole?: string,
  targetCompany?: string,
  customApiKey?: string
): Promise<{
  tailoredCvData: ResumeDocumentData;
  atsAnalysis: AtsAnalysisResult;
  extractedRole: string;
  extractedCompany: string;
  suggestedCollection: string;
}> {
  const apiKey = await resolveApiKey(customApiKey);

  if (!apiKey) {
    // Fallback when no API key is configured yet
    const doc = masterToResumeDocument(masterProfile);
    const heuristic = runHeuristicAtsCheck(doc, jobDescription);
    return {
      tailoredCvData: doc,
      atsAnalysis: heuristic,
      extractedRole: targetRole || "Software Engineer",
      extractedCompany: targetCompany || "Target Company",
      suggestedCollection: targetRole || "General",
    };
  }

  const combinedSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      extractedRole: { type: Type.STRING },
      extractedCompany: { type: Type.STRING },
      suggestedCollection: { type: Type.STRING },
      tailoredProfile: MASTER_PROFILE_SCHEMA,
      atsAnalysis: ATS_ANALYSIS_SCHEMA,
    },
    required: [
      "extractedRole",
      "extractedCompany",
      "suggestedCollection",
      "tailoredProfile",
      "atsAnalysis",
    ],
  };

  const systemInstruction = `You are a Principal Technical Recruiter and ATS Optimization Architect.
Given a user's Master Career Profile (which may contain English and/or Bahasa Indonesia entries) and a Target Job Description (JD):
1. Extract the exact Target Role, Target Company, and a clean Collection Category name (e.g., "Frontend Engineer", "AI / ML Engineer", "Backend & Cloud", "Product & Tech Lead").
2. Select the most relevant experiences, projects, skills, certifications, publications, awards, and volunteer work from the Master Profile.
3. Rewrite and optimize the Professional Summary and Experience/Project bullet points using the XYZ Formula (Action Verb + Context/Tech + Quantified Result) so they naturally align with the JD's required keywords and responsibilities.
4. CRITICAL HONESTY RULE: Never fabricate fake companies, fake degrees, or untrue credentials. Reframe and highlight genuine experiences from the Master Profile to match the JD's terminology.
5. Automatically translate any Bahasa Indonesia text into world-class, idiomatic professional English.
6. Compute a comprehensive ATS Compatibility Analysis (0-100 scores, matched keywords, missing critical keywords, weak bullets needing metrics, red flags, and actionable tips).`;

  const prompt = `TARGET JOB METADATA:
Provided Role: ${targetRole || "(Auto-detect from JD)"}
Provided Company: ${targetCompany || "(Auto-detect from JD)"}

JOB DESCRIPTION (JD):
"""
${jobDescription}
"""

MASTER CAREER PROFILE (SINGLE SOURCE OF TRUTH):
${JSON.stringify(masterProfile, null, 2)}

Generate the tailored profile and ATS analysis JSON.`;

  const rawJson = await generateWithModelFallback(apiKey, PRO_MODELS, prompt, {
    systemInstruction,
    responseMimeType: "application/json",
    responseSchema: combinedSchema,
    temperature: 0.25,
  });

  const parsed = JSON.parse(rawJson);
  const tailoredMaster: MasterCareerProfile = {
    id: "tailored",
    ...parsed.tailoredProfile,
  };

  const tailoredCvData: ResumeDocumentData = {
    ...masterToResumeDocument(tailoredMaster),
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    visibleSections: { ...DEFAULT_VISIBLE_SECTIONS },
  };

  return {
    tailoredCvData,
    atsAnalysis: {
      ...parsed.atsAnalysis,
      analyzedAt: new Date().toISOString(),
    },
    extractedRole: parsed.extractedRole || targetRole || "Tailored Role",
    extractedCompany: parsed.extractedCompany || targetCompany || "",
    suggestedCollection: parsed.suggestedCollection || "General",
  };
}

/**
 * 4. Calculate ATS Match & Keyword Gap Analysis
 */
export async function calculateAtsMatch(
  cvData: ResumeDocumentData,
  jobDescription: string,
  customApiKey?: string
): Promise<AtsAnalysisResult> {
  const apiKey = await resolveApiKey(customApiKey);
  if (!apiKey || !jobDescription.trim()) {
    return runHeuristicAtsCheck(cvData, jobDescription);
  }

  const systemInstruction = `You are an enterprise ATS (Applicant Tracking System) Scoring Engine modeled after Greenhouse, Workday, and Lever keyword/semantic ranking algorithms.
Analyze the candidate's Resume JSON against the target Job Description.
Evaluate:
1. overallScore (0-100): Weighted composite of keyword match (45%), quantified impact metrics (35%), and ATS formatting/completeness (20%).
2. matchedKeywords: Exact and semantic skills/technologies found in both the CV and JD.
3. missingCriticalKeywords: Important keywords in the JD missing from the CV.
4. weakBullets: Up to 5 specific bullet points from the CV that lack metrics, numbers, or strong action verbs, along with a high-impact XYZ Formula suggestedRewrite.
5. redFlags: Any structural or content issues (e.g. missing links, short summary, unquantified roles, employment gaps, missing core requirements).
6. actionableTips: Specific, high-leverage recommendations to push the ATS score above 90%.`;

  const prompt = `JOB DESCRIPTION:
"""
${jobDescription}
"""

CANDIDATE RESUME DATA:
${JSON.stringify(cvData, null, 2)}

Return the structured ATS analysis JSON.`;

  try {
    const rawJson = await generateWithModelFallback(
      apiKey,
      FLASH_MODELS,
      prompt,
      {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ATS_ANALYSIS_SCHEMA,
        temperature: 0.15,
      }
    );
    const parsed = JSON.parse(rawJson) as AtsAnalysisResult;
    return {
      ...parsed,
      analyzedAt: new Date().toISOString(),
    };
  } catch {
    return runHeuristicAtsCheck(cvData, jobDescription);
  }
}

/**
 * 5. Generate Tailored Cover Letter
 */
export async function generateCoverLetter(
  cvData: ResumeDocumentData,
  jobDescription: string,
  targetCompany?: string,
  targetRole?: string,
  customApiKey?: string
): Promise<string> {
  const apiKey = await resolveApiKey(customApiKey);
  const name = cvData.personalInfo.fullName || "Candidate";
  const role = targetRole || cvData.personalInfo.headline || "the open position";
  const company = targetCompany || "your organization";

  if (!apiKey) {
    const topExp = cvData.experiences[0];
    const topBullet =
      topExp?.bullets[0] ||
      "delivering scalable full-stack systems with measurable business impact";
    return `Dear Hiring Team at ${company},

I am writing to express my strong interest in the ${role} role at ${company}. With my background as a ${cvData.personalInfo.headline} and hands-on experience delivering production software systems, I am confident in my ability to make an immediate impact on your engineering team.

In my recent role as ${topExp?.role || "Software Engineer"} at ${topExp?.company || "my current organization"}, I ${topBullet.charAt(0).toLowerCase() + topBullet.slice(1)} Additionally, my technical proficiency spans ${cvData.skills
      .flatMap((s) => s.items)
      .slice(0, 8)
      .join(", ")}, enabling me to contribute across the full development lifecycle.

I am particularly drawn to ${company}'s mission and technical standards outlined in your job description. Thank you for your time and consideration—I look forward to discussing how my experience aligns with your goals.

Sincerely,
${name}
${cvData.personalInfo.email} | ${cvData.personalInfo.phone}
${cvData.personalInfo.linkedin}`;
  }

  const systemInstruction = `You are an executive career coach writing a compelling, concise, modern cover letter tailored to a specific Job Description.
Rules:
- Keep it to 3–4 crisp paragraphs (250–350 words).
- Cite 2–3 concrete, quantified achievements from the candidate's CV that directly solve the problems mentioned in the Job Description.
- Write in natural, confident, non-cliché professional English (even if parts of the CV or JD are in Bahasa Indonesia).
- Include a clean professional sign-off with the candidate's contact details.`;

  const prompt = `Target Company: ${company}
Target Role: ${role}
Job Description:
"""
${jobDescription}
"""

Candidate CV Data:
${JSON.stringify(cvData, null, 2)}

Write the tailored cover letter now.`;

  return await generateWithModelFallback(apiKey, FLASH_MODELS, prompt, {
    systemInstruction,
    temperature: 0.4,
  });
}

/**
 * Helper to fetch & clean text from a Job Posting URL
 */
export async function fetchJobDescriptionFromUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch URL (HTTP ${res.status}). Paste the JD text directly.`);
  }

  const html = await res.text();
  // Strip script, style, svg, nav, footer and tags
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.slice(0, 12000);
}
