import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { projectService } from "@/features/projects/services/project.service";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

import { updateProjectAction } from "../../actions";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditProjectPageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: "Proje Düzenle",
    path: routes.projects.edit(id),
    noIndex: true,
  });
}

export default async function AdminEditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await projectService.getById(id);

  if (!project) {
    notFound();
  }

  const boundUpdate = updateProjectAction.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Proje Düzenle" description={project.title} />
      <ProjectForm
        mode="edit"
        defaultValues={project}
        submitLabel="Değişiklikleri Kaydet"
        onSubmit={boundUpdate}
      />
    </div>
  );
}
