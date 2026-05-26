import { isAuthError } from "@/features/auth/auth-guards";

export type ActionSuccess = {
  success: true;
  redirectTo: string;
  message?: string;
};

export type ActionFailure = {
  success: false;
  error: string;
};

export type ActionResult = ActionSuccess | ActionFailure;

export function actionSuccess(
  redirectTo: string,
  message?: string,
): ActionSuccess {
  return { success: true, redirectTo, message };
}

export function actionFailure(error: string): ActionFailure {
  return { success: false, error };
}

export function formatActionError(error: unknown): string {
  if (isAuthError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "İşlem tamamlanamadı. Lütfen tekrar deneyin.";
}
