"use server";

import { revalidatePath } from "next/cache";

import { getAuthToken } from "@/features/auth/auth-cookies";
import { AuthError, requireAdmin } from "@/features/auth/auth-guards";
import type { VehicleFormValues } from "@/features/vehicles/schemas/vehicle.schema";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";
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

export async function createVehicleAction(
  values: VehicleFormValues,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const item = await vehicleService.create(values);
    revalidatePath(routes.admin.vehicles);
    revalidatePath(routes.vehicles.index);
    return actionSuccess(
      routes.vehicles.edit(item.id),
      "Araç ilanı başarıyla oluşturuldu.",
    );
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}

export async function updateVehicleAction(
  id: string,
  values: VehicleFormValues,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const updated = await vehicleService.update(id, values);
    if (!updated) {
      return actionFailure("Araç ilanı bulunamadı.");
    }
    revalidatePath(routes.admin.vehicles);
    revalidatePath(routes.vehicles.index);
    revalidatePath(routes.vehicles.detail(updated.slug));
    return actionSuccess(routes.admin.vehicles, "Araç ilanı güncellendi.");
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}

export async function deleteVehicleAction(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const deleted = await vehicleService.remove(id);
    if (!deleted) {
      return actionFailure("Araç ilanı bulunamadı.");
    }
    revalidatePath(routes.admin.vehicles);
    revalidatePath(routes.vehicles.index);
    return actionSuccess(routes.admin.vehicles, "Araç ilanı silindi.");
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}
