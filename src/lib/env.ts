import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("Geçerli bir site URL'si giriniz.")
    .default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
  ADMIN_EMAIL: z.string().email().default("admin@yenikuleinsaat.com"),
  ADMIN_PASSWORD: z.string().min(8).default("Admin123!"),
  USE_MOCK_DATA: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
});

function parseEnv() {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    USE_MOCK_DATA: process.env.USE_MOCK_DATA ?? "true",
  });

  if (!parsed.success) {
    console.warn(
      "[env] Ortam değişkenleri doğrulanamadı, varsayılan mock değerler kullanılıyor:",
      parsed.error.flatten().fieldErrors,
    );
    return envSchema.parse({});
  }

  return parsed.data;
}

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;

export const isMockMode = () => env.USE_MOCK_DATA || !env.DATABASE_URL;
