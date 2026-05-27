"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { easePremium, motionDuration } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon: LucideIcon;
};

type AnimatedSegmentControlProps<T extends string> = {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  isPending?: boolean;
  layoutId?: string;
  className?: string;
  variant?: "bar" | "switch";
  ariaLabel?: string;
};

export function AnimatedSegmentControl<T extends string>({
  options,
  value,
  onChange,
  isPending = false,
  layoutId = "listings-segment",
  className,
  variant = "bar",
  ariaLabel = "Kategori seçimi",
}: AnimatedSegmentControlProps<T>) {
  return (
    <div
      className={cn(
        "listings-segment-animated",
        variant === "switch" && "listings-segment-animated-switch",
        isPending && "listings-segment-animated-pending",
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
              "listings-segment-animated-btn",
              isActive && "listings-segment-animated-btn-active",
            )}
            onClick={() => onChange(option.value)}
          >
            {isActive ? (
              <motion.span
                layoutId={layoutId}
                className="listings-segment-animated-pill"
                transition={{
                  duration: motionDuration.normal,
                  ease: easePremium,
                }}
              />
            ) : null}
            <span className="listings-segment-animated-label">
              <Icon className="size-4 shrink-0" aria-hidden />
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
