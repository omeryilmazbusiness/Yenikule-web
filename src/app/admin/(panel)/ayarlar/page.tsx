import { SettingsForm } from "@/components/admin/SettingsForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { siteSettingsService } from "@/features/settings/services/site-settings.service";
import { formatDateTime } from "@/lib/format";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Ayarlar",
  path: routes.admin.settings,
  noIndex: true,
});

export default async function AdminSettingsPage() {
  const settings = await siteSettingsService.get();

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Site Ayarları"
        description="Şirket bilgileri tüm sitede bu ayarlardan beslenir."
      />
      <p className="admin-meta-line">
        Son güncelleme: {formatDateTime(settings.updatedAt)}
      </p>
      <SettingsForm defaultValues={settings} />
    </div>
  );
}
