import { VehicleForm } from "@/components/admin/VehicleForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

import { createVehicleAction } from "../actions";

export const metadata = createPageMetadata({
  title: "Yeni Araç",
  path: routes.vehicles.create,
  noIndex: true,
});

export default function AdminNewVehiclePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Yeni Araç" description="Yeni araç ilanı ekleyin" />
      <VehicleForm mode="create" submitLabel="Aracı Kaydet" onSubmit={createVehicleAction} />
    </div>
  );
}
