import { getDefaultSiteSettings } from "@/features/settings/data/default-site-settings";
import { siteSettingsRepository } from "@/features/settings/repositories/site-settings.repository";
import { siteSettingsSchema } from "@/features/settings/schemas/site-settings.schema";
import type { SiteSettings } from "@/features/settings/types/site-settings.types";
import { normalizeSiteSettings } from "@/features/settings/utils/normalize-site-settings";

export const siteSettingsService = {
  async get(): Promise<SiteSettings> {
    return normalizeSiteSettings(await siteSettingsRepository.get());
  },

  async getDefaults(): Promise<SiteSettings> {
    return getDefaultSiteSettings();
  },

  async save(raw: unknown): Promise<SiteSettings> {
    const current = await this.get();
    const parsed = siteSettingsSchema.parse(raw);

    const merged: SiteSettings = {
      ...current,
      ...parsed,
      address: { ...current.address, ...parsed.address },
      socialLinks: { ...current.socialLinks, ...parsed.socialLinks },
      company: { ...current.company, ...parsed.company },
      design: { ...current.design, ...parsed.design },
    };

    return siteSettingsRepository.save(merged);
  },
};
