"use client";

import Link from "next/link";

import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminEntityActions } from "@/components/admin/AdminEntityActions";
import { deleteProjectAction } from "@/app/admin/(panel)/projeler/actions";
import { getProjectStatusLabel } from "@/features/projects/utils/project-formatters";
import type { Project } from "@/features/projects/types/project.types";
import { routes } from "@/lib/routes";

export function AdminProjectsTable({ items }: { items: Project[] }) {
  return (
    <AdminDataTable
      data={items}
      keyExtractor={(item) => item.id}
      columns={[
        {
          key: "title",
          header: "Proje",
          cell: (item) => (
            <Link href={routes.projects.edit(item.id)} className="font-medium hover:text-bronze">
              {item.title}
            </Link>
          ),
        },
        { key: "district", header: "İlçe", cell: (item) => item.district },
        {
          key: "status",
          header: "Durum",
          cell: (item) => getProjectStatusLabel(item.status),
        },
        {
          key: "actions",
          header: "",
          className: "w-12 text-right",
          cell: (item) => (
            <AdminEntityActions
              entityLabel="Proje"
              editHref={routes.projects.edit(item.id)}
              viewHref={routes.projects.detail(item.slug)}
              onDelete={() => deleteProjectAction(item.id)}
            />
          ),
        },
      ]}
    />
  );
}
