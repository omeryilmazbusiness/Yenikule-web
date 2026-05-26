"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { PublicSiteConfig } from "@/lib/get-public-site-config";
import { getDefaultSiteSettings } from "@/features/settings/data/default-site-settings";

const SiteConfigContext = createContext<PublicSiteConfig>(getDefaultSiteSettings());

export function SiteConfigProvider({
  config,
  children,
}: {
  config: PublicSiteConfig;
  children: ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): PublicSiteConfig {
  return useContext(SiteConfigContext);
}
