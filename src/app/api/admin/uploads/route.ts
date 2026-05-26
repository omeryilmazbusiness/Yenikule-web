import { NextResponse } from "next/server";

import { getAuthToken } from "@/features/auth/auth-cookies";
import { AuthError, requireAdmin } from "@/features/auth/auth-guards";
import type { UploadFolder } from "@/features/uploads/upload.types";
import { uploadService } from "@/features/uploads/upload.service";

export async function POST(request: Request) {
  try {
    await requireAdmin(await getAuthToken());

    const formData = await request.formData();
    const incomingFiles = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File);

    if (incomingFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "Yüklenecek dosya bulunamadı." },
        { status: 400 },
      );
    }

    const folderRaw = formData.get("folder");
    const folder: UploadFolder =
      folderRaw === "listings" ||
      folderRaw === "projects" ||
      folderRaw === "vehicles" ||
      folderRaw === "general"
        ? folderRaw
        : "general";

    const inputs = await Promise.all(
      incomingFiles.map(async (file) => ({
        file: Buffer.from(await file.arrayBuffer()),
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        folder,
      })),
    );

    const { succeeded, failed } = await uploadService.uploadMultiple(inputs, "mock");

    const uploadedFiles = succeeded.map((file) => {
      const { buffer: _buffer, ...safe } = file as typeof file & {
        buffer?: Buffer;
      };
      return safe;
    });

    return NextResponse.json({
      success: failed.length === 0,
      files: uploadedFiles,
      failed,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("[api/admin/uploads]", error);
    return NextResponse.json(
      { success: false, error: "Dosya yüklenemedi." },
      { status: 500 },
    );
  }
}
