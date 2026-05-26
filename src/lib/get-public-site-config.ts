import { siteSettingsService } from "@/features/settings/services/site-settings.service";
import type { SiteSettings } from "@/features/settings/types/site-settings.types";

export type PublicSiteConfig = SiteSettings;

export async function getPublicSiteConfig(): Promise<PublicSiteConfig> {
  return siteSettingsService.get();
}
