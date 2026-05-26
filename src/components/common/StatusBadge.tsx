import { Badge } from "@/components/ui/badge";
import type { ListingStatus } from "@/features/listings/types/listing.types";
import type { ProjectStatus } from "@/features/projects/types/project.types";
import { LISTING_STATUSES, PROJECT_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/cn";

type StatusBadgeProps = {
  status: ListingStatus | ProjectStatus;
  type?: "listing" | "project";
  className?: string;
};

const listingVariant: Record<
  ListingStatus,
  "default" | "accent" | "muted" | "secondary" | "rent"
> = {
  aktif: "default",
  rezerve: "accent",
  satildi: "muted",
  kiralandi: "rent",
  pasif: "muted",
};

const projectVariant: Record<
  ProjectStatus,
  "default" | "accent" | "muted" | "featured" | "secondary"
> = {
  planlama: "secondary",
  insaat: "accent",
  tamamlandi: "default",
  satista: "featured",
};

function getLabel(
  status: ListingStatus | ProjectStatus,
  type: "listing" | "project",
): string {
  if (type === "project") {
    return PROJECT_STATUSES.find((item) => item.value === status)?.label ?? status;
  }
  return LISTING_STATUSES.find((item) => item.value === status)?.label ?? status;
}

export function StatusBadge({
  status,
  type = "listing",
  className,
}: StatusBadgeProps) {
  const variant =
    type === "project"
      ? projectVariant[status as ProjectStatus]
      : listingVariant[status as ListingStatus];

  return (
    <Badge variant={variant} className={cn(className)}>
      {getLabel(status, type)}
    </Badge>
  );
}
