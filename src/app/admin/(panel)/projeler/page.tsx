import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminProjectsTable } from "@/components/admin/AdminProjectsTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { projectService } from "@/features/projects/services/project.service";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Proje Yönetimi",
  path: routes.admin.projects,
  noIndex: true,
});

export default async function AdminProjectsPage() {
  const { items } = await projectService.getAll({ pageSize: 100 });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projeler"
        description="İnşaat projelerini yönetin"
        actions={
          <Button asChild variant="accent">
            <Link href={routes.projects.create}>
              <Plus className="size-4" />
              Yeni Proje
            </Link>
          </Button>
        }
      />
      <AdminProjectsTable items={items} />
    </div>
  );
}
