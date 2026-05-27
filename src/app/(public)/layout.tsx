import type { ReactNode } from "react";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicLayoutChrome } from "@/components/layout/PublicLayoutChrome";
import { PublicMobileFooter } from "@/components/layout/PublicMobileFooter";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { SiteConfigProvider } from "@/components/providers/SiteConfigProvider";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const siteConfig = await getPublicSiteConfig();

  return (
    <SiteConfigProvider config={siteConfig}>
      <PublicLayoutChrome />
      <div className="flex flex-1 flex-col pb-[var(--mobile-dock-clearance)] lg:pb-0">
        {children}
      </div>
      <PublicMobileFooter />
      <PublicFooter className="hidden lg:block" />
      <MobileBottomNavigation />
    </SiteConfigProvider>
  );
}
