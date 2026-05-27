import { SettingsSiteForm } from "@/components/admin/SettingsSiteForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { siteSettingsService } from "@/features/settings/services/site-settings.service";
import { formatDateTime } from "@/lib/format";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Siteyi özelleştir",
  path: routes.admin.settings,
  noIndex: true,
});

export default async function AdminSettingsPage() {
  const settings = await siteSettingsService.get();

  return (
    <div className="admin-page admin-page-wide">
      <AdminPageHeader
        title="Siteyi özelleştir"
        description="Marka, hakkımızda, şirket, iletişim, video ve sosyal medya ayarları."
      />
      <p className="admin-meta-line">
        Son güncelleme: {formatDateTime(settings.updatedAt)}
      </p>
      <SettingsSiteForm defaultValues={settings} />
    </div>
  );
}
