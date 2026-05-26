import { AdminMessagesPanel } from "@/components/admin/AdminMessagesPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { contactService } from "@/features/contact/services/contact.service";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Mesajlar",
  path: routes.admin.messages,
  noIndex: true,
});

export default async function AdminMessagesPage() {
  const { items } = await contactService.getAll({ pageSize: 100 });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="İletişim Mesajları"
        description="Web sitesi üzerinden gelen talepler"
      />
      <AdminMessagesPanel messages={items} />
    </div>
  );
}
