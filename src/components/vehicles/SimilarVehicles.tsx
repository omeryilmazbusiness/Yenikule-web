import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { Button } from "@/components/ui/button";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";
import type { Vehicle } from "@/features/vehicles/types/vehicle.types";
import { routes } from "@/lib/routes";

type SimilarVehiclesProps = {
  vehicle: Vehicle;
  limit?: number;
};

export async function SimilarVehicles({ vehicle, limit = 3 }: SimilarVehiclesProps) {
  const { items } = await vehicleService.getAll({
    category: vehicle.category,
    status: "aktif",
    pageSize: limit + 1,
  });

  const similar = items.filter((item) => item.id !== vehicle.id).slice(0, limit);

  if (similar.length === 0) {
    return null;
  }

  return (
    <Section background="muted">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Benzer Araçlar
            </h2>
            <p className="mt-2 text-muted-foreground">
              Aynı kategorideki diğer fırsatları keşfedin
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={routes.vehicles.index}>
              Tüm Araçlar
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((item) => (
            <li key={item.id}>
              <VehicleCard vehicle={item} variant="immersive" className="h-full" />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

