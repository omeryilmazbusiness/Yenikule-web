import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type MobileFloatingContactBarProps = {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function MobileFloatingContactBar({
  children,
  className,
  "aria-label": ariaLabel = "Hızlı iletişim",
}: MobileFloatingContactBarProps) {
  return (
    <div
      className={cn("mobile-contact-dock mobile-above-dock lg:hidden", className)}
      aria-label={ariaLabel}
    >
      <div className="mobile-contact-dock-glass">{children}</div>
    </div>
  );
}
