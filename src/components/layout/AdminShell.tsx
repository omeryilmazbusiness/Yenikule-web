"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { AdminMobileDrawer } from "@/components/layout/AdminMobileDrawer";
import { AdminMobileHeader } from "@/components/layout/AdminMobileHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={cn("admin-shell flex min-h-screen bg-surface-soft", className)}>
      <div className="hidden shrink-0 md:block">
        <AdminSidebar className="sticky top-0 h-screen" />
      </div>

      <AdminMobileDrawer
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        userName={userName}
        userEmail={userEmail}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileHeader
          title={title}
          onMenuOpen={() => setMobileOpen(true)}
        />

        <AdminTopbar
          title={title}
          userName={userName}
          userEmail={userEmail}
          className="hidden md:flex"
        />

        <main className="admin-shell-main flex-1 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
