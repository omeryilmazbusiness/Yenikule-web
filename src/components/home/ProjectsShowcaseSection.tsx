"use client";

import { FeaturedProjectsCarousel } from "@/components/home/FeaturedProjectsCarousel";
import { MotionInView } from "@/components/common/MotionInView";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { Project } from "@/features/projects/types/project.types";
import { routes } from "@/lib/routes";

type ProjectsShowcaseSectionProps = {
  featured: Project | null;
  rest: Project[];
};

export function ProjectsShowcaseSection({
  featured,
  rest,
}: ProjectsShowcaseSectionProps) {
  const allProjects = [
    ...(featured ? [featured] : []),
    ...rest,
  ];

  return (
    <div className="space-y-10 md:space-y-12">
      <MotionInView stagger={false}>
        <SectionHeader
          eyebrow="Projeler"
          title="Yeni Kule İmzası Taşıyan Projeler"
          subtitle="Modern mimari, doğru lokasyon ve güvenilir teslim anlayışıyla geliştirilen projeler."
          action={{
            href: routes.projects.index,
            label: "Tüm Projeler",
          }}
        />
      </MotionInView>

      <FeaturedProjectsCarousel projects={allProjects} />
    </div>
  );
}
