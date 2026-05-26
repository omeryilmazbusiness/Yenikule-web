import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authService } from "@/features/auth/auth.service";
import {
  getAuthToken,
  getClearSessionCookieOptions,
  getSessionCookieOptions,
} from "@/features/auth/auth-cookies";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const credentials = loginSchema.parse(body);
    const result = await authService.login(credentials);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(
      getSessionCookieOptions(result.session.token, result.session.expiresAt),
    );

    return NextResponse.json({
      success: true,
      user: result.session.user,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz giriş bilgileri." },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const token = await getAuthToken();

  if (token) {
    await authService.logout(token);
  }

  const cookieStore = await cookies();
  cookieStore.set(getClearSessionCookieOptions());

  return NextResponse.json({ success: true });
}
