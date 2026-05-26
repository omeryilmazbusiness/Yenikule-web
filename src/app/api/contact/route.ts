import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { contactService } from "@/features/contact/services/contact.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = await contactService.submit(body);

    if (!message) {
      return NextResponse.json({ success: true, id: "ok" });
    }

    return NextResponse.json({
      success: true,
      id: message.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Form verileri geçersiz.",
          issues: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    console.error("[api/contact]", error);
    return NextResponse.json(
      { success: false, error: "Mesaj gönderilemedi." },
      { status: 500 },
    );
  }
}
