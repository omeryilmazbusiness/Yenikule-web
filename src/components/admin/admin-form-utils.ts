"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FieldErrors } from "react-hook-form";

import type { ActionResult } from "@/lib/action-result";

export async function handleAdminFormSubmit(
  result: ActionResult,
  router: ReturnType<typeof useRouter>,
  fallbackMessage: string,
): Promise<void> {
  if (!result.success) {
    toast.error(result.error);
    return;
  }

  toast.success(result.message ?? fallbackMessage);
  router.push(result.redirectTo);
  router.refresh();
}

function findFirstFieldErrorMessage(
  errors: FieldErrors,
): string | undefined {
  for (const value of Object.values(errors)) {
    if (!value) continue;

    if (typeof value.message === "string") {
      return value.message;
    }

    if (typeof value === "object" && !("message" in value)) {
      const nested = findFirstFieldErrorMessage(value as FieldErrors);
      if (nested) return nested;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === "object" && "message" in item) {
          const message = (item as { message?: unknown }).message;
          if (typeof message === "string") return message;
        }
      }
    }
  }

  return undefined;
}

export function toastFormValidationErrors(errors: FieldErrors): void {
  const message = findFirstFieldErrorMessage(errors);

  toast.error(
    message ?? "Lütfen formdaki zorunlu alanları kontrol edin.",
  );
}

export function numberInputProps(
  value: number | undefined,
  onChange: (value: number | undefined) => void,
) {
  return {
    type: "number" as const,
    min: 0,
    value: value === undefined || Number.isNaN(value) ? "" : value,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      onChange(raw === "" ? undefined : Number(raw));
    },
  };
}
