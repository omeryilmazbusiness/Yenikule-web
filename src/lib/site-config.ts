export const siteConfig = {
  name: "Yeni Kule İnşaat",
  shortName: "Yeni Kule",
  description:
    "İstanbul'da konut, ticari ve yatırım projeleri ile güvenilir inşaat ve gayrimenkul çözümleri sunan Yeni Kule İnşaat.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yenikuleinsaat.com",
  locale: "tr-TR",
  phone: "+900000000000",
  phoneDisplay: "+90 000 000 00 00",
  whatsapp: "+900000000000",
  whatsappDisplay: "+90 000 000 00 00",
  email: "info@yenikuleinsaat.com",
  address: {
    street: "Bağcılar Mahallesi, Yeni Kule Caddesi No: 12",
    district: "Bağcılar",
    city: "İstanbul",
    postalCode: "34200",
    country: "Türkiye",
    full: "İstanbul, Türkiye",
  },
  workingHours: "Pazartesi – Cumartesi: 09:00 – 18:00",
  socialLinks: {
    instagram: "https://instagram.com/yenikuleinsaat",
    facebook: "https://facebook.com/yenikuleinsaat",
    linkedin: "https://linkedin.com/company/yenikuleinsaat",
    youtube: "https://youtube.com/@yenikuleinsaat",
  },
  company: {
    legalName: "Yeni Kule İnşaat Sanayi ve Ticaret A.Ş.",
    taxOffice: "Bağcılar",
    taxNumber: "1234567890",
    mersis: "0123456789012345",
  },
} as const;

export type SiteConfig = typeof siteConfig;
