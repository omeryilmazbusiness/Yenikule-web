export type UserRole = "admin" | "editor";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
  expiresAt: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResult =
  | { success: true; session: AuthSession }
  | { success: false; error: string };
