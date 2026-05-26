"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";

type AdminShellProps = {
  children: ReactNode;
  title: string;
  userName?: string;
  userEmail?: string;
  className?: string;
};

export function AdminShell({
  children,
  title,
  userName,
  userEmail,
  className,
}: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={cn("flex min-h-screen bg-surface-soft", className)}>
      <div className="hidden shrink-0 md:block">
        <AdminSidebar activePath={pathname} className="sticky top-0 h-screen" />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin menü</SheetTitle>
          </SheetHeader>
          <AdminSidebar
            activePath={pathname}
            onNavigate={() => setMobileOpen(false)}
            className="h-full w-full border-0"
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-card px-4 md:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Menüyü aç"
          >
            <Menu className="size-5" aria-hidden />
          </Button>
          <span className="truncate text-sm font-semibold">{title}</span>
        </div>

        <AdminTopbar
          title={title}
          userName={userName}
          userEmail={userEmail}
          className="hidden md:flex"
        />

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
