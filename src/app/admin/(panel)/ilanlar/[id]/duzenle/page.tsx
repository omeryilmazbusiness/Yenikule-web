import { notFound } from "next/navigation";

import { ListingForm } from "@/components/admin/ListingForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { listingService } from "@/features/listings/services/listing.service";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

import { updateListingAction } from "../../actions";

type EditListingPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditListingPageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: "İlan Düzenle",
    path: routes.listings.edit(id),
    noIndex: true,
  });
}

export default async function AdminEditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const listing = await listingService.getById(id);

  if (!listing) {
    notFound();
  }

  const boundUpdate = updateListingAction.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="İlan Düzenle" description={listing.title} />
      <ListingForm
        mode="edit"
        defaultValues={listing}
        submitLabel="Değişiklikleri Kaydet"
        onSubmit={boundUpdate}
      />
    </div>
  );
}
