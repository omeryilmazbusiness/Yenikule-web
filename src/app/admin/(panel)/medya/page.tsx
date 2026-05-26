import { AdminMediaClient } from "./AdminMediaClient";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Medya",
  path: routes.admin.media,
  noIndex: true,
});

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Medya Kütüphanesi"
        description="Görselleri yükleyin ve yönetin"
      />
      <AdminMediaClient />
    </div>
  );
}
