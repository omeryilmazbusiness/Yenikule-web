"use client";

import Link from "next/link";

import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminEntityActions } from "@/components/admin/AdminEntityActions";
import { deleteVehicleAction } from "@/app/admin/(panel)/araclar/actions";
import {
  formatVehiclePrice,
  getVehicleStatusLabel,
} from "@/features/vehicles/utils/vehicle-formatters";
import type { Vehicle } from "@/features/vehicles/types/vehicle.types";
import { routes } from "@/lib/routes";

export function AdminVehiclesTable({ items }: { items: Vehicle[] }) {
  return (
    <AdminDataTable
      data={items}
      keyExtractor={(item) => item.id}
      columns={[
        {
          key: "title",
          header: "Başlık",
          cell: (item) => (
            <Link href={routes.vehicles.edit(item.id)} className="font-medium hover:text-bronze">
              {item.title}
            </Link>
          ),
        },
        {
          key: "brand",
          header: "Marka / Model",
          cell: (item) => `${item.brand} ${item.model}`,
        },
        {
          key: "price",
          header: "Fiyat",
          cell: (item) => formatVehiclePrice(item),
        },
        {
          key: "status",
          header: "Durum",
          cell: (item) => getVehicleStatusLabel(item.status),
        },
        {
          key: "actions",
          header: "",
          className: "w-12 text-right",
          cell: (item) => (
            <AdminEntityActions
              entityLabel="Araç ilanı"
              editHref={routes.vehicles.edit(item.id)}
              viewHref={routes.vehicles.detail(item.slug)}
              onDelete={() => deleteVehicleAction(item.id)}
            />
          ),
        },
      ]}
    />
  );
}
