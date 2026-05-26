import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "muted" | "card" | "soft" | "dark" | "anthracite";
};

const backgroundClasses = {
  default: "bg-white",
  muted: "bg-[#fafafa]",
  card: "bg-white",
  soft: "bg-white",
  dark: "bg-black text-white",
  anthracite: "bg-anthracite text-white",
} as const;

export function Section({
  children,
  className,
  id,
  background = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-14 md:py-16 lg:py-24",
        backgroundClasses[background],
        className,
      )}
    >
      {children}
    </section>
  );
}
