import { NextRequest, NextResponse } from "next/server";
import {
  exportFullBackup,
  getMasterProfile,
  getStoredApiKey,
  importFullBackup,
  listJobApplications,
  listTailoredResumes,
  saveMasterProfile,
  setStoredApiKey,
} from "@/lib/db";

export async function GET() {
  try {
    const masterProfile = await getMasterProfile();
    const [tailoredResumes, applications, storedKey] = await Promise.all([
      listTailoredResumes(),
      listJobApplications(),
      getStoredApiKey(),
    ]);

    return NextResponse.json({
      masterProfile,
      tailoredResumes,
      applications,
      hasServerApiKey: Boolean(storedKey && storedKey.length > 5),
      maskedServerApiKey:
        storedKey && storedKey.length > 8
          ? `${storedKey.slice(0, 4)}...${storedKey.slice(-4)}`
          : "",
    });
  } catch (err) {
    console.error("Error loading app state:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load state" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type === "masterProfile") {
      const updated = await saveMasterProfile(body.masterProfile);
      return NextResponse.json({ masterProfile: updated });
    }

    if (body.type === "apiKey") {
      await setStoredApiKey(body.apiKey || "");
      const storedKey = await getStoredApiKey();
      return NextResponse.json({
        hasServerApiKey: Boolean(storedKey && storedKey.length > 5),
        maskedServerApiKey:
          storedKey && storedKey.length > 8
            ? `${storedKey.slice(0, 4)}...${storedKey.slice(-4)}`
            : "",
      });
    }

    if (body.type === "importBackup") {
      await importFullBackup(body.payload);
      const [masterProfile, tailoredResumes, applications] = await Promise.all([
        getMasterProfile(),
        listTailoredResumes(),
        listJobApplications(),
      ]);
      return NextResponse.json({
        masterProfile,
        tailoredResumes,
        applications,
      });
    }

    if (body.type === "exportBackup") {
      const backup = await exportFullBackup();
      return NextResponse.json(backup);
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  } catch (err) {
    console.error("Error updating state:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update state" },
      { status: 500 }
    );
  }
}
