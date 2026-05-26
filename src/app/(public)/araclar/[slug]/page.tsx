import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/layout/PageShell";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";
import { formatVehiclePrice } from "@/features/vehicles/utils/vehicle-formatters";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

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
    image: vehicle.images[0],
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
      <Container className="py-4">
        <Breadcrumbs
          items={[
            { label: "Araçlar", href: routes.vehicles.index },
            { label: vehicle.title },
          ]}
        />
      </Container>
      <PageShell title={vehicle.title} description={vehicle.shortDescription}>
        <div className="space-y-4 text-muted-foreground">
          <p className="text-2xl font-semibold text-foreground">
            {formatVehiclePrice(vehicle)}
          </p>
          <p>
            {vehicle.brand} {vehicle.model} · {vehicle.year} · {vehicle.mileage.toLocaleString("tr-TR")}{" "}
            km
          </p>
          <p className="whitespace-pre-line leading-relaxed">{vehicle.description}</p>
        </div>
      </PageShell>
    </>
  );
}
