import { FeaturedListingsSection } from "@/components/home/FeaturedListingsSection";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { listingService } from "@/features/listings/services/listing.service";

export async function HomeFeaturedListings() {
  const listings = await listingService.getFeatured(9);

  if (listings.length === 0) {
    return null;
  }

  return (
    <Section background="default" className="home-section section-showcase">
      <Container>
        <FeaturedListingsSection listings={listings} />
      </Container>
    </Section>
  );
}
