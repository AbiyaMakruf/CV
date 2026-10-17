import { NextRequest, NextResponse } from "next/server";
import { parseLegacyResume } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const customApiKey = req.headers.get("x-gemini-api-key") || undefined;
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please select a PDF, DOCX, or image file." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "application/pdf";

    const extractedProfile = await parseLegacyResume(
      buffer,
      mimeType,
      customApiKey
    );

    return NextResponse.json({
      extractedProfile,
      fileName: file.name,
    });
  } catch (err) {
    console.error("Error parsing legacy CV:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to parse legacy CV document.",
      },
      { status: 500 }
    );
  }
}
