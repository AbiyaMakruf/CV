import { NextRequest, NextResponse } from "next/server";
import {
  createJobApplication,
  deleteJobApplication,
  updateJobApplication,
} from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await createJobApplication({
      companyName: body.companyName || "Unknown Company",
      roleTitle: body.roleTitle || "Role",
      jobUrl: body.jobUrl || "",
      location: body.location || "",
      status: body.status || "APPLIED",
      appliedDate: body.appliedDate || new Date().toISOString().slice(0, 10),
      salaryRange: body.salaryRange || "",
      notes: body.notes || "",
      tailoredResumeId: body.tailoredResumeId || null,
    });
    return NextResponse.json({ application: created });
  } catch (err) {
    console.error("Error creating application:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to create application",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "Missing application id" },
        { status: 400 }
      );
    }
    const updated = await updateJobApplication(body.id, body);
    return NextResponse.json({ application: updated });
  } catch (err) {
    console.error("Error updating application:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to update application",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Missing application id" },
        { status: 400 }
      );
    }
    await deleteJobApplication(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting application:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to delete application",
      },
      { status: 500 }
    );
  }
}
