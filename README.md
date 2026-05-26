# Yeni Kule İnşaat — Web Uygulaması

Modern, mobil-öncelikli kurumsal web uygulaması: ilan/katalog, proje tanıtımı, admin panel, içerik yönetimi ve iletişim talepleri. Next.js App Router, TypeScript, repository/service mimarisi ve mock veri ile çalışır; Supabase, Vercel Blob ve gerçek auth’a geçiş için hazırdır.

## Kurulum

```bash
npm install
cp .env.example .env.local
```

## Local çalıştırma

```bash
npm run dev
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)

**Admin girişi (mock):**

- URL: `/admin/login`
- E-posta: `admin@yenikuleinsaat.com`
- Şifre: `Admin123!`

## Production build

```bash
npm run build
npm run start
```

## Vercel deploy

1. [vercel.com](https://vercel.com) üzerinde projeyi import edin (GitHub repo bağlayın).
2. Framework: **Next.js** (otomatik algılanır).
3. **Environment Variables** bölümüne `.env.example` içindeki değişkenleri ekleyin.
4. Deploy — `main` branch her push’ta otomatik deploy alır.
5. **Settings → Domains** ile custom domain bağlayın (`www.yenikuleinsaat.com` vb.).
6. `NEXT_PUBLIC_SITE_URL` değerini production domain ile güncelleyin.

## Environment variables

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (SEO, sitemap) |
| `NEXT_PUBLIC_SITE_NAME` | Site adı |
| `USE_MOCK_DATA` | `true` = mock repository’ler (varsayılan) |
| `ADMIN_EMAIL` | Mock admin e-posta |
| `ADMIN_PASSWORD` | Mock admin şifre |
| `DATABASE_URL` | Neon/PostgreSQL connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server only) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |

## İçerik nereden değişir?

| İçerik | Konum |
|--------|--------|
| Firma bilgileri, iletişim, sosyal | `src/lib/site-config.ts` |
| Rotalar | `src/lib/routes.ts` |
| Mock ilanlar | `src/features/listings/data/listings.mock.ts` |
| Mock projeler | `src/features/projects/data/projects.mock.ts` |
| Mock araçlar | `src/features/vehicles/data/vehicles.mock.ts` |
| Mock mesajlar | `src/features/contact/data/contact.mock.ts` |
| Hakkımızda / Hizmetler sayfa metinleri | `src/app/(public)/hakkimizda/page.tsx`, `hizmetler/page.tsx` |
| Ana sayfa bölümleri | `src/components/home/*` |

Admin panelden eklenen kayıtlar mock modda bellek içinde tutulur (sunucu yeniden başlayınca sıfırlanır).

## Görseller ve video

```
public/
  images/placeholders/   # Varsayılan placeholder SVG’ler
  images/listings/       # İlan görselleri
  images/projects/       # Proje görselleri
  images/vehicles/       # Araç görselleri
  videos/
    hero-construction.mp4   # Ana sayfa hero videosu (siz ekleyin)
  icons/                 # Favicon / PWA ikonları
```

`next/image` local dosyaları otomatik optimize eder. Production’da CDN için admin medya yüklemesi veya Blob/Cloudinary kullanın.

## Mock → gerçek database

1. `USE_MOCK_DATA=false` yapın.
2. `src/lib/db.ts` içinde Prisma/Drizzle veya Supabase client bağlayın.
3. Her feature için `*.repository.ts` arayüzünü implement eden yeni dosya ekleyin (ör. `listing.supabase.repository.ts`).
4. `src/features/listings/services/listing.service.ts` içinde mock yerine gerçek repository’yi inject edin (factory pattern veya env’e göre seçim).
5. UI ve component’lere dokunmayın — sadece repository/service katmanı değişir.

## Auth → Supabase / Clerk / NextAuth

1. `src/features/auth/auth.service.ts` içindeki mock implementasyonu gerçek provider ile değiştirin.
2. `auth-guards.ts` ve `auth-cookies.ts` session/JWT doğrulamasını kullanmaya devam eder.
3. Admin API route’ları (`src/app/api/admin/*`) aynı guard’ları çağırmalıdır.

## Storage (Vercel Blob / Supabase / Cloudinary)

1. `src/features/uploads/upload.service.ts` — provider seçimi (`STORAGE_PROVIDER` env).
2. Hazır stub’lar: `vercel-blob.provider.ts`, `supabase-storage.provider.ts`.
3. Mock: `mock-storage.provider.ts` (preview URL döner).
4. Admin `ImageUploader` → `POST /api/admin/uploads`.

## Proje yapısı

```
src/
  app/              # App Router sayfaları ve API
  components/       # UI, layout, feature bileşenleri
  features/         # Domain: types, schemas, mock, repository, service
  lib/              # Config, SEO, utils, env
```

## Public rotalar (Türkçe URL)

| Sayfa | URL |
|-------|-----|
| Ana sayfa | `/` |
| İlanlar | `/ilanlar` |
| Projeler | `/projeler` |
| Araçlar | `/araclar` |
| Hakkımızda | `/hakkimizda` |
| Hizmetler | `/hizmetler` |
| İletişim | `/iletisim` |
| Admin | `/admin` |

## Lisans

Özel — Yeni Kule İnşaat.
