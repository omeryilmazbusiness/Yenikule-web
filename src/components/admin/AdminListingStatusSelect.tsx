"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { toggleListingStatusAction } from "@/app/admin/(panel)/ilanlar/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Listing } from "@/features/listings/types/listing.types";
import { LISTING_STATUSES } from "@/lib/constants";

type AdminListingStatusSelectProps = {
  listing: Listing;
};

export function AdminListingStatusSelect({ listing }: AdminListingStatusSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={listing.status}
      disabled={isPending}
      onValueChange={(status) => {
        startTransition(async () => {
          const result = await toggleListingStatusAction(
            listing.id,
            status as Listing["status"],
          );
          if (result.success) {
            toast.success(result.message ?? "Durum güncellendi.");
            router.refresh();
          } else {
            toast.error(result.error ?? "Durum güncellenemedi.");
          }
        });
      }}
    >
      <SelectTrigger className="admin-status-select h-8 min-w-[7.5rem] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LISTING_STATUSES.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
