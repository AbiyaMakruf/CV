import { NextRequest, NextResponse } from "next/server";
import {
  analyzeCvTone,
  calculateAtsMatch,
  evaluateInterviewAnswer,
  fetchJobDescriptionFromUrl,
  generateCoverLetter,
  generateInterviewQuestions,
  restyleCvTone,
  tailorResumeForJob,
  translateAndPolishContent,
  trimResumeToTwoPages,
} from "@/lib/gemini";
import {
  createTailoredResume,
  getMasterProfile,
  updateTailoredResume,
} from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customApiKey =
      req.headers.get("x-gemini-api-key") || body.apiKey || undefined;
    const { action } = body;

    if (action === "polish") {
      const result = await translateAndPolishContent(
        body.text || "",
        body.targetTone || "xyz",
        body.contextRole,
        customApiKey
      );
      return NextResponse.json(result);
    }

    if (action === "fetch-jd") {
      const text = await fetchJobDescriptionFromUrl(body.url);
      return NextResponse.json({ jobDescription: text });
    }

    if (action === "tailor") {
      const masterProfile = body.masterProfile || (await getMasterProfile());
      let jdText = body.jobDescription || "";

      if (!jdText.trim() && body.jobUrl) {
        jdText = await fetchJobDescriptionFromUrl(body.jobUrl);
      }

      if (!jdText.trim()) {
        return NextResponse.json(
          { error: "Please provide a Job Description or valid Job URL." },
          { status: 400 }
        );
      }

      const tailored = await tailorResumeForJob(
        masterProfile,
        jdText,
        body.targetRole,
        body.targetCompany,
        customApiKey
      );

      let coverLetter = "";
      if (body.generateCoverLetter) {
        coverLetter = await generateCoverLetter(
          tailored.tailoredCvData,
          jdText,
          tailored.extractedCompany || body.targetCompany,
          tailored.extractedRole || body.targetRole,
          customApiKey
        );
      }

      const finalRole =
        body.targetRole || tailored.extractedRole || "Tailored Role";
      const finalCompany =
        body.targetCompany || tailored.extractedCompany || "";
      const title =
        body.title ||
        (finalCompany ? `${finalRole} — ${finalCompany}` : finalRole);

      const createdResume = await createTailoredResume({
        title,
        collection:
          body.collection || tailored.suggestedCollection || "General",
        targetRole: finalRole,
        targetCompany: finalCompany,
        jobUrl: body.jobUrl || "",
        jobDescription: jdText,
        templateId: body.templateId || "harvard",
        fontFamily: body.fontFamily || "Calibri",
        fontSize: "medium",
        pageLimit: 1,
        cvData: tailored.tailoredCvData,
        atsAnalysis: tailored.atsAnalysis,
        coverLetter,
      });

      return NextResponse.json({
        resume: createdResume,
      });
    }

    if (action === "ats-score") {
      const analysis = await calculateAtsMatch(
        body.cvData,
        body.jobDescription || "",
        customApiKey
      );
      if (body.resumeId) {
        await updateTailoredResume(body.resumeId, { atsAnalysis: analysis });
      }
      return NextResponse.json({ atsAnalysis: analysis });
    }

    if (action === "cover-letter") {
      const letter = await generateCoverLetter(
        body.cvData,
        body.jobDescription || "",
        body.targetCompany,
        body.targetRole,
        customApiKey
      );
      if (body.resumeId) {
        await updateTailoredResume(body.resumeId, { coverLetter: letter });
      }
      return NextResponse.json({ coverLetter: letter });
    }

    if (action === "trim-pages") {
      if (!body.cvData) {
        return NextResponse.json(
          { error: "cvData is required for trim-pages." },
          { status: 400 }
        );
      }
      const trimResult = await trimResumeToTwoPages(body.cvData, customApiKey);
      if (body.resumeId) {
        await updateTailoredResume(body.resumeId, {
          cvData: trimResult.trimmedCvData,
          pageLimit: 2,
        });
      }
      return NextResponse.json(trimResult);
    }

    if (action === "interview-questions") {
      if (!body.cvData) {
        return NextResponse.json(
          { error: "cvData is required for interview-questions." },
          { status: 400 }
        );
      }
      const questions = await generateInterviewQuestions(
        body.cvData,
        body.jobDescription,
        body.targetRole,
        customApiKey
      );
      return NextResponse.json({ questions });
    }

    if (action === "evaluate-answer") {
      if (!body.question || !body.candidateAnswer) {
        return NextResponse.json(
          { error: "question and candidateAnswer are required." },
          { status: 400 }
        );
      }
      const evaluation = await evaluateInterviewAnswer(
        body.question,
        body.questionCategory || "General",
        body.candidateAnswer,
        body.cvData,
        body.jobDescription,
        customApiKey
      );
      return NextResponse.json({ evaluation });
    }

    if (action === "analyze-tone") {
      if (!body.cvData) {
        return NextResponse.json(
          { error: "cvData is required for analyze-tone." },
          { status: 400 }
        );
      }
      const toneAnalysis = await analyzeCvTone(body.cvData, customApiKey);
      return NextResponse.json({ toneAnalysis });
    }

    if (action === "restyle-tone") {
      if (!body.cvData || !body.preset) {
        return NextResponse.json(
          { error: "cvData and preset are required for restyle-tone." },
          { status: 400 }
        );
      }
      const restyleResult = await restyleCvTone(
        body.cvData,
        body.preset,
        body.targetRole,
        customApiKey
      );
      if (body.resumeId) {
        await updateTailoredResume(body.resumeId, {
          cvData: restyleResult.restyledCvData,
        });
      }
      return NextResponse.json(restyleResult);
    }

    return NextResponse.json({ error: "Unknown AI action" }, { status: 400 });
  } catch (err) {
    console.error("AI endpoint error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "AI processing failed.",
      },
      { status: 500 }
    );
  }
}
