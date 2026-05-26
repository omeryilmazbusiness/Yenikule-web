"use client";

import { FeaturedListingsCarousel } from "@/components/home/FeaturedListingsCarousel";
import { MotionInView } from "@/components/common/MotionInView";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { Listing } from "@/features/listings/types/listing.types";
import { routes } from "@/lib/routes";

type FeaturedListingsSectionProps = {
  listings: Listing[];
};

export function FeaturedListingsSection({ listings }: FeaturedListingsSectionProps) {
  return (
    <div className="space-y-10 md:space-y-12">
      <MotionInView stagger={false}>
        <SectionHeader
          eyebrow="Portföy"
          title="Öne Çıkan Yaşam ve Yatırım Fırsatları"
          subtitle="Satılık ve kiralık portföyümüzden seçilmiş güncel ilanları keşfedin."
          action={{
            href: routes.listings.index,
            label: "Tüm İlanlar",
          }}
        />
      </MotionInView>

      <FeaturedListingsCarousel listings={listings} />
    </div>
  );
}
