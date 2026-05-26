import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type AdminMetricCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    label: string;
    positive?: boolean;
  };
  className?: string;
};

export function AdminMetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: AdminMetricCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardDescription className="text-xs uppercase tracking-wide">
            {title}
          </CardDescription>
          <CardTitle className="font-heading text-3xl font-semibold tracking-tight">
            {value}
          </CardTitle>
        </div>
        {Icon ? (
          <div className="rounded-xl bg-surface-soft p-2.5 text-bronze">
            <Icon className="size-5" aria-hidden />
          </div>
        ) : null}
      </CardHeader>
      {(description || trend) && (
        <CardContent className="border-t border-border/60 bg-surface-soft/30 pt-4">
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
          {trend ? (
            <p
              className={cn(
                "mt-1 text-sm font-medium",
                trend.positive === true && "text-wood-medium",
                trend.positive === false && "text-destructive",
                trend.positive === undefined && "text-muted-foreground",
              )}
            >
              {trend.label}
            </p>
          ) : null}
        </CardContent>
      )}
    </Card>
  );
}
