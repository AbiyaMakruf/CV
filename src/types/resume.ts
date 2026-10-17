export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  employmentType?: string; // Full-time, Internship, Contract, etc.
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  bullets: string[];
  techStack: string[];
  metrics?: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface SkillCategory {
  id: string;
  category: string; // e.g., "Programming Languages", "Frameworks & Libraries", "Cloud & DevOps", "Soft Skills", "Languages"
  items: string[];
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  authors?: string;
  url?: string;
  description?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface MasterCareerProfile {
  id: string;
  personalInfo: PersonalInfo;
  experiences: WorkExperience[];
  education: EducationItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  publications: PublicationItem[];
  awards: AwardItem[];
  volunteer: VolunteerItem[];
  updatedAt?: string;
}

export type ResumeSectionKey =
  | "summary"
  | "experiences"
  | "projects"
  | "education"
  | "skills"
  | "certifications"
  | "publications"
  | "awards"
  | "volunteer";

export type TemplateId = "harvard" | "modern" | "tech";
export type StandardFontFamily =
  | "Calibri"
  | "Arial"
  | "Helvetica"
  | "Garamond"
  | "Times New Roman";

export interface ResumeDocumentData {
  personalInfo: PersonalInfo;
  experiences: WorkExperience[];
  education: EducationItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  publications: PublicationItem[];
  awards: AwardItem[];
  volunteer: VolunteerItem[];
  sectionOrder: ResumeSectionKey[];
  visibleSections: Record<ResumeSectionKey, boolean>;
}

export interface WeakBulletFeedback {
  originalBullet: string;
  section: string;
  reason: string;
  suggestedRewrite: string;
}

export interface AtsAnalysisResult {
  overallScore: number; // 0 - 100
  keywordMatchScore: number; // 0 - 100
  impactMetricsScore: number; // 0 - 100
  atsFormattingScore: number; // 0 - 100
  extractedTargetRole?: string;
  matchedKeywords: string[];
  missingCriticalKeywords: string[];
  recommendedTechStack: string[];
  weakBullets: WeakBulletFeedback[];
  redFlags: string[];
  actionableTips: string[];
  analyzedAt?: string;
}

export interface TailoredResumeRecord {
  id: string;
  title: string;
  collection: string;
  targetRole: string;
  targetCompany: string;
  jobUrl: string;
  jobDescription: string;
  templateId: TemplateId;
  fontFamily: StandardFontFamily;
  fontSize: "small" | "medium" | "large";
  pageLimit: number;
  cvData: ResumeDocumentData;
  atsAnalysis: AtsAnalysisResult;
  coverLetter: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | "WISHLIST"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

export interface JobApplicationRecord {
  id: string;
  companyName: string;
  roleTitle: string;
  jobUrl: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string;
  salaryRange: string;
  notes: string;
  tailoredResumeId: string | null;
  tailoredResumeTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackupPayload {
  version: string;
  exportedAt: string;
  masterProfile: MasterCareerProfile;
  tailoredResumes: TailoredResumeRecord[];
  applications: JobApplicationRecord[];
}
