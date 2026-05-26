import { mockProjects } from "@/features/projects/data/projects.mock";
import type { ProjectRepository } from "@/features/projects/repositories/project.repository";
import {
  applyProjectFilters,
  paginateProjects,
} from "@/features/projects/utils/project-filters";
import type {
  Project,
  ProjectCreateInput,
  ProjectFilters,
  ProjectUpdateInput,
} from "@/features/projects/types/project.types";
import { slugify } from "@/lib/format";
import { IMAGE_PLACEHOLDERS, sanitizeImageUrl, sanitizeImages } from "@/lib/images";
import { createId } from "@/lib/validations";

const globalStore = globalThis as typeof globalThis & {
  __projectStore?: Project[];
};

function normalizeProject(project: Project): Project {
  return {
    ...project,
    coverImage: sanitizeImageUrl(project.coverImage, IMAGE_PLACEHOLDERS.project),
    images: sanitizeImages(project.images, IMAGE_PLACEHOLDERS.project),
  };
}

function getStore(): Project[] {
  if (!globalStore.__projectStore) {
    globalStore.__projectStore = structuredClone(mockProjects).map(normalizeProject);
  } else {
    globalStore.__projectStore = globalStore.__projectStore.map(normalizeProject);
  }
  return globalStore.__projectStore;
}

export class ProjectMockRepository implements ProjectRepository {
  async findAll(filters: ProjectFilters = {}) {
    const filtered = applyProjectFilters(getStore(), filters);
    const { page = 1, pageSize = 12 } = filters;
    return paginateProjects(filtered, page, pageSize);
  }

  async findById(id: string): Promise<Project | null> {
    return getStore().find((p) => p.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Project | null> {
    return getStore().find((p) => p.slug === slug) ?? null;
  }

  async findFeatured(limit = 4): Promise<Project[]> {
    return getStore()
      .filter((p) => p.isFeatured)
      .slice(0, limit);
  }

  async create(input: ProjectCreateInput): Promise<Project> {
    const store = getStore();
    const now = new Date().toISOString();
    const slug = input.slug ?? slugify(input.name);

    if (store.some((p) => p.slug === slug)) {
      throw new Error("Bu slug ile bir proje zaten mevcut.");
    }

    const project: Project = normalizeProject({
      ...input,
      coverImage: sanitizeImageUrl(
        input.coverImage ?? input.images[0],
        IMAGE_PLACEHOLDERS.project,
      ),
      images: sanitizeImages(input.images, IMAGE_PLACEHOLDERS.project),
      id: createId(),
      slug,
      createdAt: now,
      updatedAt: now,
    });

    store.push(project);
    return project;
  }

  async update(id: string, input: ProjectUpdateInput): Promise<Project | null> {
    const store = getStore();
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = store[index]!;
    const slug =
      input.slug ??
      (input.name ? slugify(input.name) : existing.slug);

    if (slug !== existing.slug && store.some((p) => p.slug === slug && p.id !== id)) {
      throw new Error("Bu slug ile bir proje zaten mevcut.");
    }

    const updated: Project = normalizeProject({
      ...existing,
      ...input,
      coverImage: sanitizeImageUrl(
        input.coverImage ?? input.images?.[0] ?? existing.coverImage,
        IMAGE_PLACEHOLDERS.project,
      ),
      images: input.images
        ? sanitizeImages(input.images, IMAGE_PLACEHOLDERS.project)
        : existing.images,
      slug,
      updatedAt: new Date().toISOString(),
    });

    store[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const store = getStore();
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  }
}

export const projectMockRepository = new ProjectMockRepository();
