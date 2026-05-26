import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ListingCard } from "@/components/listings/ListingCard";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { listingService } from "@/features/listings/services/listing.service";
import type { Listing } from "@/features/listings/types/listing.types";
import { routes } from "@/lib/routes";

type SimilarListingsProps = {
  listing: Listing;
  limit?: number;
};

export async function SimilarListings({ listing, limit = 3 }: SimilarListingsProps) {
  const { items } = await listingService.getAll({
    category: listing.category,
    district: listing.district,
    pageSize: limit + 1,
  });

  const similar = items.filter((item) => item.id !== listing.id).slice(0, limit);

  if (similar.length === 0) {
    return null;
  }

  return (
    <Section background="muted">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Benzer İlanlar
            </h2>
            <p className="mt-2 text-muted-foreground">
              Aynı bölge ve kategorideki diğer fırsatlar
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={routes.listings.index}>
              Tüm İlanlar
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((item) => (
            <li key={item.id}>
              <ListingCard listing={item} variant="immersive" className="h-full" />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
