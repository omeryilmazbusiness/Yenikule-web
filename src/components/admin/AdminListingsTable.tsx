"use client";

import Link from "next/link";

import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminEntityActions } from "@/components/admin/AdminEntityActions";
import { AdminListingStatusSelect } from "@/components/admin/AdminListingStatusSelect";
import { deleteListingAction } from "@/app/admin/(panel)/ilanlar/actions";
import {
  formatListingPrice,
  getListingCategoryLabel,
  getListingStatusLabel,
} from "@/features/listings/utils/listing-formatters";
import type { Listing } from "@/features/listings/types/listing.types";
import { routes } from "@/lib/routes";

type AdminListingsTableProps = {
  items: Listing[];
};

export function AdminListingsTable({ items }: AdminListingsTableProps) {
  return (
    <AdminDataTable
      data={items}
      keyExtractor={(item) => item.id}
      columns={[
        {
          key: "title",
          header: "Başlık",
          cell: (item) => (
            <Link
              href={routes.listings.edit(item.id)}
              className="font-medium hover:text-bronze"
            >
              {item.title}
            </Link>
          ),
        },
        {
          key: "category",
          header: "Kategori",
          cell: (item) => getListingCategoryLabel(item.category),
        },
        {
          key: "price",
          header: "Fiyat",
          cell: (item) => formatListingPrice(item),
        },
        {
          key: "status",
          header: "Durum",
          cell: (item) => <AdminListingStatusSelect listing={item} />,
        },
        {
          key: "actions",
          header: "",
          className: "w-12 text-right",
          cell: (item) => (
            <AdminEntityActions
              entityLabel="İlan"
              editHref={routes.listings.edit(item.id)}
              viewHref={routes.listings.detail(item.slug)}
              onDelete={() => deleteListingAction(item.id)}
            />
          ),
        },
      ]}
    />
  );
}
