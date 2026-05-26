import { LogOut, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type AdminTopbarProps = {
  title: string;
  userName?: string;
  userEmail?: string;
  className?: string;
};

export function AdminTopbar({
  title,
  userName = "Yönetici",
  userEmail,
  className,
}: AdminTopbarProps) {
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-6",
        className,
      )}
    >
      <h1 className="truncate text-lg font-semibold text-foreground md:text-xl">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <User className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-medium text-foreground">
              {userName}
            </p>
            {userEmail ? (
              <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
            ) : null}
          </div>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link href={routes.auth.logout}>
            <LogOut className="size-4" aria-hidden />
            <span className="hidden sm:inline">Çıkış</span>
            <span className="sr-only sm:hidden">Çıkış Yap</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
