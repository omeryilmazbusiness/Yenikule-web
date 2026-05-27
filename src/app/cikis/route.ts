import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authService } from "@/features/auth/auth.service";
import {
  getAuthToken,
  getClearSessionCookieOptions,
} from "@/features/auth/auth-cookies";
import { routes } from "@/lib/routes";

/** Oturumu sonlandırır ve ana sayfaya yönlendirir. */
export async function GET() {
  const token = await getAuthToken();

  if (token) {
    await authService.logout(token);
  }

  const cookieStore = await cookies();
  cookieStore.set(getClearSessionCookieOptions());

  redirect(routes.home);
}
