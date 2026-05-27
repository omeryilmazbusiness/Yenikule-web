import type { ProjectRepository } from "@/features/projects/repositories/project.repository";
import type {
  Project,
  ProjectCreateInput,
  ProjectFilters,
  ProjectUpdateInput,
} from "@/features/projects/types/project.types";
import {
  applyProjectFilters,
  paginateProjects,
} from "@/features/projects/utils/project-filters";
import { mapProjectRow } from "@/lib/db/row-mappers";
import { slugify } from "@/lib/format";
import { IMAGE_PLACEHOLDERS, sanitizeImageUrl, sanitizeImages } from "@/lib/images";
import { asRows, getSql } from "@/lib/sql";
import { createId } from "@/lib/validations";

export class ProjectPostgresRepository implements ProjectRepository {
  async findAll(filters: ProjectFilters = {}) {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM projects ORDER BY created_at DESC`);
    const all = rows.map((row) => mapProjectRow(row as Parameters<typeof mapProjectRow>[0]));
    const filtered = applyProjectFilters(all, filters);
    const { page = 1, pageSize = 12 } = filters;
    return paginateProjects(filtered, page, pageSize);
  }

  async findById(id: string): Promise<Project | null> {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM projects WHERE id = ${id} LIMIT 1`);
    if (!rows[0]) return null;
    return mapProjectRow(rows[0] as Parameters<typeof mapProjectRow>[0]);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM projects WHERE slug = ${slug} LIMIT 1`);
    if (!rows[0]) return null;
    return mapProjectRow(rows[0] as Parameters<typeof mapProjectRow>[0]);
  }

  async findFeatured(limit = 6): Promise<Project[]> {
    const sql = getSql();
    const rows = asRows(
      await sql`
        SELECT * FROM projects
        WHERE is_featured = true
        ORDER BY created_at DESC
        LIMIT ${limit}
      `,
    );
    return rows.map((row) => mapProjectRow(row as Parameters<typeof mapProjectRow>[0]));
  }

  async create(input: ProjectCreateInput): Promise<Project> {
    const slug = input.slug ?? slugify(input.name);
    const existing = await this.findBySlug(slug);
    if (existing) throw new Error("Bu slug ile bir proje zaten mevcut.");

    const id = createId();
    const now = new Date().toISOString();
    const images = sanitizeImages(input.images, IMAGE_PLACEHOLDERS.project);
    const coverImage = sanitizeImageUrl(
      input.coverImage ?? images[0],
      IMAGE_PLACEHOLDERS.project,
    );

    const sql = getSql();
    await sql`
      INSERT INTO projects (
        id, slug, name, title, description, short_description,
        status, city, district, neighborhood, address,
        total_units, available_units, start_year, delivery_year,
        features, amenities, images, cover_image, brochure_url,
        is_featured, latitude, longitude, created_at, updated_at
      ) VALUES (
        ${id}, ${slug}, ${input.name}, ${input.title}, ${input.description}, ${input.shortDescription},
        ${input.status}, ${input.city}, ${input.district}, ${input.neighborhood}, ${input.address},
        ${input.totalUnits}, ${input.availableUnits}, ${input.startYear}, ${input.deliveryYear ?? null},
        ${JSON.stringify(input.features)}::jsonb,
        ${JSON.stringify(input.amenities)}::jsonb,
        ${JSON.stringify(images)}::jsonb,
        ${coverImage},
        ${input.brochureUrl ?? null},
        ${input.isFeatured},
        ${input.latitude ?? null},
        ${input.longitude ?? null},
        ${now}, ${now}
      )
    `;

    const created = await this.findById(id);
    if (!created) throw new Error("Proje oluşturulamadı.");
    return created;
  }

  async update(id: string, input: ProjectUpdateInput): Promise<Project | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const slug = input.slug ?? (input.name ? slugify(input.name) : existing.slug);
    if (slug !== existing.slug) {
      const conflict = await this.findBySlug(slug);
      if (conflict && conflict.id !== id) {
        throw new Error("Bu slug ile bir proje zaten mevcut.");
      }
    }

    const images = input.images
      ? sanitizeImages(input.images, IMAGE_PLACEHOLDERS.project)
      : existing.images;
    const merged: Project = {
      ...existing,
      ...input,
      slug,
      images,
      coverImage: sanitizeImageUrl(
        input.coverImage ?? images[0] ?? existing.coverImage,
        IMAGE_PLACEHOLDERS.project,
      ),
      updatedAt: new Date().toISOString(),
    };

    const sql = getSql();
    await sql`
      UPDATE projects SET
        slug = ${merged.slug},
        name = ${merged.name},
        title = ${merged.title},
        description = ${merged.description},
        short_description = ${merged.shortDescription},
        status = ${merged.status},
        city = ${merged.city},
        district = ${merged.district},
        neighborhood = ${merged.neighborhood},
        address = ${merged.address},
        total_units = ${merged.totalUnits},
        available_units = ${merged.availableUnits},
        start_year = ${merged.startYear},
        delivery_year = ${merged.deliveryYear ?? null},
        features = ${JSON.stringify(merged.features)}::jsonb,
        amenities = ${JSON.stringify(merged.amenities)}::jsonb,
        images = ${JSON.stringify(merged.images)}::jsonb,
        cover_image = ${merged.coverImage},
        brochure_url = ${merged.brochureUrl ?? null},
        is_featured = ${merged.isFeatured},
        latitude = ${merged.latitude ?? null},
        longitude = ${merged.longitude ?? null},
        updated_at = ${merged.updatedAt}
      WHERE id = ${id}
    `;

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const sql = getSql();
    const rows = asRows(await sql`DELETE FROM projects WHERE id = ${id} RETURNING id`);
    return rows.length > 0;
  }

  async upsert(project: Project): Promise<void> {
    const sql = getSql();
    await sql`
      INSERT INTO projects (
        id, slug, name, title, description, short_description,
        status, city, district, neighborhood, address,
        total_units, available_units, start_year, delivery_year,
        features, amenities, images, cover_image, brochure_url,
        is_featured, latitude, longitude, created_at, updated_at
      ) VALUES (
        ${project.id}, ${project.slug}, ${project.name}, ${project.title}, ${project.description}, ${project.shortDescription},
        ${project.status}, ${project.city}, ${project.district}, ${project.neighborhood}, ${project.address},
        ${project.totalUnits}, ${project.availableUnits}, ${project.startYear}, ${project.deliveryYear ?? null},
        ${JSON.stringify(project.features)}::jsonb,
        ${JSON.stringify(project.amenities)}::jsonb,
        ${JSON.stringify(project.images)}::jsonb,
        ${project.coverImage},
        ${project.brochureUrl ?? null},
        ${project.isFeatured},
        ${project.latitude ?? null},
        ${project.longitude ?? null},
        ${project.createdAt}, ${project.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        short_description = EXCLUDED.short_description,
        status = EXCLUDED.status,
        city = EXCLUDED.city,
        district = EXCLUDED.district,
        neighborhood = EXCLUDED.neighborhood,
        address = EXCLUDED.address,
        total_units = EXCLUDED.total_units,
        available_units = EXCLUDED.available_units,
        start_year = EXCLUDED.start_year,
        delivery_year = EXCLUDED.delivery_year,
        features = EXCLUDED.features,
        amenities = EXCLUDED.amenities,
        images = EXCLUDED.images,
        cover_image = EXCLUDED.cover_image,
        brochure_url = EXCLUDED.brochure_url,
        is_featured = EXCLUDED.is_featured,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        updated_at = EXCLUDED.updated_at
    `;
  }
}

export const projectPostgresRepository = new ProjectPostgresRepository();
