"use server";

import { revalidatePath } from "next/cache";

import { getAuthToken } from "@/features/auth/auth-cookies";
import { AuthError, requireAdmin } from "@/features/auth/auth-guards";
import type { ContactMessageStatus } from "@/features/contact/types/contact.types";
import { contactService } from "@/features/contact/services/contact.service";
import {
  actionFailure,
  actionSuccess,
  formatActionError,
  type ActionResult,
} from "@/lib/action-result";
import { routes } from "@/lib/routes";

async function assertAdmin() {
  try {
    await requireAdmin(await getAuthToken());
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("Yetkilendirme hatası.", 401);
  }
}

export async function updateMessageStatusAction(
  id: string,
  status: ContactMessageStatus,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const updated = await contactService.updateStatus(id, { status });
    if (!updated) {
      return actionFailure("Mesaj bulunamadı.");
    }
    revalidatePath(routes.admin.messages);
    return actionSuccess(routes.admin.messages, "Mesaj durumu güncellendi.");
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}

export async function deleteMessageAction(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const deleted = await contactService.remove(id);
    if (!deleted) {
      return actionFailure("Mesaj bulunamadı.");
    }
    revalidatePath(routes.admin.messages);
    return actionSuccess(routes.admin.messages, "Mesaj silindi.");
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}
