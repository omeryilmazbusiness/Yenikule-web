import { z } from "zod";
import {
  mediaUrlArraySchema,
  requiredPositiveNumberSchema,
  slugSchema,
} from "@/lib/validations";

export const vehicleCategorySchema = z.enum(
  ["otomobil", "suv", "ticari", "motosiklet"],
  { error: "Geçerli bir araç kategorisi seçiniz." },
);

export const vehicleStatusSchema = z.enum(
  ["aktif", "rezerve", "satildi", "pasif"],
  { error: "Geçerli bir durum seçiniz." },
);

export const vehicleFuelTypeSchema = z.enum(
  ["benzin", "dizel", "lpg", "hibrit", "elektrik"],
  { error: "Geçerli bir yakıt tipi seçiniz." },
);

export const vehicleTransmissionSchema = z.enum(["manuel", "otomatik"], {
  error: "Geçerli bir vites tipi seçiniz.",
});

export const vehicleSchema = z.object({
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
  category: vehicleCategorySchema,
  status: vehicleStatusSchema.default("aktif"),
  brand: z.string().trim().min(2, "Marka gereklidir."),
  model: z.string().trim().min(1, "Model gereklidir."),
  trim: z.string().trim().optional().or(z.literal("").transform(() => undefined)),
  condition: z
    .object({
      accidentFree: z.boolean().default(false),
      paintFree: z.boolean().default(false),
    })
    .optional(),
  year: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ error: "Model yılı gereklidir." })
      .int()
      .min(1990, "Geçerli bir model yılı giriniz.")
      .max(new Date().getFullYear() + 1, "Geçerli bir model yılı giriniz."),
  ),
  mileage: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ error: "Kilometre gereklidir." })
      .int()
      .min(0, "Kilometre negatif olamaz."),
  ),
  fuelType: vehicleFuelTypeSchema,
  transmission: vehicleTransmissionSchema,
  engineSize: z.string().optional(),
  color: z.string().trim().min(2, "Renk gereklidir."),
  price: requiredPositiveNumberSchema,
  currency: z.string().default("TRY"),
  city: z.string().trim().min(2, "Şehir gereklidir."),
  features: z.array(z.string()).default([]),
  images: mediaUrlArraySchema(1),
  isFeatured: z.boolean().default(false),
  slug: slugSchema.optional().or(z.literal("").transform(() => undefined)),
});

export const vehicleCreateSchema = vehicleSchema;
export const vehicleUpdateSchema = vehicleSchema.partial();

export const vehicleFiltersSchema = z.object({
  search: z.string().optional(),
  category: vehicleCategorySchema.optional(),
  status: vehicleStatusSchema.optional(),
  fuelType: vehicleFuelTypeSchema.optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  isFeatured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
  sort: z.enum(["newest", "price-asc", "price-desc", "mileage-asc"]).default("newest"),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
export type VehicleCreateValues = z.infer<typeof vehicleCreateSchema>;
export type VehicleUpdateValues = z.infer<typeof vehicleUpdateSchema>;
export type VehicleFiltersValues = z.infer<typeof vehicleFiltersSchema>;
