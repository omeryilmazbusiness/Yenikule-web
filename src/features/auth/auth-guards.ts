import { authService } from "@/features/auth/auth.service";
import type { AuthSession, AuthUser, UserRole } from "@/features/auth/auth.types";

export const AUTH_COOKIE_NAME = "yk_session";

export async function requireAuth(token: string | undefined): Promise<AuthSession> {
  if (!token) {
    throw new AuthError("Oturum bulunamadı. Lütfen giriş yapınız.", 401);
  }

  const session = await authService.validateSession(token);
  if (!session) {
    throw new AuthError("Oturumunuz sona ermiş. Lütfen tekrar giriş yapınız.", 401);
  }

  return session;
}

export async function requireRole(
  token: string | undefined,
  roles: UserRole[],
): Promise<AuthUser> {
  const session = await requireAuth(token);

  if (!roles.includes(session.user.role)) {
    throw new AuthError("Bu işlem için yetkiniz bulunmamaktadır.", 403);
  }

  return session.user;
}

export async function getOptionalAuth(
  token: string | undefined,
): Promise<AuthSession | null> {
  if (!token) return null;
  return authService.validateSession(token);
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 401 | 403 = 401,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

export async function requireAdmin(token: string | undefined): Promise<AuthUser> {
  return requireRole(token, ["admin", "editor"]);
}
