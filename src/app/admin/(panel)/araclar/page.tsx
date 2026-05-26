import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminVehiclesTable } from "@/components/admin/AdminVehiclesTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Araç Yönetimi",
  path: routes.admin.vehicles,
  noIndex: true,
});

export default async function AdminVehiclesPage() {
  const { items } = await vehicleService.getAll({ pageSize: 100 });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Araçlar"
        description="Araç ilanlarını yönetin"
        actions={
          <Button asChild variant="accent">
            <Link href={routes.vehicles.create}>
              <Plus className="size-4" />
              Yeni Araç
            </Link>
          </Button>
        }
      />
      <AdminVehiclesTable items={items} />
    </div>
  );
}
