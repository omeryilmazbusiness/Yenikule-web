import { getDefaultSiteSettings } from "@/features/settings/data/default-site-settings";
import type { SiteSettings } from "@/features/settings/types/site-settings.types";

export function normalizeSiteSettings(
  partial: Partial<SiteSettings> | SiteSettings,
): SiteSettings {
  const defaults = getDefaultSiteSettings();

  return {
    ...defaults,
    ...partial,
    address: { ...defaults.address, ...partial.address },
    socialLinks: { ...defaults.socialLinks, ...partial.socialLinks },
    company: { ...defaults.company, ...partial.company },
    design: { ...defaults.design, ...partial.design },
    updatedAt: partial.updatedAt ?? defaults.updatedAt,
  };
}
