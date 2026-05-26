import type {
  AuthResult,
  AuthSession,
  AuthUser,
  LoginCredentials,
} from "@/features/auth/auth.types";
import { env } from "@/lib/env";
import { createId } from "@/lib/validations";

const MOCK_ADMIN: AuthUser = {
  id: "usr-admin-001",
  email: "admin@yenikuleinsaat.com",
  name: "Yönetici",
  role: "admin",
};

const globalStore = globalThis as typeof globalThis & {
  __authSessions?: Map<string, AuthSession>;
};

function getSessionStore(): Map<string, AuthSession> {
  if (!globalStore.__authSessions) {
    globalStore.__authSessions = new Map();
  }
  return globalStore.__authSessions;
}

function createSession(user: AuthUser): AuthSession {
  const token = createId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const session: AuthSession = { user, token, expiresAt };
  getSessionStore().set(token, session);
  return session;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const email = credentials.email.trim().toLowerCase();
    const adminEmail = env.ADMIN_EMAIL.toLowerCase();

    if (email !== adminEmail || credentials.password !== env.ADMIN_PASSWORD) {
      return {
        success: false,
        error: "E-posta veya şifre hatalı.",
      };
    }

    const session = createSession(MOCK_ADMIN);
    return { success: true, session };
  },

  async logout(token: string): Promise<void> {
    getSessionStore().delete(token);
  },

  async validateSession(token: string): Promise<AuthSession | null> {
    const session = getSessionStore().get(token);
    if (!session) return null;

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      getSessionStore().delete(token);
      return null;
    }

    return session;
  },

  async getCurrentUser(token: string): Promise<AuthUser | null> {
    const session = await this.validateSession(token);
    return session?.user ?? null;
  },
};
