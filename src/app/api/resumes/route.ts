import { NextRequest, NextResponse } from "next/server";
import {
  createTailoredResume,
  deleteTailoredResume,
  getMasterProfile,
  masterToResumeDocument,
  updateTailoredResume,
} from "@/lib/db";
import { runHeuristicAtsCheck } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const master = await getMasterProfile();
    const cvData = body.cvData || masterToResumeDocument(master);
    const jobDescription = body.jobDescription || "";
    const atsAnalysis =
      body.atsAnalysis || runHeuristicAtsCheck(cvData, jobDescription);

    const created = await createTailoredResume({
      title: body.title || "Untitled Tailored CV",
      collection: body.collection || "General",
      targetRole: body.targetRole || "",
      targetCompany: body.targetCompany || "",
      jobUrl: body.jobUrl || "",
      jobDescription,
      templateId: body.templateId || "harvard",
      fontFamily: body.fontFamily || "Calibri",
      fontSize: body.fontSize || "medium",
      pageLimit: body.pageLimit || 1,
      cvData,
      atsAnalysis,
      coverLetter: body.coverLetter || "",
    });

    return NextResponse.json({ resume: created });
  } catch (err) {
    console.error("Error creating resume:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create resume" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing resume id" }, { status: 400 });
    }
    const updated = await updateTailoredResume(body.id, body);
    return NextResponse.json({ resume: updated });
  } catch (err) {
    console.error("Error updating resume:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing resume id" }, { status: 400 });
    }
    await deleteTailoredResume(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting resume:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete resume" },
      { status: 500 }
    );
  }
}
