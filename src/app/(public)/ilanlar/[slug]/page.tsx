import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { ListingDetailPanel } from "@/components/listings/ListingDetailPanel";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingStickyContactBar } from "@/components/listings/ListingStickyContactBar";
import { SimilarListings } from "@/components/listings/SimilarListings";
import { listingService } from "@/features/listings/services/listing.service";
import { getListingPrimaryMedia } from "@/features/listings/utils/listing-media";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

type ListingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ListingDetailPageProps) {
  const { slug } = await params;
  const listing = await listingService.getBySlug(slug);

  if (!listing) {
    return createPageMetadata({
      title: "İlan Bulunamadı",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: listing.title,
    description: listing.shortDescription,
    path: routes.listings.detail(slug),
    image: getListingPrimaryMedia(listing)?.url ?? listing.images[0],
  });
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { slug } = await params;
  const listing = await listingService.getBySlug(slug);

  if (!listing) {
    notFound();
  }

  return (
    <>
      <Container className="listing-detail-page">
        <Breadcrumbs
          className="mb-6 md:mb-8"
          items={[
            { label: "İlanlar", href: routes.listings.index },
            { label: listing.title },
          ]}
        />

        <div className="listing-detail-layout">
          <ListingGallery
            media={listing.media}
            images={listing.images}
            title={listing.title}
          />
          <ListingDetailPanel listing={listing} />
        </div>
      </Container>

      <SimilarListings listing={listing} />
      <ListingStickyContactBar listing={listing} />
      <div className="h-24 lg:hidden" aria-hidden />
    </>
  );
}
