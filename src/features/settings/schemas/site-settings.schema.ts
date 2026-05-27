import { z } from "zod";

import { isValidHeroBackgroundVideoUrl } from "@/features/settings/utils/hero-background-video";

const addressSchema = z.object({
  street: z.string().trim().min(2),
  district: z.string().trim().min(2),
  city: z.string().trim().min(2),
  postalCode: z.string().trim().min(4),
  country: z.string().trim().min(2),
  full: z.string().trim().min(5),
});

export const siteSettingsSchema = z.object({
  name: z.string().trim().min(2, "Şirket adı gereklidir."),
  shortName: z.string().trim().min(2, "Kısa ad gereklidir."),
  description: z.string().trim().min(10, "Açıklama en az 10 karakter olmalıdır."),
  about: z.string().trim().min(20, "Hakkımızda metni en az 20 karakter olmalıdır."),
  aboutImageUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  logoUrl: z.string().trim().optional().or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().min(10, "Telefon gereklidir."),
  phoneDisplay: z.string().trim().min(10, "Görünen telefon gereklidir."),
  whatsapp: z.string().trim().min(10, "WhatsApp numarası gereklidir."),
  whatsappDisplay: z.string().trim().min(10, "Görünen WhatsApp gereklidir."),
  email: z.string().trim().email("Geçerli bir e-posta giriniz."),
  address: addressSchema,
  workingHours: z.string().trim().min(3, "Çalışma saatleri gereklidir."),
  socialLinks: z.object({
    instagram: z.string().trim().url().or(z.literal("")),
    facebook: z.string().trim().url().or(z.literal("")),
    linkedin: z.string().trim().url().or(z.literal("")),
    youtube: z.string().trim().url().or(z.literal("")),
  }),
  company: z.object({
    legalName: z.string().trim().min(2),
    taxOffice: z.string().trim().min(2),
    taxNumber: z.string().trim().min(5),
    mersis: z.string().trim().min(5),
  }),
  design: z.object({
    heroBackgroundVideoUrl: z
      .string()
      .trim()
      .min(1, "Ana sayfa video URL gereklidir.")
      .refine(isValidHeroBackgroundVideoUrl, {
        message:
          "Geçerli bir YouTube linki veya video dosyası URL'si giriniz (.mp4, .webm).",
      }),
  }),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
