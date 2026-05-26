"use server";

import { revalidatePath } from "next/cache";

import { getAuthToken } from "@/features/auth/auth-cookies";
import { AuthError, requireAdmin } from "@/features/auth/auth-guards";
import type { ListingFormValues } from "@/features/listings/schemas/listing.schema";
import { listingService } from "@/features/listings/services/listing.service";
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

export async function createListingAction(
  values: ListingFormValues,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const item = await listingService.create(values);
    revalidatePath(routes.admin.listings);
    revalidatePath(routes.listings.index);
    return actionSuccess(
      routes.listings.edit(item.id),
      "İlan başarıyla oluşturuldu.",
    );
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}

export async function updateListingAction(
  id: string,
  values: ListingFormValues,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const updated = await listingService.update(id, values);
    if (!updated) {
      return actionFailure("İlan bulunamadı.");
    }
    revalidatePath(routes.admin.listings);
    revalidatePath(routes.listings.index);
    revalidatePath(routes.listings.detail(updated.slug));
    return actionSuccess(
      routes.admin.listings,
      "İlan başarıyla güncellendi.",
    );
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}

export async function deleteListingAction(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const deleted = await listingService.remove(id);
    if (!deleted) {
      return actionFailure("İlan bulunamadı.");
    }
    revalidatePath(routes.admin.listings);
    revalidatePath(routes.listings.index);
    return actionSuccess(routes.admin.listings, "İlan silindi.");
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}

export async function toggleListingStatusAction(
  id: string,
  status: ListingFormValues["status"],
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const updated = await listingService.update(id, { status });
    if (!updated) {
      return actionFailure("İlan bulunamadı.");
    }
    revalidatePath(routes.admin.listings);
    revalidatePath(routes.listings.index);
    return actionSuccess(routes.admin.listings, "İlan durumu güncellendi.");
  } catch (error) {
    return actionFailure(formatActionError(error));
  }
}
