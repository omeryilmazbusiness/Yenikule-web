"use client";

import { usePathname } from "next/navigation";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicMobileHeader } from "@/components/layout/PublicMobileHeader";

export function PublicLayoutChrome() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <PublicHeader overlay={isHome} />
      <PublicMobileHeader overlay={isHome} />
      {!isHome ? (
        <div
          className="h-14 shrink-0 lg:h-[4.5rem]"
          aria-hidden
        />
      ) : null}
    </>
  );
}
