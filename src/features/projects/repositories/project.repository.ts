import type {
  Project,
  ProjectCreateInput,
  ProjectFilters,
  ProjectUpdateInput,
  PaginatedProjects,
} from "@/features/projects/types/project.types";

export interface ProjectRepository {
  findAll(filters?: ProjectFilters): Promise<PaginatedProjects>;
  findById(id: string): Promise<Project | null>;
  findBySlug(slug: string): Promise<Project | null>;
  findFeatured(limit?: number): Promise<Project[]>;
  create(input: ProjectCreateInput): Promise<Project>;
  update(id: string, input: ProjectUpdateInput): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}
