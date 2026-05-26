import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

import { cn } from "@/lib/cn";

type FeaturePillProps = {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "accent";
  className?: string;
};

const variantClasses = {
  default: "bg-secondary text-secondary-foreground",
  outline: "border border-border bg-background text-foreground",
  accent: "bg-primary/10 text-primary",
} as const;

export function FeaturePill({
  label,
  icon: Icon = Check,
  variant = "default",
  className,
}: FeaturePillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {label}
    </span>
  );
}
