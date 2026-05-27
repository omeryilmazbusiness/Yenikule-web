import { ProjectsShowcaseSection } from "@/components/home/ProjectsShowcaseSection";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { projectService } from "@/features/projects/services/project.service";

export async function HomeProjectsShowcase() {
  const projects = await projectService.getFeatured(8);

  if (projects.length === 0) {
    return null;
  }

  const [featured, ...rest] = projects;

  return (
    <Section background="muted" className="home-section section-showcase">
      <Container>
        <ProjectsShowcaseSection featured={featured ?? null} rest={rest} />
      </Container>
    </Section>
  );
}
