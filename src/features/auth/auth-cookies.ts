import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/features/auth/auth-guards";

const SESSION_MAX_AGE = 60 * 60 * 24;

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export function getSessionCookieOptions(token: string, expiresAt: string) {
  const expires = new Date(expiresAt);
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
    maxAge: SESSION_MAX_AGE,
  };
}

export function getClearSessionCookieOptions() {
  return {
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
