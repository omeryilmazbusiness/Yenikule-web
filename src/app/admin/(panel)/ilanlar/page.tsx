import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminListingsTable } from "@/components/admin/AdminListingsTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { listingService } from "@/features/listings/services/listing.service";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "İlan Yönetimi",
  path: routes.admin.listings,
  noIndex: true,
});

export default async function AdminListingsPage() {
  const { items } = await listingService.getAll({
    pageSize: 100,
    includeAllStatuses: true,
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="İlanlar"
        description="Gayrimenkul ilanlarını yönetin"
        actions={
          <Button asChild variant="accent">
            <Link href={routes.listings.create}>
              <Plus className="size-4" />
              Yeni İlan
            </Link>
          </Button>
        }
      />
      <AdminListingsTable items={items} />
    </div>
  );
}
