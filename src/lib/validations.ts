import { z } from "zod";

export const emailSchema = z
  .string({ error: "E-posta adresi gereklidir." })
  .trim()
  .email("Geçerli bir e-posta adresi giriniz.");

export const phoneSchema = z
  .string({ error: "Telefon numarası gereklidir." })
  .trim()
  .min(10, "Telefon numarası en az 10 karakter olmalıdır.")
  .max(20, "Telefon numarası en fazla 20 karakter olabilir.");

export const nameSchema = z
  .string({ error: "Ad soyad gereklidir." })
  .trim()
  .min(2, "Ad soyad en az 2 karakter olmalıdır.")
  .max(100, "Ad soyad en fazla 100 karakter olabilir.");

export const messageSchema = z
  .string({ error: "Mesaj gereklidir." })
  .trim()
  .min(10, "Mesaj en az 10 karakter olmalıdır.")
  .max(5000, "Mesaj en fazla 5000 karakter olabilir.");

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug en az 2 karakter olmalıdır.")
  .max(120, "Slug en fazla 120 karakter olabilir.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir.");

export const positiveNumberSchema = z
  .number({ error: "Geçerli bir sayı giriniz." })
  .positive("Değer sıfırdan büyük olmalıdır.");

/** Relative (/...) veya absolute (http) medya yolları */
export const mediaUrlSchema = z
  .string()
  .trim()
  .min(1, "Görsel adresi gereklidir.")
  .refine(
    (value) =>
      value.startsWith("/") ||
      value.startsWith("http://") ||
      value.startsWith("https://"),
    { message: "Geçerli bir görsel adresi giriniz." },
  );

export function mediaUrlArraySchema(min = 1) {
  return z
    .array(mediaUrlSchema)
    .min(min, min === 1 ? "En az bir görsel ekleyiniz." : "Görsel gerekli.");
}

export const requiredPositiveNumberSchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    const num = typeof value === "number" ? value : Number(value);
    return Number.isNaN(num) ? undefined : num;
  },
  z
    .number({ error: "Geçerli bir sayı giriniz." })
    .positive("Değer sıfırdan büyük olmalıdır."),
);

export const optionalPositiveIntSchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    const num = typeof value === "number" ? value : Number(value);
    return Number.isNaN(num) ? undefined : num;
  },
  z.number().int().positive().optional(),
);

export const optionalPositiveNumberSchema = z
  .number()
  .positive("Değer sıfırdan büyük olmalıdır.")
  .optional();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export function createId(): string {
  return crypto.randomUUID();
}
