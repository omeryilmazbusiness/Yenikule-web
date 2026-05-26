import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { ProjectDetailPanel } from "@/components/projects/ProjectDetailPanel";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectStickyContactBar } from "@/components/projects/ProjectStickyContactBar";
import { SimilarProjects } from "@/components/projects/SimilarProjects";
import { projectService } from "@/features/projects/services/project.service";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await projectService.getBySlug(slug);

  if (!project) {
    return createPageMetadata({
      title: "Proje Bulunamadı",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: project.title,
    description: project.shortDescription,
    path: routes.projects.detail(slug),
    image: project.coverImage,
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await projectService.getBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Container className="listing-detail-page">
        <Breadcrumbs
          className="mb-6 md:mb-8"
          items={[
            { label: "Projeler", href: routes.projects.index },
            { label: project.title },
          ]}
        />

        <div className="listing-detail-layout">
          <ProjectGallery
            images={project.images}
            coverImage={project.coverImage}
            title={project.title}
          />
          <ProjectDetailPanel project={project} />
        </div>
      </Container>

      <SimilarProjects project={project} />
      <ProjectStickyContactBar project={project} />
      <div className="h-24 lg:hidden" aria-hidden />
    </>
  );
}
