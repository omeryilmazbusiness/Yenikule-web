import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthToken } from "@/features/auth/auth-cookies";
import { AuthError, requireAdmin } from "@/features/auth/auth-guards";
import { projectCreateSchema } from "@/features/projects/schemas/project.schema";
import { projectService } from "@/features/projects/services/project.service";
import { formatActionError } from "@/lib/action-result";

export async function GET() {
  try {
    await requireAdmin(await getAuthToken());
    const result = await projectService.getAll({ pageSize: 100 });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }
    return NextResponse.json(
      { success: false, error: "Projeler alınamadı." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(await getAuthToken());
    const body = await request.json();
    const values = projectCreateSchema.parse(body);
    const item = await projectService.create(values);

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Geçersiz proje verisi.", issues: error.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: formatActionError(error) },
      { status: 400 },
    );
  }
}
