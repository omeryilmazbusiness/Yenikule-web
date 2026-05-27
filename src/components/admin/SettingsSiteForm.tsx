"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  SETTINGS_FORM_SECTIONS,
} from "@/components/admin/settings/settings-sections";
import {
  handleAdminFormSubmit,
  toastFormValidationErrors,
} from "@/components/admin/admin-form-utils";
import { saveSiteSettingsAction } from "@/app/admin/(panel)/ayarlar/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  siteSettingsSchema,
  type SiteSettingsFormValues,
} from "@/features/settings/schemas/site-settings.schema";
import type { SiteSettings } from "@/features/settings/types/site-settings.types";
import { cn } from "@/lib/cn";

type SettingsSiteFormProps = {
  defaultValues: SiteSettings;
  className?: string;
};

function FormSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="admin-form-section scroll-mt-28">
      <div className="admin-form-section-head">
        <h2 className="admin-form-section-title">{title}</h2>
        {description ? (
          <p className="admin-form-section-desc">{description}</p>
        ) : null}
      </div>
      <div className="admin-form-section-body">{children}</div>
    </section>
  );
}

export function SettingsSiteForm({ defaultValues, className }: SettingsSiteFormProps) {
  const router = useRouter();

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await saveSiteSettingsAction(values);
    await handleAdminFormSubmit(result, router, "Site ayarları kaydedildi.");
  }, toastFormValidationErrors);

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn("admin-settings-layout", className)}
      >
        <nav
          className="admin-settings-nav"
          aria-label="Ayar bölümleri"
        >
          <p className="admin-settings-nav-title">Bölümler</p>
          <ul className="admin-settings-nav-list">
            {SETTINGS_FORM_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="admin-settings-nav-item">
                    <Icon className="size-4 shrink-0 opacity-70" aria-hidden />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {section.label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {section.description}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="admin-settings-content admin-form-stack">
          <FormSection
            id="marka"
            title="Marka & logo"
            description="Ana sayfa, footer ve tarayıcı başlığında görünür."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şirket adı</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kısa ad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site açıklaması</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={field.value ? [field.value] : []}
                      onChange={(urls) => field.onChange(urls[0] ?? "")}
                      maxFiles={1}
                      folder="general"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            id="hakkimizda"
            title="Hakkımızda"
            description="Hakkımızda sayfası hero görseli ve kurumsal metin."
          >
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hakkımızda metni</FormLabel>
                  <FormControl>
                    <Textarea rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aboutImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hakkımızda görseli</FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={field.value ? [field.value] : []}
                      onChange={(urls) => field.onChange(urls[0] ?? "")}
                      maxFiles={1}
                      folder="general"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Hakkımızda sayfasının sağ üst hero alanında gösterilir.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            id="sirket"
            title="Şirket bilgileri"
            description="Footer ve kurumsal sayfalarda kullanılır."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="company.legalName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Ticari unvan</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company.taxOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vergi dairesi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company.taxNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vergi numarası</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company.mersis"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>MERSİS no</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            id="iletisim"
            title="İletişim"
            description="WhatsApp, telefon ve e-posta."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp (E.164)</FormLabel>
                    <FormControl>
                      <Input placeholder="+905551234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsappDisplay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp (görünen)</FormLabel>
                    <FormControl>
                      <Input placeholder="+90 555 123 45 67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon (E.164)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneDisplay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon (görünen)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workingHours"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Çalışma saatleri</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <FormSection id="adres" title="Adres">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Açık adres</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İlçe</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şehir</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posta kodu</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ülke</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.full"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Özet adres (harita/footer)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            id="tasarim"
            title="Ana sayfa videosu"
            description="Hero alanında oynatılacak arka plan videosu."
          >
            <FormField
              control={form.control}
              name="design.heroBackgroundVideoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arkaplan video URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    YouTube linki (watch, shorts, youtu.be) veya doğrudan video
                    dosyası (.mp4, .webm) URL&apos;si girebilirsiniz.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            id="sosyal"
            title="Sosyal medya"
            description="Footer ve iletişim sayfasında listelenir."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="socialLinks.instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLinks.facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLinks.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLinks.youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <div className="admin-form-actions admin-settings-save-bar">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="min-h-11"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : null}
              Değişiklikleri kaydet
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
