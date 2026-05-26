import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: {
    href: string;
    label: string;
  };
  trailing?: ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  trailing,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <span className="section-header-eyebrow">{eyebrow}</span>
        <h2 className="section-header-title">{title}</h2>
        {subtitle ? (
          <p className="section-header-subtitle">{subtitle}</p>
        ) : null}
      </div>

      {trailing ?? (action ? (
        <Link href={action.href} className="section-header-action shrink-0">
          {action.label}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      ) : null)}
    </div>
  );
}
