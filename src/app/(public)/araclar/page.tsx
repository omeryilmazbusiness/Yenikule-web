import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/layout/PageShell";
import { VehicleGrid } from "@/components/vehicles/VehicleGrid";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Araçlar",
  description: "Satılık araç ilanları ve kurumsal araç portföyü.",
  path: routes.vehicles.index,
});

export default async function VehiclesPage() {
  const { items } = await vehicleService.getAll({
    pageSize: 48,
    sort: "newest",
    status: "aktif",
  });

  return (
    <PageShell
      title="Araç İlanları"
      description="Güvenilir araç alım-satım portföyümüzü inceleyin."
    >
      <Container>
        <VehicleGrid vehicles={items} variant="immersive" />
      </Container>
    </PageShell>
  );
}
