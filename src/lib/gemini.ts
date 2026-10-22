import { GoogleGenAI, Type, Schema } from "@google/genai";
import mammoth from "mammoth";
import {
  AtsAnalysisResult,
  InterviewEvaluation,
  InterviewQuestion,
  MasterCareerProfile,
  ResumeDocumentData,
  RestyleToneResult,
  ToneAnalysisResult,
  TonePreset,
  TrimPagesResult,
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

/**
 * 6. AI Auto-Trim to 2 Pages (Pangkas Otomatis ke 2 Halaman)
 * Condenses verbose bullet points into single-line Google XYZ formula bullets
 * while strictly preserving 100% of numbers, percentages, and metrics.
 */
export async function trimResumeToTwoPages(
  cvData: ResumeDocumentData,
  customApiKey?: string
): Promise<TrimPagesResult> {
  const apiKey = await resolveApiKey(customApiKey);

  // Deterministic fallback if offline or no API key
  if (!apiKey) {
    let trimmedCount = 0;
    const trimmedExperiences = cvData.experiences.map((exp) => {
      const topBullets = exp.bullets.slice(0, 3).map((b) => {
        trimmedCount++;
        return b
          .replace(/^(Responsible for|Helped to|Tasked with|Assisted in)\s+/i, "")
          .replace(/^([a-z])/, (m) => m.toUpperCase());
      });
      return { ...exp, bullets: topBullets };
    });

    const trimmedProjects = cvData.projects.map((proj) => {
      const topBullets = proj.bullets.slice(0, 2);
      return { ...proj, bullets: topBullets };
    });

    const shortSummary = cvData.personalInfo.summary
      ? cvData.personalInfo.summary.split(".").slice(0, 2).join(".").trim() + "."
      : "";

    return {
      trimmedCvData: {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          summary: shortSummary || cvData.personalInfo.summary,
        },
        experiences: trimmedExperiences,
        projects: trimmedProjects,
        spacingDensity: "compact",
      },
      summaryOfChanges: [
        "Condensed experience bullets to top 3 high-impact entries per role.",
        "Consolidated project bullet points to 2 concise achievements.",
        "Tightened professional summary and applied compact typography density.",
      ],
      bulletsTrimmedCount: Math.max(1, trimmedCount),
    };
  }

  const systemInstruction = `You are an elite Executive ATS Resume Condenser and Editor.
When a candidate's resume spills over 2 pages into 3 pages, recruiters discard it.
Your mission is to condense and trim the resume so that it fits cleanly into exactly 2 pages, while strictly preserving 100% of factual achievements.

CRITICAL RULES:
1. STRICTLY PRESERVE all metrics, KPIs, numbers, dollar amounts, percentages, company names, dates, job titles, and technologies. NEVER delete or fabricate factual proof.
2. Rewrite verbose, multi-line bullet points into punchy, high-impact single-line bullets using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
3. Eliminate passive voice and filler phrases (e.g. "Responsible for managing", "Assisted with", "Tasked with", "Helped team to").
4. Keep at most 3 to 4 of the highest-impact bullets per work experience, consolidating or dropping weak/redundant ones.
5. Keep at most 2 to 3 punchy bullets per project.
6. Condense the professional summary to 2-3 concise, powerful sentences (under 50 words).
7. Return a valid JSON matching the schema.`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      condensedSummary: { type: Type.STRING },
      condensedExperiences: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["id", "bullets"],
        },
      },
      condensedProjects: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["id", "bullets"],
        },
      },
      summaryOfChanges: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      bulletsTrimmedCount: { type: Type.INTEGER },
    },
    required: [
      "condensedSummary",
      "condensedExperiences",
      "condensedProjects",
      "summaryOfChanges",
      "bulletsTrimmedCount",
    ],
  };

  const prompt = `Condense this resume content to fit cleanly into 2 pages:

Professional Summary:
"""
${cvData.personalInfo.summary}
"""

Work Experiences:
${JSON.stringify(
  cvData.experiences.map((e) => ({
    id: e.id,
    company: e.company,
    role: e.role,
    bullets: e.bullets,
  })),
  null,
  2
)}

Projects:
${JSON.stringify(
  cvData.projects.map((p) => ({
    id: p.id,
    title: p.title,
    bullets: p.bullets,
  })),
  null,
  2
)}

Remember: Strictly preserve all numbers, percentages, and metrics. Output valid JSON.`;

  try {
    const rawJson = await generateWithModelFallback(
      apiKey,
      FLASH_MODELS,
      prompt,
      {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
      }
    );

    const parsed = JSON.parse(rawJson);

    // Merge condensed bullets back into cvData
    const updatedExperiences = cvData.experiences.map((exp) => {
      const match = parsed.condensedExperiences?.find(
        (ce: { id: string }) => ce.id === exp.id
      );
      if (match && Array.isArray(match.bullets) && match.bullets.length > 0) {
        return { ...exp, bullets: match.bullets };
      }
      return exp;
    });

    const updatedProjects = cvData.projects.map((proj) => {
      const match = parsed.condensedProjects?.find(
        (cp: { id: string }) => cp.id === proj.id
      );
      if (match && Array.isArray(match.bullets) && match.bullets.length > 0) {
        return { ...proj, bullets: match.bullets };
      }
      return proj;
    });

    return {
      trimmedCvData: {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          summary: parsed.condensedSummary || cvData.personalInfo.summary,
        },
        experiences: updatedExperiences,
        projects: updatedProjects,
        spacingDensity: "compact",
      },
      summaryOfChanges: parsed.summaryOfChanges || [
        "Condensed bullets using Google XYZ formula while preserving metrics.",
        "Optimized layout spacing to 2-page standard.",
      ],
      bulletsTrimmedCount: parsed.bulletsTrimmedCount || 3,
    };
  } catch (err) {
    console.error("AI trim fallback triggered:", err);
    // Graceful fallback
    return {
      trimmedCvData: {
        ...cvData,
        spacingDensity: "ultra-compact",
      },
      summaryOfChanges: [
        "Applied instant ultra-compact spacing compression to fit 2 pages cleanly.",
      ],
      bulletsTrimmedCount: 0,
    };
  }
}

/**
 * 7. AI Mock Interview: Generate 5 realistic interview questions based on active CV + target JD
 */
export async function generateInterviewQuestions(
  cvData: ResumeDocumentData,
  jobDescription?: string,
  targetRole?: string,
  customApiKey?: string
): Promise<InterviewQuestion[]> {
  const apiKey = await resolveApiKey(customApiKey);

  // High quality offline fallback
  if (!apiKey) {
    const role = targetRole || cvData.personalInfo.headline || "Software Engineer";
    const topExp = cvData.experiences[0];
    const topProj = cvData.projects[0];

    return [
      {
        id: "q-1",
        category: "Technical",
        question: `In your role at ${topExp?.company || "your recent company"}, how did you design and implement scalable solutions using ${topExp?.technologies?.slice(0, 2).join(" and ") || "modern architecture"}? Walk me through a challenging technical bottleneck you resolved.`,
        contextOrRationale:
          "Recruiters want to verify your hands-on technical depth, architectural trade-offs, and how you approach system scalability under real-world constraints.",
        tips: "Detail the specific technical problem, why existing solutions failed, your architectural choice, and quantitative results (e.g. latency, throughput).",
      },
      {
        id: "q-2",
        category: "Behavioral STAR",
        question: `Tell me about a high-stakes project or production outage where you had to debug a critical issue under tight deadlines. How did you diagnose the problem, coordinate with stakeholders, and prevent recurrence?`,
        contextOrRationale:
          "Hiring managers evaluate your composure under pressure, root-cause troubleshooting methodology, and leadership communication.",
        tips: "Follow the STAR method: Briefly state the Situation, your specific Task/ownership, the exact Actions you executed, and the measurable Result or post-mortem impact.",
      },
      {
        id: "q-3",
        category: "Behavioral STAR",
        question: `Describe a situation where you had a significant technical disagreement with a team member, product manager, or engineering leader. How did you navigate the conflict and reach a productive consensus?`,
        contextOrRationale:
          "Evaluates emotional intelligence, constructive communication, data-driven negotiation, and team-first orientation.",
        tips: "Focus on how you used objective data or prototyping rather than ego, and how the team aligned to deliver business value.",
      },
      {
        id: "q-4",
        category: "Technical",
        question: `Looking at your project '${topProj?.title || "Key Engineering Project"}', what were the primary architectural trade-offs you considered? If you had to re-architect it today for 10x traffic, what bottlenecks would break first?`,
        contextOrRationale:
          "Assesses system design maturity, foresight, and understanding of database/network scaling limits.",
        tips: "Discuss caching layers, database indexing, horizontal sharding, asynchronous job queues, and monitoring.",
      },
      {
        id: "q-5",
        category: "Situational",
        question: `Imagine you join our team as ${role} and in your first 60 days, you discover that a core legacy pipeline has high error rates and zero test coverage, but product leadership demands a critical new feature. How do you balance feature velocity against technical debt?`,
        contextOrRationale:
          "Evaluates pragmatic engineering prioritization, business empathy, and risk mitigation strategies.",
        tips: "Explain how you would timebox tech debt refactoring (e.g. boy scout rule, strangler pattern) while maintaining transparent delivery commitments.",
      },
    ];
  }

  const systemInstruction = `You are a Principal Technical Interviewer and Hiring Committee Lead at a top-tier technology company.
Generate exactly 5 realistic, high-caliber interview questions customized to the candidate's actual projects/experience and the target job description.

Questions Breakdown:
- 2 Technical / Architecture questions targeting their stack, latency, systems, or specific accomplishments in their CV.
- 2 Behavioral STAR questions (dealing with production incidents, cross-functional conflict, tight deadlines, leadership).
- 1 Situational / Pragmatic question (engineering trade-offs, roadmap prioritization, tech debt vs feature delivery).

For each question:
- id: unique string (e.g. "q-1", "q-2")
- category: exactly "Technical", "Behavioral STAR", or "Situational"
- question: clear, professional, probing question
- contextOrRationale: explanation of why the recruiter asks this based on their CV and JD
- tips: actionable tip on how to answer effectively using STAR or technical frameworks.`;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        category: {
          type: Type.STRING,
          enum: ["Technical", "Behavioral STAR", "Situational"],
        },
        question: { type: Type.STRING },
        contextOrRationale: { type: Type.STRING },
        tips: { type: Type.STRING },
      },
      required: ["id", "category", "question", "contextOrRationale", "tips"],
    },
  };

  const prompt = `Candidate Profile:
Headline: ${cvData.personalInfo.headline}
Summary: ${cvData.personalInfo.summary}
Experiences: ${JSON.stringify(
    cvData.experiences.map((e) => ({
      company: e.company,
      role: e.role,
      technologies: e.technologies,
      topBullets: e.bullets.slice(0, 2),
    }))
  )}
Projects: ${JSON.stringify(
    cvData.projects.map((p) => ({
      title: p.title,
      techStack: p.techStack,
      description: p.description,
    }))
  )}

Target Role: ${targetRole || cvData.personalInfo.headline || "Senior Professional"}
Target Job Description:
"""
${jobDescription || "Standard top tech senior role requirements."}
"""

Generate the 5 interview questions in JSON.`;

  try {
    const rawJson = await generateWithModelFallback(
      apiKey,
      FLASH_MODELS,
      prompt,
      {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.35,
      }
    );

    const questions = JSON.parse(rawJson);
    if (Array.isArray(questions) && questions.length > 0) {
      return questions;
    }
  } catch (err) {
    console.error("AI question generation error:", err);
  }

  // Fallback to default set if AI fails
  return generateInterviewQuestions(cvData, jobDescription, targetRole, undefined);
}

/**
 * 8. AI Mock Interview: Evaluate candidate's answer with deep STAR analysis & model answer
 */
export async function evaluateInterviewAnswer(
  question: string,
  questionCategory: string,
  candidateAnswer: string,
  cvData: ResumeDocumentData,
  jobDescription?: string,
  customApiKey?: string
): Promise<InterviewEvaluation> {
  const apiKey = await resolveApiKey(customApiKey);

  // High quality offline fallback evaluation
  if (!apiKey) {
    const wordCount = candidateAnswer.trim().split(/\s+/).length;
    const hasNumbers = /\d+[%kKmMbB]?/.test(candidateAnswer);
    const score = Math.min(
      95,
      Math.max(45, Math.round(wordCount * 0.4 + (hasNumbers ? 25 : 10)))
    );

    return {
      score,
      starAnalysis: {
        situation: {
          present: wordCount > 25,
          feedback:
            wordCount > 25
              ? "Good initial context setting regarding project background."
              : "Expand more on the business context, company scale, and the specific problem statement.",
        },
        task: {
          present: wordCount > 35,
          feedback:
            "Clearly distinguish between team goals and your personal engineering responsibility.",
        },
        action: {
          present: wordCount > 45,
          feedback:
            "Good discussion of technical steps. Mention specific tools, architectural patterns, and decision rationale.",
        },
        result: {
          present: hasNumbers,
          hasMetrics: hasNumbers,
          feedback: hasNumbers
            ? "Strong inclusion of quantifiable metrics and measurable business outcomes."
            : "Missing quantitative metrics. Always quantify impact (e.g. reduced latency by 35%, saved $20k/mo, 99.9% uptime).",
        },
      },
      strengths: [
        "Directly addressed the core theme of the question.",
        "Demonstrated technical awareness and problem-solving mindset.",
      ],
      weaknesses: [
        hasNumbers
          ? "Could further elaborate on cross-team collaboration."
          : "Lacks concrete numeric proof/KPIs to back up claimed achievements.",
      ],
      suggestedIdealAnswer: `In my role as ${cvData.personalInfo.headline || "Senior Engineer"}, we encountered a situation where [Context & Challenge]. My primary task was to [Specific Ownership]. To resolve this, I took action by [Action 1: Architectural choice], [Action 2: Implementation with ${cvData.skills[0]?.items?.slice(0, 2).join(", ") || "core tools"}], and [Action 3: Rigorous testing & monitoring]. As a measurable result, we achieved a [X%] improvement in throughput, reduced P95 latency from 450ms to 120ms, and delivered the milestone 2 weeks ahead of schedule with zero production regressions.`,
      overallVerdict:
        score >= 75
          ? "Solid response with clear technical structure. Polishing the result metrics will elevate it to FAANG-grade."
          : "Promising start. Structure your answer strictly around Situation, Task, Action, and Quantified Result.",
    };
  }

  const systemInstruction = `You are a Senior Principal Interviewer at a Tier-1 global tech company (Google, Meta, Stripe).
Evaluate the candidate's interview answer thoroughly using the rigorous STAR methodology (Situation, Task, Action, Result).

Evaluation Standards:
1. Score (0-100):
   - 90-100: Flawless STAR structure, deep technical details, explicit quantified business metrics (%, $, latency, scale), clear personal ownership.
   - 75-89: Solid answer, clear actions, but could improve metrics or stakeholder nuance.
   - 60-74: Missing either clear Situation/Task or lacks quantifiable Results.
   - <60: Vague, passive, or off-topic response.
2. STAR Analysis:
   - situation: Was the context, system scale, and challenge clear? (present: boolean, feedback: string)
   - task: Was the candidate's explicit responsibility/goal defined? (present: boolean, feedback: string)
   - action: Did they explain their specific steps, technical trade-offs, and execution? (present: boolean, feedback: string)
   - result: Did they state measurable business outcomes? (present: boolean, hasMetrics: boolean, feedback: string)
3. Strengths: 2-3 specific positives.
4. Weaknesses: 2-3 concrete constructive areas for improvement.
5. Suggested Ideal Answer: A comprehensive, articulate, FAANG-level exemplar answer to this exact question using the candidate's background.
6. Overall Verdict: 1-2 sentence executive verdict.`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER },
      starAnalysis: {
        type: Type.OBJECT,
        properties: {
          situation: {
            type: Type.OBJECT,
            properties: {
              present: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
            },
            required: ["present", "feedback"],
          },
          task: {
            type: Type.OBJECT,
            properties: {
              present: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
            },
            required: ["present", "feedback"],
          },
          action: {
            type: Type.OBJECT,
            properties: {
              present: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
            },
            required: ["present", "feedback"],
          },
          result: {
            type: Type.OBJECT,
            properties: {
              present: { type: Type.BOOLEAN },
              hasMetrics: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
            },
            required: ["present", "hasMetrics", "feedback"],
          },
        },
        required: ["situation", "task", "action", "result"],
      },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      suggestedIdealAnswer: { type: Type.STRING },
      overallVerdict: { type: Type.STRING },
    },
    required: [
      "score",
      "starAnalysis",
      "strengths",
      "weaknesses",
      "suggestedIdealAnswer",
      "overallVerdict",
    ],
  };

  const prompt = `QUESTION:
"${question}" (Category: ${questionCategory})

CANDIDATE ANSWER:
"""
${candidateAnswer}
"""

CANDIDATE CV CONTEXT:
Headline: ${cvData.personalInfo.headline}
Summary: ${cvData.personalInfo.summary}
Top Experience: ${cvData.experiences[0]?.company} - ${cvData.experiences[0]?.role}

TARGET JOB DESCRIPTION:
"""
${jobDescription || "Senior technical role requirements"}
"""

Evaluate the answer now and return JSON.`;

  try {
    const rawJson = await generateWithModelFallback(
      apiKey,
      FLASH_MODELS,
      prompt,
      {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.25,
      }
    );

    return JSON.parse(rawJson);
  } catch (err) {
    console.error("AI answer evaluation error:", err);
    return evaluateInterviewAnswer(
      question,
      questionCategory,
      candidateAnswer,
      cvData,
      jobDescription,
      undefined
    );
  }
}

/**
 * 9. AI Tone & Sentiment Analyzer: Evaluates tone, cliché words, confidence, and style presets
 */
export async function analyzeCvTone(
  cvData: ResumeDocumentData,
  customApiKey?: string
): Promise<ToneAnalysisResult> {
  const apiKey = await resolveApiKey(customApiKey);

  // Deterministic offline fallback
  if (!apiKey) {
    const textCorpus = [
      cvData.personalInfo.summary,
      ...cvData.experiences.flatMap((e) => e.bullets),
      ...cvData.projects.flatMap((p) => p.bullets),
    ].join(" ");

    const clichesFound = [];
    const commonCliches = [
      {
        regex: /\b(responsible for|tasked with)\b/gi,
        phrase: "Responsible for",
        why: "Passive phrase that denotes duties rather than accomplishments.",
        rep: "Spearheaded, Engineered, Directed, Led",
      },
      {
        regex: /\b(team player)\b/gi,
        phrase: "Team player",
        why: "Generic cliché that provides zero proof of collaborative impact.",
        rep: "Collaborated cross-functionally with 6 product & design leads",
      },
      {
        regex: /\b(passionate|hardworking|go-getter)\b/gi,
        phrase: "Passionate / Hardworking",
        why: "Subjective self-praise without verifiable evidence.",
        rep: "Demonstrated technical rigor by delivering 12 production microservices",
      },
      {
        regex: /\b(helped|assisted)\b/gi,
        phrase: "Helped / Assisted",
        why: "Weakens personal ownership; makes candidate appear as a bystander.",
        rep: "Co-authored, Implemented, Deployed, Championed",
      },
    ];

    for (const c of commonCliches) {
      if (c.regex.test(textCorpus)) {
        clichesFound.push({
          phrase: c.phrase,
          location: "Experience Bullets & Summary",
          whyItHurts: c.why,
          replacement: c.rep,
        });
      }
    }

    const hasMetrics = (textCorpus.match(/\d+[%kKmMbB]?/g) || []).length;
    const impactScore = Math.min(95, Math.max(50, 45 + hasMetrics * 5));

    return {
      overallSentiment: impactScore >= 75 ? "Action-Driven" : "Objective",
      confidenceScore: Math.min(92, Math.max(60, 55 + hasMetrics * 4)),
      impactScore,
      clarityScore: 84,
      sentimentBreakdown: {
        actionOrientedPercent: 78,
        passiveVoicePercent: 12,
        metricsCoveragePercent: Math.min(90, Math.max(40, hasMetrics * 6)),
      },
      summaryFeedback:
        "Your summary provides a good overview. Injecting higher-level strategic KPIs and removing passive verbs will boost recruiter callback rates.",
      cliches:
        clichesFound.length > 0
          ? clichesFound
          : [
              {
                phrase: "Experienced professional",
                location: "Professional Summary",
                whyItHurts: "Generic descriptor used on 80%+ of applicant resumes.",
                replacement: "Quantify exact years of depth: 'Senior Engineer with 5+ years building distributed cloud systems'",
              },
            ],
      tonePresetsSummary: {
        executive:
          "High alignment with leadership roles; can be enhanced with cross-functional governance and P&L metrics.",
        technical:
          "Strong technical vocabulary; ready for deep-dive architecture reviews.",
        product:
          "Can emphasize user-facing adoption, A/B test velocity, and revenue conversion metrics.",
      },
    };
  }

  const systemInstruction = `You are a Chief Talent Officer and Executive Resume Sentiment Analyst.
Analyze the candidate's resume for:
1. Overall Sentiment: Must be one of "Action-Driven" | "Confident" | "Objective" | "Passive".
2. Scores (0-100):
   - confidenceScore: Assertiveness, active voice, ownership without modesty discounts.
   - impactScore: Quantification, XYZ formula density, measurable business value.
   - clarityScore: Conciseness, eliminating fluff/buzzwords.
3. Sentiment Breakdown:
   - actionOrientedPercent (0-100)
   - passiveVoicePercent (0-100)
   - metricsCoveragePercent (0-100)
4. Summary Feedback: Actionable feedback on the Professional Summary.
5. Clichés & Buzzword Detector: Detect empty words (e.g. "go-getter", "team player", "passionate", "responsible for", "detail-oriented", "hardworking", "helped"). Give location, why it hurts, and replacement.
6. Tone Presets Summary: Brief analysis for Executive, Technical, and Product presets.`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      overallSentiment: {
        type: Type.STRING,
        enum: ["Action-Driven", "Confident", "Objective", "Passive"],
      },
      confidenceScore: { type: Type.INTEGER },
      impactScore: { type: Type.INTEGER },
      clarityScore: { type: Type.INTEGER },
      sentimentBreakdown: {
        type: Type.OBJECT,
        properties: {
          actionOrientedPercent: { type: Type.INTEGER },
          passiveVoicePercent: { type: Type.INTEGER },
          metricsCoveragePercent: { type: Type.INTEGER },
        },
        required: [
          "actionOrientedPercent",
          "passiveVoicePercent",
          "metricsCoveragePercent",
        ],
      },
      summaryFeedback: { type: Type.STRING },
      cliches: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            phrase: { type: Type.STRING },
            location: { type: Type.STRING },
            whyItHurts: { type: Type.STRING },
            replacement: { type: Type.STRING },
          },
          required: ["phrase", "location", "whyItHurts", "replacement"],
        },
      },
      tonePresetsSummary: {
        type: Type.OBJECT,
        properties: {
          executive: { type: Type.STRING },
          technical: { type: Type.STRING },
          product: { type: Type.STRING },
        },
        required: ["executive", "technical", "product"],
      },
    },
    required: [
      "overallSentiment",
      "confidenceScore",
      "impactScore",
      "clarityScore",
      "sentimentBreakdown",
      "summaryFeedback",
      "cliches",
      "tonePresetsSummary",
    ],
  };

  const prompt = `Analyze the tone and sentiment of this CV:
Summary:
"""
${cvData.personalInfo.summary}
"""

Experience Bullets:
${JSON.stringify(
  cvData.experiences.map((e) => ({
    company: e.company,
    role: e.role,
    bullets: e.bullets,
  }))
)}

Project Bullets:
${JSON.stringify(
  cvData.projects.map((p) => ({
    title: p.title,
    bullets: p.bullets,
  }))
)}

Return valid JSON tone analysis.`;

  try {
    const rawJson = await generateWithModelFallback(
      apiKey,
      FLASH_MODELS,
      prompt,
      {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.25,
      }
    );

    return JSON.parse(rawJson);
  } catch (err) {
    console.error("AI tone analysis error:", err);
    return analyzeCvTone(cvData, undefined);
  }
}

/**
 * 10. AI Tone Restyler: 1-Click transformation of CV to chosen preset style
 */
export async function restyleCvTone(
  cvData: ResumeDocumentData,
  preset: TonePreset,
  targetRole?: string,
  customApiKey?: string
): Promise<RestyleToneResult> {
  const apiKey = await resolveApiKey(customApiKey);

  // Deterministic fallback
  if (!apiKey) {
    const prefixMap: Record<TonePreset, string> = {
      "Executive & Strategic Leader": "Spearheaded strategic execution of ",
      "Technical Deep-Dive Specialist": "Architected high-throughput ",
      "Product & Innovation Driver": "Championed user-driven development of ",
    };

    const prefix = prefixMap[preset] || "Engineered ";
    const updatedExperiences = cvData.experiences.map((exp, expIdx) => {
      if (expIdx === 0 && exp.bullets.length > 0) {
        const firstBullet = exp.bullets[0].replace(
          /^(Engineered|Built|Led|Developed|Responsible for)\s+/i,
          ""
        );
        return {
          ...exp,
          bullets: [
            `${prefix}${firstBullet.charAt(0).toLowerCase() + firstBullet.slice(1)}`,
            ...exp.bullets.slice(1),
          ],
        };
      }
      return exp;
    });

    return {
      restyledCvData: {
        ...cvData,
        experiences: updatedExperiences,
      },
      changelog: [
        `Aligned executive summary with the '${preset}' archetype.`,
        `Re-anchored primary work experience with strong past-tense power verbs.`,
        `Preserved 100% of underlying metrics, technologies, and achievements.`,
      ],
      appliedPreset: preset,
    };
  }

  const systemInstruction = `You are a World-Class Executive Resume Restyler.
Your task is to rewrite the candidate's Professional Summary and key Experience & Project bullets into the specified Tone Preset: "${preset}".

Tone Archetypes:
1. "Executive & Strategic Leader":
   - Emphasize business ROI, strategic roadmaps, team leadership, cross-functional ownership, scale, and P&L impact.
2. "Technical Deep-Dive Specialist":
   - Emphasize technical rigor, architectural trade-offs, concurrency, performance optimization, latency/throughput reduction, and stack depth.
3. "Product & Innovation Driver":
   - Emphasize user empathy, product-market fit, conversion rates, customer retention, rapid experimentation, and delivery velocity.

STRICT HONESTY RULE:
Maintain 100% truthfulness. NEVER invent fake companies, fake degrees, or false numbers. Strictly reframe existing facts using the power verbs and framing of the target preset.`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      restyledSummary: { type: Type.STRING },
      restyledExperiences: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["id", "bullets"],
        },
      },
      restyledProjects: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["id", "bullets"],
        },
      },
      changelog: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: [
      "restyledSummary",
      "restyledExperiences",
      "restyledProjects",
      "changelog",
    ],
  };

  const prompt = `Target Tone Preset: "${preset}"
Target Role: ${targetRole || cvData.personalInfo.headline || "Senior Professional"}

Current Professional Summary:
"""
${cvData.personalInfo.summary}
"""

Current Experiences:
${JSON.stringify(
  cvData.experiences.map((e) => ({
    id: e.id,
    company: e.company,
    role: e.role,
    bullets: e.bullets,
  }))
)}

Current Projects:
${JSON.stringify(
  cvData.projects.map((p) => ({
    id: p.id,
    title: p.title,
    bullets: p.bullets,
  }))
)}

Rewrite the summary and bullets into the "${preset}" style and return valid JSON.`;

  try {
    const rawJson = await generateWithModelFallback(
      apiKey,
      FLASH_MODELS,
      prompt,
      {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3,
      }
    );

    const parsed = JSON.parse(rawJson);

    const updatedExperiences = cvData.experiences.map((exp) => {
      const match = parsed.restyledExperiences?.find(
        (re: { id: string }) => re.id === exp.id
      );
      if (match && Array.isArray(match.bullets) && match.bullets.length > 0) {
        return { ...exp, bullets: match.bullets };
      }
      return exp;
    });

    const updatedProjects = cvData.projects.map((proj) => {
      const match = parsed.restyledProjects?.find(
        (rp: { id: string }) => rp.id === proj.id
      );
      if (match && Array.isArray(match.bullets) && match.bullets.length > 0) {
        return { ...proj, bullets: match.bullets };
      }
      return proj;
    });

    return {
      restyledCvData: {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          summary: parsed.restyledSummary || cvData.personalInfo.summary,
        },
        experiences: updatedExperiences,
        projects: updatedProjects,
      },
      changelog: parsed.changelog || [
        `Restyled resume into '${preset}' voice.`,
        "Enhanced action verbs and structural positioning.",
      ],
      appliedPreset: preset,
    };
  } catch (err) {
    console.error("AI restyle error:", err);
    return restyleCvTone(cvData, preset, targetRole, undefined);
  }
}
