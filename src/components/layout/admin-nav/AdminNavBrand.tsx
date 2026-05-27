import Image from "next/image";
import Link from "next/link";

import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/cn";

type AdminNavBrandProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AdminNavBrand({ className, onNavigate }: AdminNavBrandProps) {
  return (
    <div className={cn("admin-nav-brand", className)}>
      <Link
        href={routes.admin.dashboard}
        onClick={onNavigate}
        className="admin-nav-brand-link"
      >
        <span className="admin-nav-brand-mark">
          <Image
            src="/images/brand/yenikule-mark.png"
            alt={`${siteConfig.shortName} logo`}
            fill
            sizes="40px"
            className="object-contain p-1.5"
            priority
          />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-heading text-sm font-semibold">
            {siteConfig.shortName}
          </span>
          <span className="block truncate text-xs text-white/55">
            Yönetim Paneli
          </span>
        </span>
      </Link>
    </div>
  );
}
