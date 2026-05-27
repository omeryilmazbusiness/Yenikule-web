import { projectMockRepository } from "@/features/projects/repositories/project.mock.repository";
import { projectPostgresRepository } from "@/features/projects/repositories/project.postgres.repository";
import type { ProjectRepository } from "@/features/projects/repositories/project.repository";
import type {
  Project,
  ProjectCreateInput,
  ProjectFilters,
  ProjectUpdateInput,
  PaginatedProjects,
} from "@/features/projects/types/project.types";
import { isMockMode } from "@/lib/env";

function getRepository(): ProjectRepository {
  if (isMockMode()) {
    return projectMockRepository;
  }
  return projectPostgresRepository;
}

export const projectService = {
  async getAll(filters?: ProjectFilters): Promise<PaginatedProjects> {
    return getRepository().findAll(filters);
  },

  async getById(id: string): Promise<Project | null> {
    return getRepository().findById(id);
  },

  async getBySlug(slug: string): Promise<Project | null> {
    return getRepository().findBySlug(slug);
  },

  async getFeatured(limit?: number): Promise<Project[]> {
    return getRepository().findFeatured(limit);
  },

  async create(input: ProjectCreateInput): Promise<Project> {
    return getRepository().create({
      ...input,
      coverImage: input.coverImage ?? input.images[0],
    });
  },

  async update(id: string, input: ProjectUpdateInput): Promise<Project | null> {
    return getRepository().update(id, input);
  },

  async remove(id: string): Promise<boolean> {
    return getRepository().delete(id);
  },
};
