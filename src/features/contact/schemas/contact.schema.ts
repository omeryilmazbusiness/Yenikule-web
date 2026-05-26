import { z } from "zod";
import { emailSchema, messageSchema, nameSchema, phoneSchema } from "@/lib/validations";
import { CONTACT_SUBJECTS } from "@/lib/constants";

export const contactSubjectSchema = z.enum(
  CONTACT_SUBJECTS as unknown as [string, ...string[]],
  { error: "Geçerli bir konu seçiniz." },
);

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: contactSubjectSchema,
  message: messageSchema,
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: "Kişisel verilerin işlenmesine ilişkin metni onaylamanız gerekiyor.",
    }),
  listingId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
  /** Honeypot — botlar doldurursa sessizce reddedilir */
  hp: z.string().optional(),
});

export const contactMessageStatusSchema = z.enum(
  ["yeni", "okundu", "yanitlandi", "arsiv"],
  { error: "Geçerli bir durum seçiniz." },
);

export type ContactFormValues = z.infer<typeof contactFormSchema>;
