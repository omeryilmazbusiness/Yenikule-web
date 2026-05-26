"use server";

import { revalidatePath } from "next/cache";

import { getAuthToken } from "@/features/auth/auth-cookies";
import { AuthError, requireAdmin } from "@/features/auth/auth-guards";
import { siteSettingsService } from "@/features/settings/services/site-settings.service";
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

export async function saveSiteSettingsAction(values: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    await siteSettingsService.save(values);

    revalidatePath(routes.admin.settings);
    revalidatePath(routes.home);
    revalidatePath(routes.about);
    revalidatePath(routes.contact);
    revalidatePath("/", "layout");

    return actionSuccess(routes.admin.settings, "Site ayarları kaydedildi.");
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}
