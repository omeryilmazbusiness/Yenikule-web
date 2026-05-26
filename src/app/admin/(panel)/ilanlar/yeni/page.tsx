import { ListingForm } from "@/components/admin/ListingForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

import { createListingAction } from "../actions";

export const metadata = createPageMetadata({
  title: "Yeni İlan",
  path: routes.listings.create,
  noIndex: true,
});

export default function AdminNewListingPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Yeni İlan" description="Yeni gayrimenkul ilanı ekleyin" />
      <ListingForm
        mode="create"
        submitLabel="İlanı Kaydet"
        onSubmit={createListingAction}
      />
    </div>
  );
}
