import { promises as fs } from "node:fs";
import path from "node:path";

import { getDefaultSiteSettings } from "@/features/settings/data/default-site-settings";
import type { SiteSettings } from "@/features/settings/types/site-settings.types";
import { normalizeSiteSettings } from "@/features/settings/utils/normalize-site-settings";

const globalStore = globalThis as typeof globalThis & {
  __siteSettingsStore?: SiteSettings;
  __siteSettingsLoaded?: boolean;
};

function getFilePath(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "yenikule-site-settings.json");
  }
  return path.join(process.cwd(), ".data", "site-settings.json");
}

async function readFromDisk(): Promise<SiteSettings | null> {
  try {
    const raw = await fs.readFile(getFilePath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    if (!parsed.name || !parsed.email) return null;
    return normalizeSiteSettings(parsed);
  } catch {
    return null;
  }
}

async function writeToDisk(settings: SiteSettings): Promise<void> {
  const filePath = getFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(settings, null, 2), "utf8");
}

async function ensureLoaded(): Promise<SiteSettings> {
  if (globalStore.__siteSettingsLoaded && globalStore.__siteSettingsStore) {
    return normalizeSiteSettings(globalStore.__siteSettingsStore);
  }

  const fromDisk = await readFromDisk();
  const settings = fromDisk ?? getDefaultSiteSettings();
  const normalized = normalizeSiteSettings(settings);
  globalStore.__siteSettingsStore = normalized;
  globalStore.__siteSettingsLoaded = true;
  return normalized;
}

export const siteSettingsRepository = {
  async get(): Promise<SiteSettings> {
    const settings = await ensureLoaded();
    const normalized = normalizeSiteSettings(settings);
    globalStore.__siteSettingsStore = normalized;
    return normalized;
  },

  async save(settings: SiteSettings): Promise<SiteSettings> {
    const next = normalizeSiteSettings({
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    globalStore.__siteSettingsStore = next;
    globalStore.__siteSettingsLoaded = true;

    try {
      await writeToDisk(next);
    } catch (error) {
      console.warn("[site-settings] Disk yazılamadı:", error);
    }

    return next;
  },
};
