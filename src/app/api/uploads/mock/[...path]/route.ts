import { NextResponse } from "next/server";

import { getMockUpload } from "@/features/uploads/mock-storage.provider";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { path } = await context.params;
  const pathname = `/${path.join("/")}`;
  const file = getMockUpload(pathname);

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(file.size),
    },
  });
}
