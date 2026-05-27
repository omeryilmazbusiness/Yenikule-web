import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { VehicleDetailPanel } from "@/components/vehicles/VehicleDetailPanel";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { VehicleStickyContactBar } from "@/components/vehicles/VehicleStickyContactBar";
import { SimilarVehicles } from "@/components/vehicles/SimilarVehicles";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { IMAGE_PLACEHOLDERS, pickPrimaryImage } from "@/lib/images";

type VehicleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await vehicleService.getBySlug(slug);

  if (!vehicle) {
    return createPageMetadata({ title: "Araç Bulunamadı", noIndex: true });
  }

  return createPageMetadata({
    title: vehicle.title,
    description: vehicle.shortDescription,
    path: routes.vehicles.detail(slug),
    image: pickPrimaryImage(vehicle.images, IMAGE_PLACEHOLDERS.vehicle),
  });
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await vehicleService.getBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  return (
    <>
      <Container className="listing-detail-page">
        <Breadcrumbs
          className="mb-6 md:mb-8"
          items={[
            { label: "Araçlar", href: routes.vehicles.index },
            { label: vehicle.title },
          ]}
        />
        <div className="listing-detail-layout">
          <VehicleGallery images={vehicle.images} title={vehicle.title} />
          <VehicleDetailPanel vehicle={vehicle} />
        </div>
      </Container>

      <SimilarVehicles vehicle={vehicle} />
      <VehicleStickyContactBar vehicle={vehicle} />
      <div className="h-24 lg:hidden" aria-hidden />
    </>
  );
}
