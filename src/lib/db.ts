import { PrismaClient } from "@prisma/client";
import {
  AtsAnalysisResult,
  BackupPayload,
  JobApplicationRecord,
  MasterCareerProfile,
  ResumeDocumentData,
  ResumeSectionKey,
  StandardFontFamily,
  TailoredResumeRecord,
  TemplateId,
} from "@/types/resume";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const DEFAULT_SECTION_ORDER: ResumeSectionKey[] = [
  "summary",
  "experiences",
  "projects",
  "skills",
  "education",
  "certifications",
  "publications",
  "awards",
  "volunteer",
];

export const DEFAULT_VISIBLE_SECTIONS: Record<ResumeSectionKey, boolean> = {
  summary: true,
  experiences: true,
  projects: true,
  skills: true,
  education: true,
  certifications: true,
  publications: true,
  awards: true,
  volunteer: true,
};

export const INITIAL_MASTER_PROFILE: MasterCareerProfile = {
  id: "default",
  personalInfo: {
    fullName: "Abiya Makruf",
    headline: "Full-Stack Software Engineer & AI Systems Architect",
    email: "abiya.makruf@example.com",
    phone: "+62 812-3456-7890",
    location: "Jakarta, Indonesia",
    linkedin: "linkedin.com/in/abiyamakruf",
    github: "github.com/abiyamf",
    portfolio: "abiyamakruf.dev",
    summary:
      "Results-driven Software Engineer & AI Practitioner with 4+ years of experience building scalable distributed web platforms, LLM-powered automation pipelines, and data-intensive products. Proven track record of reducing cloud latency by 42% and improving engineering throughput across cross-functional teams.",
  },
  experiences: [
    {
      id: "exp-1",
      company: "Nusantara Cloud Technologies",
      role: "Senior Full-Stack & AI Engineer",
      employmentType: "Full-time",
      location: "Jakarta, Indonesia (Hybrid)",
      startDate: "Jan 2024",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected a multi-tenant AI document processing pipeline using Next.js, TypeScript, and Google Gemini API, reducing manual data entry time by 68% across 12,000+ monthly documents.",
        "Optimized PostgreSQL query execution plans and introduced Redis caching layers, cutting P95 API latency from 480ms to 135ms under peak load of 1,500 RPS.",
        "Spearheaded a squad of 5 engineers to deliver an automated recruitment screening dashboard, increasing recruiter shortlisting accuracy by 35%.",
      ],
      technologies: [
        "TypeScript",
        "Next.js",
        "Node.js",
        "Google Gemini API",
        "PostgreSQL",
        "Redis",
        "Docker",
      ],
    },
    {
      id: "exp-2",
      company: "Garuda FinTech Digital",
      role: "Software Engineer",
      employmentType: "Full-time",
      location: "Bandung, Indonesia",
      startDate: "Jul 2022",
      endDate: "Dec 2023",
      current: false,
      bullets: [
        "Engineered high-reliability payment reconciliation microservices in Go and Python, processing over $4.2M in monthly transaction volume with 99.98% uptime.",
        "Migrated legacy monolithic frontend to React and Tailwind CSS, improving Core Web Vitals (LCP) by 52% and boosting mobile onboarding conversion by 19%.",
        "Implemented automated CI/CD test suites in GitHub Actions, decreasing production hotfix rollbacks by 45% over two quarters.",
      ],
      technologies: [
        "React",
        "Go",
        "Python",
        "Tailwind CSS",
        "GitHub Actions",
        "AWS",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Institut Teknologi Bandung (ITB)",
      degree: "Bachelor of Engineering (S.T.)",
      fieldOfStudy: "Computer Science / Informatics",
      location: "Bandung, Indonesia",
      startDate: "Aug 2018",
      endDate: "Jul 2022",
      gpa: "3.86 / 4.00",
      honors: "Cum Laude",
      highlights: [
        "Undergraduate Thesis: Deep Learning for Indonesian-English Low-Resource Neural Machine Translation",
        "Head of Competitive Programming & AI Research Division",
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Google Cloud Professional Cloud Architect",
      issuer: "Google Cloud",
      issueDate: "Mar 2025",
      expiryDate: "Mar 2027",
      credentialId: "GCP-PCA-99281",
      credentialUrl: "https://cloud.google.com/certification",
    },
    {
      id: "cert-2",
      name: "DeepLearning.AI Generative AI with Large Language Models",
      issuer: "Coursera / DeepLearning.AI",
      issueDate: "Nov 2024",
      credentialId: "DLAI-LLM-44210",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Personal AI-Powered ATS Resume & Career Engine",
      role: "Creator & Lead Developer",
      startDate: "2026",
      endDate: "2026",
      description:
        "Self-hosted career repository and dynamic ATS resume generator powered by Google Gemini structured outputs.",
      bullets: [
        "Built a deterministic single-column ATS PDF rendering engine with real-time keyword gap analysis and XYZ bullet formula optimization.",
        "Implemented bilingual Indonesian-to-English career translation and multimodal PDF/DOCX legacy resume extraction.",
      ],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Gemini API"],
      metrics: "100% ATS text parseability score across standard parsers",
      liveUrl: "https://github.com/abiyamf",
      repoUrl: "https://github.com/abiyamf",
    },
    {
      id: "proj-2",
      title: "IndoRAG: Enterprise Knowledge Base Assistant",
      role: "ML & Backend Engineer",
      startDate: "2025",
      endDate: "2025",
      description:
        "Hybrid BM25 + semantic vector retrieval system for bilingual Indonesian corporate policy documents.",
      bullets: [
        "Designed chunking and reranking pipelines that improved answer groundedness from 71% to 93% on internal evaluation benchmarks.",
      ],
      techStack: ["Python", "FastAPI", "Qdrant", "Gemini Embeddings", "Docker"],
      metrics: "93% retrieval groundedness accuracy",
    },
  ],
  skills: [
    {
      id: "skill-1",
      category: "Programming Languages",
      items: ["TypeScript", "JavaScript", "Python", "Go", "SQL", "HTML5/CSS3"],
    },
    {
      id: "skill-2",
      category: "Frameworks & Libraries",
      items: ["Next.js", "React", "Node.js", "FastAPI", "Tailwind CSS", "Prisma"],
    },
    {
      id: "skill-3",
      category: "AI & Data Engineering",
      items: [
        "Google Gemini API",
        "LLM Prompt Engineering",
        "RAG Pipelines",
        "PyTorch",
        "PostgreSQL",
        "Redis",
      ],
    },
    {
      id: "skill-4",
      category: "Cloud, DevOps & Practices",
      items: [
        "Docker",
        "AWS",
        "Google Cloud Platform (GCP)",
        "CI/CD (GitHub Actions)",
        "System Design",
        "Agile / Scrum",
      ],
    },
    {
      id: "skill-5",
      category: "Languages",
      items: ["Indonesian (Native)", "English (Professional Working Proficiency)"],
    },
  ],
  publications: [
    {
      id: "pub-1",
      title:
        "Context-Aware Code-Mixing Translation for Indonesian Technical Documentation",
      publisher: "IEEE International Conference on Data and Software Engineering",
      date: "Oct 2023",
      authors: "A. Makruf, R. Pratama",
      url: "https://ieeexplore.ieee.org",
      description:
        "Proposed a transformer fine-tuning strategy improving BLEU score by +4.8 points on technical Indonesian-English corpora.",
    },
  ],
  awards: [
    {
      id: "award-1",
      title: "1st Place Winner - National AI Hackathon Indonesia",
      issuer: "Ministry of Communication & Digital Affairs",
      date: "Aug 2024",
      description:
        "Selected 1st out of 180+ competing teams for building an real-time SME financial literacy assistant.",
    },
  ],
  volunteer: [
    {
      id: "vol-1",
      organization: "Indonesia AI & Open Source Community",
      role: "Technical Mentor",
      location: "Jakarta, Indonesia",
      startDate: "Jan 2023",
      endDate: "Present",
      bullets: [
        "Mentored 60+ university students and junior developers in full-stack web engineering, Git workflows, and interview preparation.",
      ],
    },
  ],
};

function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function masterToResumeDocument(
  master: MasterCareerProfile
): ResumeDocumentData {
  return {
    personalInfo: { ...master.personalInfo },
    experiences: master.experiences.map((e) => ({ ...e })),
    education: master.education.map((e) => ({ ...e })),
    certifications: master.certifications.map((c) => ({ ...c })),
    projects: master.projects.map((p) => ({ ...p })),
    skills: master.skills.map((s) => ({ ...s })),
    publications: master.publications.map((p) => ({ ...p })),
    awards: master.awards.map((a) => ({ ...a })),
    volunteer: master.volunteer.map((v) => ({ ...v })),
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    visibleSections: { ...DEFAULT_VISIBLE_SECTIONS },
  };
}

let seedPromise: Promise<void> | null = null;

async function ensureDatabaseSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        await prisma.masterProfile.upsert({
          where: { id: "default" },
          update: {},
          create: {
            id: "default",
            personalInfo: JSON.stringify(INITIAL_MASTER_PROFILE.personalInfo),
            experiences: JSON.stringify(INITIAL_MASTER_PROFILE.experiences),
            education: JSON.stringify(INITIAL_MASTER_PROFILE.education),
            certifications: JSON.stringify(
              INITIAL_MASTER_PROFILE.certifications
            ),
            projects: JSON.stringify(INITIAL_MASTER_PROFILE.projects),
            skills: JSON.stringify(INITIAL_MASTER_PROFILE.skills),
            publications: JSON.stringify(INITIAL_MASTER_PROFILE.publications),
            awards: JSON.stringify(INITIAL_MASTER_PROFILE.awards),
            volunteer: JSON.stringify(INITIAL_MASTER_PROFILE.volunteer),
          },
        });

        const existingResumes = await prisma.tailoredResume.count();
        if (existingResumes === 0) {
          const initialDoc = masterToResumeDocument(INITIAL_MASTER_PROFILE);
          const initialAts: AtsAnalysisResult = {
            overallScore: 91,
            keywordMatchScore: 90,
            impactMetricsScore: 94,
            atsFormattingScore: 98,
            extractedTargetRole: "Senior Full-Stack & AI Engineer",
            matchedKeywords: [
              "TypeScript",
              "Next.js",
              "React",
              "Node.js",
              "Google Gemini API",
              "PostgreSQL",
              "Docker",
              "CI/CD",
              "Microservices",
            ],
            missingCriticalKeywords: ["Kubernetes", "GraphQL"],
            recommendedTechStack: [
              "TypeScript",
              "Next.js",
              "PostgreSQL",
              "Docker",
            ],
            weakBullets: [],
            redFlags: [],
            actionableTips: [
              "Strong quantified metrics detected across work experience bullet points (68%, 135ms, $4.2M).",
              "Consider adding Kubernetes or GraphQL to your Skills section if you have hands-on familiarity required by enterprise JDs.",
            ],
            analyzedAt: new Date().toISOString(),
          };

          const seededResume = await prisma.tailoredResume.create({
            data: {
              title: "Senior Full-Stack & AI Engineer — Master Baseline",
              collection: "Full-Stack & AI",
              targetRole: "Senior Full-Stack & AI Engineer",
              targetCompany: "Global Tech Co.",
              jobUrl: "https://linkedin.com/jobs",
              jobDescription:
                "Looking for a Senior Full-Stack & AI Engineer experienced in TypeScript, Next.js, React, Node.js, PostgreSQL, Docker, and LLM / Google Gemini API integrations. Must demonstrate measurable impact in latency reduction and scalable system design.",
              templateId: "harvard",
              fontFamily: "Calibri",
              fontSize: "medium",
              pageLimit: 1,
              cvData: JSON.stringify(initialDoc),
              atsAnalysis: JSON.stringify(initialAts),
              coverLetter: `Dear Hiring Manager at Global Tech Co.,\n\nI am writing to express my strong interest in the Senior Full-Stack & AI Engineer position. Over the past 4+ years building distributed web applications and LLM-powered workflows at Nusantara Cloud Technologies and Garuda FinTech Digital, I have consistently delivered measurable engineering outcomes—including architecting a Google Gemini document pipeline that reduced manual effort by 68% and optimizing PostgreSQL/Redis layers to cut P95 latency from 480ms to 135ms.\n\nMy deep hands-on expertise in TypeScript, Next.js, Node.js, Python, and production AI systems aligns directly with your engineering roadmap. I would welcome the opportunity to discuss how my background in scalable system architecture can contribute to your team's goals.\n\nSincerely,\nAbiya Makruf`,
            },
          });

          await prisma.jobApplication.create({
            data: {
              companyName: "Global Tech Co.",
              roleTitle: "Senior Full-Stack & AI Engineer",
              jobUrl: "https://linkedin.com/jobs",
              location: "Jakarta / Remote",
              status: "INTERVIEW",
              appliedDate: new Date().toISOString().slice(0, 10),
              salaryRange: "IDR 28M - 38M / month",
              notes:
                "Submitted tailored Harvard ATS resume. Passed HR screening; technical system design round scheduled.",
              tailoredResumeId: seededResume.id,
            },
          });
        }
      } catch (err) {
        seedPromise = null;
        throw err;
      }
    })();
  }
  return seedPromise;
}

export async function getMasterProfile(): Promise<MasterCareerProfile> {
  await ensureDatabaseSeeded();
  const row = await prisma.masterProfile.findUniqueOrThrow({
    where: { id: "default" },
  });

  return {
    id: row.id,
    personalInfo: safeJsonParse(
      row.personalInfo,
      INITIAL_MASTER_PROFILE.personalInfo
    ),
    experiences: safeJsonParse(
      row.experiences,
      INITIAL_MASTER_PROFILE.experiences
    ),
    education: safeJsonParse(row.education, INITIAL_MASTER_PROFILE.education),
    certifications: safeJsonParse(
      row.certifications,
      INITIAL_MASTER_PROFILE.certifications
    ),
    projects: safeJsonParse(row.projects, INITIAL_MASTER_PROFILE.projects),
    skills: safeJsonParse(row.skills, INITIAL_MASTER_PROFILE.skills),
    publications: safeJsonParse(
      row.publications,
      INITIAL_MASTER_PROFILE.publications
    ),
    awards: safeJsonParse(row.awards, INITIAL_MASTER_PROFILE.awards),
    volunteer: safeJsonParse(row.volunteer, INITIAL_MASTER_PROFILE.volunteer),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function saveMasterProfile(
  profile: Omit<MasterCareerProfile, "id" | "updatedAt">
): Promise<MasterCareerProfile> {
  const updated = await prisma.masterProfile.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      personalInfo: JSON.stringify(profile.personalInfo),
      experiences: JSON.stringify(profile.experiences),
      education: JSON.stringify(profile.education),
      certifications: JSON.stringify(profile.certifications),
      projects: JSON.stringify(profile.projects),
      skills: JSON.stringify(profile.skills),
      publications: JSON.stringify(profile.publications),
      awards: JSON.stringify(profile.awards),
      volunteer: JSON.stringify(profile.volunteer),
    },
    update: {
      personalInfo: JSON.stringify(profile.personalInfo),
      experiences: JSON.stringify(profile.experiences),
      education: JSON.stringify(profile.education),
      certifications: JSON.stringify(profile.certifications),
      projects: JSON.stringify(profile.projects),
      skills: JSON.stringify(profile.skills),
      publications: JSON.stringify(profile.publications),
      awards: JSON.stringify(profile.awards),
      volunteer: JSON.stringify(profile.volunteer),
    },
  });

  return {
    id: updated.id,
    personalInfo: safeJsonParse(
      updated.personalInfo,
      INITIAL_MASTER_PROFILE.personalInfo
    ),
    experiences: safeJsonParse(updated.experiences, []),
    education: safeJsonParse(updated.education, []),
    certifications: safeJsonParse(updated.certifications, []),
    projects: safeJsonParse(updated.projects, []),
    skills: safeJsonParse(updated.skills, []),
    publications: safeJsonParse(updated.publications, []),
    awards: safeJsonParse(updated.awards, []),
    volunteer: safeJsonParse(updated.volunteer, []),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function listTailoredResumes(): Promise<TailoredResumeRecord[]> {
  await getMasterProfile(); // Ensure DB is seeded
  const rows = await prisma.tailoredResume.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const defaultDoc = masterToResumeDocument(INITIAL_MASTER_PROFILE);
  const defaultAts: AtsAnalysisResult = {
    overallScore: 0,
    keywordMatchScore: 0,
    impactMetricsScore: 0,
    atsFormattingScore: 100,
    matchedKeywords: [],
    missingCriticalKeywords: [],
    recommendedTechStack: [],
    weakBullets: [],
    redFlags: [],
    actionableTips: [],
  };

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    collection: r.collection,
    targetRole: r.targetRole,
    targetCompany: r.targetCompany,
    jobUrl: r.jobUrl,
    jobDescription: r.jobDescription,
    templateId: (r.templateId as TemplateId) || "harvard",
    fontFamily: (r.fontFamily as StandardFontFamily) || "Calibri",
    fontSize: (r.fontSize as "small" | "medium" | "large") || "medium",
    pageLimit: r.pageLimit || 1,
    cvData: safeJsonParse<ResumeDocumentData>(r.cvData, defaultDoc),
    atsAnalysis: safeJsonParse<AtsAnalysisResult>(r.atsAnalysis, defaultAts),
    coverLetter: r.coverLetter || "",
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getTailoredResumeById(
  id: string
): Promise<TailoredResumeRecord | null> {
  const r = await prisma.tailoredResume.findUnique({ where: { id } });
  if (!r) return null;
  const defaultDoc = masterToResumeDocument(INITIAL_MASTER_PROFILE);
  const defaultAts: AtsAnalysisResult = {
    overallScore: 0,
    keywordMatchScore: 0,
    impactMetricsScore: 0,
    atsFormattingScore: 100,
    matchedKeywords: [],
    missingCriticalKeywords: [],
    recommendedTechStack: [],
    weakBullets: [],
    redFlags: [],
    actionableTips: [],
  };
  return {
    id: r.id,
    title: r.title,
    collection: r.collection,
    targetRole: r.targetRole,
    targetCompany: r.targetCompany,
    jobUrl: r.jobUrl,
    jobDescription: r.jobDescription,
    templateId: (r.templateId as TemplateId) || "harvard",
    fontFamily: (r.fontFamily as StandardFontFamily) || "Calibri",
    fontSize: (r.fontSize as "small" | "medium" | "large") || "medium",
    pageLimit: r.pageLimit || 1,
    cvData: safeJsonParse<ResumeDocumentData>(r.cvData, defaultDoc),
    atsAnalysis: safeJsonParse<AtsAnalysisResult>(r.atsAnalysis, defaultAts),
    coverLetter: r.coverLetter || "",
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function createTailoredResume(
  input: Omit<TailoredResumeRecord, "id" | "createdAt" | "updatedAt">
): Promise<TailoredResumeRecord> {
  const created = await prisma.tailoredResume.create({
    data: {
      title: input.title,
      collection: input.collection || "General",
      targetRole: input.targetRole || "",
      targetCompany: input.targetCompany || "",
      jobUrl: input.jobUrl || "",
      jobDescription: input.jobDescription || "",
      templateId: input.templateId || "harvard",
      fontFamily: input.fontFamily || "Calibri",
      fontSize: input.fontSize || "medium",
      pageLimit: input.pageLimit || 1,
      cvData: JSON.stringify(input.cvData),
      atsAnalysis: JSON.stringify(input.atsAnalysis),
      coverLetter: input.coverLetter || "",
    },
  });
  return (await getTailoredResumeById(created.id))!;
}

export async function updateTailoredResume(
  id: string,
  input: Partial<Omit<TailoredResumeRecord, "id" | "createdAt" | "updatedAt">>
): Promise<TailoredResumeRecord | null> {
  const existing = await prisma.tailoredResume.findUnique({ where: { id } });
  if (!existing) return null;

  await prisma.tailoredResume.update({
    where: { id },
    data: {
      title: input.title ?? existing.title,
      collection: input.collection ?? existing.collection,
      targetRole: input.targetRole ?? existing.targetRole,
      targetCompany: input.targetCompany ?? existing.targetCompany,
      jobUrl: input.jobUrl ?? existing.jobUrl,
      jobDescription: input.jobDescription ?? existing.jobDescription,
      templateId: input.templateId ?? existing.templateId,
      fontFamily: input.fontFamily ?? existing.fontFamily,
      fontSize: input.fontSize ?? existing.fontSize,
      pageLimit: input.pageLimit ?? existing.pageLimit,
      cvData: input.cvData ? JSON.stringify(input.cvData) : existing.cvData,
      atsAnalysis: input.atsAnalysis
        ? JSON.stringify(input.atsAnalysis)
        : existing.atsAnalysis,
      coverLetter: input.coverLetter ?? existing.coverLetter,
    },
  });

  return getTailoredResumeById(id);
}

export async function deleteTailoredResume(id: string): Promise<boolean> {
  await prisma.tailoredResume.delete({ where: { id } });
  return true;
}

export async function listJobApplications(): Promise<JobApplicationRecord[]> {
  await getMasterProfile(); // Ensure seeded
  const rows = await prisma.jobApplication.findMany({
    include: { tailoredResume: true },
    orderBy: { updatedAt: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    companyName: r.companyName,
    roleTitle: r.roleTitle,
    jobUrl: r.jobUrl,
    location: r.location,
    status: (r.status as JobApplicationRecord["status"]) || "APPLIED",
    appliedDate: r.appliedDate,
    salaryRange: r.salaryRange,
    notes: r.notes,
    tailoredResumeId: r.tailoredResumeId,
    tailoredResumeTitle: r.tailoredResume?.title,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function createJobApplication(
  input: Omit<
    JobApplicationRecord,
    "id" | "createdAt" | "updatedAt" | "tailoredResumeTitle"
  >
): Promise<JobApplicationRecord> {
  const created = await prisma.jobApplication.create({
    data: {
      companyName: input.companyName,
      roleTitle: input.roleTitle,
      jobUrl: input.jobUrl || "",
      location: input.location || "",
      status: input.status || "APPLIED",
      appliedDate: input.appliedDate || new Date().toISOString().slice(0, 10),
      salaryRange: input.salaryRange || "",
      notes: input.notes || "",
      tailoredResumeId: input.tailoredResumeId || null,
    },
    include: { tailoredResume: true },
  });

  return {
    id: created.id,
    companyName: created.companyName,
    roleTitle: created.roleTitle,
    jobUrl: created.jobUrl,
    location: created.location,
    status: created.status as JobApplicationRecord["status"],
    appliedDate: created.appliedDate,
    salaryRange: created.salaryRange,
    notes: created.notes,
    tailoredResumeId: created.tailoredResumeId,
    tailoredResumeTitle: created.tailoredResume?.title,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateJobApplication(
  id: string,
  input: Partial<
    Omit<
      JobApplicationRecord,
      "id" | "createdAt" | "updatedAt" | "tailoredResumeTitle"
    >
  >
): Promise<JobApplicationRecord | null> {
  const existing = await prisma.jobApplication.findUnique({ where: { id } });
  if (!existing) return null;

  const updated = await prisma.jobApplication.update({
    where: { id },
    data: {
      companyName: input.companyName ?? existing.companyName,
      roleTitle: input.roleTitle ?? existing.roleTitle,
      jobUrl: input.jobUrl ?? existing.jobUrl,
      location: input.location ?? existing.location,
      status: input.status ?? existing.status,
      appliedDate: input.appliedDate ?? existing.appliedDate,
      salaryRange: input.salaryRange ?? existing.salaryRange,
      notes: input.notes ?? existing.notes,
      tailoredResumeId:
        input.tailoredResumeId !== undefined
          ? input.tailoredResumeId
          : existing.tailoredResumeId,
    },
    include: { tailoredResume: true },
  });

  return {
    id: updated.id,
    companyName: updated.companyName,
    roleTitle: updated.roleTitle,
    jobUrl: updated.jobUrl,
    location: updated.location,
    status: updated.status as JobApplicationRecord["status"],
    appliedDate: updated.appliedDate,
    salaryRange: updated.salaryRange,
    notes: updated.notes,
    tailoredResumeId: updated.tailoredResumeId,
    tailoredResumeTitle: updated.tailoredResume?.title,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteJobApplication(id: string): Promise<boolean> {
  await prisma.jobApplication.delete({ where: { id } });
  return true;
}

export async function getStoredApiKey(): Promise<string> {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
    return process.env.GEMINI_API_KEY.trim();
  }
  const row = await prisma.appSetting.findUnique({
    where: { key: "GEMINI_API_KEY" },
  });
  return row?.value?.trim() || "";
}

export async function setStoredApiKey(apiKey: string): Promise<void> {
  await prisma.appSetting.upsert({
    where: { key: "GEMINI_API_KEY" },
    create: { key: "GEMINI_API_KEY", value: apiKey.trim() },
    update: { value: apiKey.trim() },
  });
}

export async function exportFullBackup(): Promise<BackupPayload> {
  const masterProfile = await getMasterProfile();
  const tailoredResumes = await listTailoredResumes();
  const applications = await listJobApplications();
  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    masterProfile,
    tailoredResumes,
    applications,
  };
}

export async function importFullBackup(payload: BackupPayload): Promise<void> {
  if (payload.masterProfile) {
    await saveMasterProfile(payload.masterProfile);
  }
  if (Array.isArray(payload.tailoredResumes)) {
    await prisma.jobApplication.deleteMany({});
    await prisma.tailoredResume.deleteMany({});
    for (const r of payload.tailoredResumes) {
      await prisma.tailoredResume.create({
        data: {
          id: r.id,
          title: r.title,
          collection: r.collection || "General",
          targetRole: r.targetRole || "",
          targetCompany: r.targetCompany || "",
          jobUrl: r.jobUrl || "",
          jobDescription: r.jobDescription || "",
          templateId: r.templateId || "harvard",
          fontFamily: r.fontFamily || "Calibri",
          fontSize: r.fontSize || "medium",
          pageLimit: r.pageLimit || 1,
          cvData: JSON.stringify(r.cvData),
          atsAnalysis: JSON.stringify(r.atsAnalysis),
          coverLetter: r.coverLetter || "",
        },
      });
    }
  }
  if (Array.isArray(payload.applications)) {
    for (const app of payload.applications) {
      await prisma.jobApplication.create({
        data: {
          id: app.id,
          companyName: app.companyName,
          roleTitle: app.roleTitle,
          jobUrl: app.jobUrl || "",
          location: app.location || "",
          status: app.status || "APPLIED",
          appliedDate: app.appliedDate || "",
          salaryRange: app.salaryRange || "",
          notes: app.notes || "",
          tailoredResumeId: app.tailoredResumeId || null,
        },
      });
    }
  }
}
