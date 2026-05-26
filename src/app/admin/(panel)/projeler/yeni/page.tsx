import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

import { createProjectAction } from "../actions";

export const metadata = createPageMetadata({
  title: "Yeni Proje",
  path: routes.projects.create,
  noIndex: true,
});

export default function AdminNewProjectPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Yeni Proje" description="Yeni inşaat projesi ekleyin" />
      <ProjectForm mode="create" submitLabel="Projeyi Kaydet" onSubmit={createProjectAction} />
    </div>
  );
}
