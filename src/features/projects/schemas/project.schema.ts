import { z } from "zod";
import {
  mediaUrlArraySchema,
  mediaUrlSchema,
  requiredPositiveNumberSchema,
  slugSchema,
} from "@/lib/validations";

export const projectStatusSchema = z.enum(
  ["planlama", "insaat", "tamamlandi", "satista"],
  { error: "Geçerli bir proje durumu seçiniz." },
);

export const projectSchema = z.object({
  name: z
    .string({ error: "Proje adı gereklidir." })
    .trim()
    .min(2, "Proje adı en az 2 karakter olmalıdır."),
  title: z
    .string({ error: "Başlık gereklidir." })
    .trim()
    .min(5, "Başlık en az 5 karakter olmalıdır."),
  description: z
    .string({ error: "Açıklama gereklidir." })
    .trim()
    .min(20, "Açıklama en az 20 karakter olmalıdır."),
  shortDescription: z
    .string({ error: "Kısa açıklama gereklidir." })
    .trim()
    .min(10, "Kısa açıklama en az 10 karakter olmalıdır.")
    .max(300, "Kısa açıklama en fazla 300 karakter olabilir."),
  status: projectStatusSchema,
  city: z.string().trim().min(2, "Şehir gereklidir."),
  district: z.string().trim().min(2, "İlçe gereklidir."),
  neighborhood: z.string().trim().min(2, "Mahalle gereklidir."),
  address: z.string().trim().min(5, "Adres gereklidir."),
  totalUnits: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ error: "Toplam birim sayısı gereklidir." })
      .int()
      .positive("Toplam birim sayısı sıfırdan büyük olmalıdır."),
  ),
  availableUnits: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ error: "Müsait birim sayısı gereklidir." })
      .int()
      .min(0, "Müsait birim sayısı negatif olamaz."),
  ),
  startYear: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ error: "Başlangıç yılı gereklidir." })
      .int()
      .min(2000, "Geçerli bir başlangıç yılı giriniz."),
  ),
  deliveryYear: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().min(2000).optional(),
  ),
  features: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  images: mediaUrlArraySchema(1),
  coverImage: mediaUrlSchema
    .optional()
    .or(z.literal("").transform(() => undefined)),
  brochureUrl: mediaUrlSchema.optional().or(z.literal("").transform(() => undefined)),
  isFeatured: z.boolean().default(false),
  latitude: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().optional(),
  ),
  longitude: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().optional(),
  ),
  slug: slugSchema.optional().or(z.literal("").transform(() => undefined)),
});

export const projectCreateSchema = projectSchema;
export const projectUpdateSchema = projectSchema.partial();

export const projectFiltersSchema = z.object({
  search: z.string().optional(),
  status: projectStatusSchema.optional(),
  city: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
export type ProjectCreateValues = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateValues = z.infer<typeof projectUpdateSchema>;
export type ProjectFiltersValues = z.infer<typeof projectFiltersSchema>;
