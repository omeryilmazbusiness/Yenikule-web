import { notFound } from "next/navigation";

import { VehicleForm } from "@/components/admin/VehicleForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

import { updateVehicleAction } from "../../actions";

type EditVehiclePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditVehiclePageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: "Araç Düzenle",
    path: routes.vehicles.edit(id),
    noIndex: true,
  });
}

export default async function AdminEditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params;
  const vehicle = await vehicleService.getById(id);

  if (!vehicle) {
    notFound();
  }

  const boundUpdate = updateVehicleAction.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Araç Düzenle" description={vehicle.title} />
      <VehicleForm
        mode="edit"
        defaultValues={vehicle}
        submitLabel="Değişiklikleri Kaydet"
        onSubmit={boundUpdate}
      />
    </div>
  );
}
