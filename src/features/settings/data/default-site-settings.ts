import type { SiteSettings } from "@/features/settings/types/site-settings.types";
import { HERO_YOUTUBE_URL } from "@/data/home/hero-video";
import { siteConfig } from "@/lib/site-config";

export function getDefaultSiteSettings(): SiteSettings {
  return {
    name: siteConfig.name,
    shortName: siteConfig.shortName,
    description: siteConfig.description,
    about:
      "Yeni Kule İnşaat olarak konut ve ticari projeler geliştiriyor; satış, kiralama ve yatırım danışmanlığı alanlarında güvenilir hizmet sunuyoruz.",
    aboutImageUrl: "/images/about/yeni-kule-about-hero.png",
    logoUrl: undefined,
    phone: siteConfig.phone,
    phoneDisplay: siteConfig.phoneDisplay,
    whatsapp: siteConfig.whatsapp,
    whatsappDisplay: siteConfig.whatsappDisplay,
    email: siteConfig.email,
    address: { ...siteConfig.address },
    workingHours: siteConfig.workingHours,
    socialLinks: { ...siteConfig.socialLinks },
    company: { ...siteConfig.company },
    design: {
      heroBackgroundVideoUrl: HERO_YOUTUBE_URL,
    },
    updatedAt: new Date().toISOString(),
  };
}
