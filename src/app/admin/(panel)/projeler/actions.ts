"use server";

import { revalidatePath } from "next/cache";

import { getAuthToken } from "@/features/auth/auth-cookies";
import { AuthError, requireAdmin } from "@/features/auth/auth-guards";
import type { ProjectFormValues } from "@/features/projects/schemas/project.schema";
import { projectService } from "@/features/projects/services/project.service";
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

export async function createProjectAction(
  values: ProjectFormValues,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const item = await projectService.create(values);
    revalidatePath(routes.admin.projects);
    revalidatePath(routes.projects.index);
    return actionSuccess(
      routes.projects.edit(item.id),
      "Proje başarıyla oluşturuldu.",
    );
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}

export async function updateProjectAction(
  id: string,
  values: ProjectFormValues,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const updated = await projectService.update(id, values);
    if (!updated) {
      return actionFailure("Proje bulunamadı.");
    }
    revalidatePath(routes.admin.projects);
    revalidatePath(routes.projects.index);
    revalidatePath(routes.projects.detail(updated.slug));
    return actionSuccess(routes.admin.projects, "Proje başarıyla güncellendi.");
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const deleted = await projectService.remove(id);
    if (!deleted) {
      return actionFailure("Proje bulunamadı.");
    }
    revalidatePath(routes.admin.projects);
    revalidatePath(routes.projects.index);
    return actionSuccess(routes.admin.projects, "Proje silindi.");
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}
