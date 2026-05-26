import { PROJECT_STATUSES } from "@/lib/constants";
import type { Project } from "@/features/projects/types/project.types";

export function getProjectStatusLabel(status: Project["status"]): string {
  return PROJECT_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function formatProjectLocation(project: Project): string {
  return `${project.neighborhood}, ${project.district} / ${project.city}`;
}

export function formatProjectAvailability(project: Project): string {
  const sold = project.totalUnits - project.availableUnits;
  const percent = Math.round((sold / project.totalUnits) * 100);
  return `${project.availableUnits} müsait · %${percent} satıldı`;
}

export function formatProjectTimeline(project: Project): string {
  if (project.deliveryYear) {
    return `${project.startYear} – ${project.deliveryYear}`;
  }
  return `${project.startYear} – devam ediyor`;
}

export function getProjectStatusColor(
  status: Project["status"],
): "blue" | "amber" | "green" | "slate" {
  switch (status) {
    case "planlama":
      return "slate";
    case "insaat":
      return "amber";
    case "tamamlandi":
      return "green";
    case "satista":
      return "blue";
    default:
      return "slate";
  }
}
