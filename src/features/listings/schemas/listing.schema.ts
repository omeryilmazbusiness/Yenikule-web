import { z } from "zod";
import {
  listingMediaToImages,
  normalizeListingMedia,
} from "@/features/listings/utils/listing-media";
import {
  mediaUrlArraySchema,
  requiredPositiveNumberSchema,
  slugSchema,
} from "@/lib/validations";
import { createId } from "@/lib/validations";

const listingMediaItemSchema = z.object({
  id: z.string().default(() => createId()),
  type: z.enum(["image", "video"]),
  url: z.string().trim().min(1),
  isPrimary: z.boolean(),
});

export const listingCategorySchema = z.enum(
  ["konut", "isyeri", "arsa", "villa", "proje"],
  { error: "Geçerli bir kategori seçiniz." },
);

export const listingTypeSchema = z.enum(["satilik", "kiralik", "devren"], {
  error: "Geçerli bir ilan tipi seçiniz.",
});

export const listingStatusSchema = z.enum(
  ["aktif", "rezerve", "satildi", "kiralandi", "pasif"],
  { error: "Geçerli bir durum seçiniz." },
);

const listingInputSchema = z.object({
  title: z
    .string({ error: "Başlık gereklidir." })
    .trim()
    .min(5, "Başlık en az 5 karakter olmalıdır.")
    .max(200, "Başlık en fazla 200 karakter olabilir."),
  description: z
    .string({ error: "Açıklama gereklidir." })
    .trim()
    .min(20, "Açıklama en az 20 karakter olmalıdır."),
  shortDescription: z
    .string({ error: "Kısa açıklama gereklidir." })
    .trim()
    .min(10, "Kısa açıklama en az 10 karakter olmalıdır.")
    .max(300, "Kısa açıklama en fazla 300 karakter olabilir."),
  category: listingCategorySchema,
  type: listingTypeSchema,
  status: listingStatusSchema.default("aktif"),
  price: requiredPositiveNumberSchema,
  currency: z.string().default("TRY"),
  area: requiredPositiveNumberSchema,
  rooms: z.string().optional(),
  floor: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().optional(),
  ),
  totalFloors: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().positive().optional(),
  ),
  buildingAge: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().min(0).optional(),
  ),
  city: z.string().trim().min(2, "Şehir gereklidir."),
  district: z.string().trim().min(2, "İlçe gereklidir."),
  neighborhood: z.string().trim().min(2, "Mahalle gereklidir."),
  address: z.string().trim().min(5, "Adres gereklidir."),
  latitude: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().optional(),
  ),
  longitude: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().optional(),
  ),
  features: z.array(z.string()).default([]),
  media: z.array(listingMediaItemSchema).min(1, "En az bir fotoğraf veya video ekleyin."),
  images: mediaUrlArraySchema(1).optional(),
  isFeatured: z.boolean().default(false),
  projectId: z
    .string()
    .uuid("Geçerli bir proje seçiniz.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  slug: slugSchema.optional().or(z.literal("").transform(() => undefined)),
});

export const listingSchema = listingInputSchema.transform((data) => {
  const media = normalizeListingMedia(data.media);
  return {
    ...data,
    media,
    images: listingMediaToImages(media),
  };
});

export const listingCreateSchema = listingSchema;
export const listingUpdateSchema = listingInputSchema.partial();

export const listingFiltersSchema = z.object({
  search: z.string().optional(),
  category: listingCategorySchema.optional(),
  type: listingTypeSchema.optional(),
  status: listingStatusSchema.optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minArea: z.coerce.number().positive().optional(),
  maxArea: z.coerce.number().positive().optional(),
  rooms: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  projectId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
  sort: z.enum(["newest", "price-asc", "price-desc", "area-desc"]).default("newest"),
});

export type ListingFormValues = z.infer<typeof listingSchema>;
export type ListingCreateValues = z.infer<typeof listingCreateSchema>;
export type ListingUpdateValues = z.infer<typeof listingUpdateSchema>;
export type ListingFiltersValues = z.infer<typeof listingFiltersSchema>;
