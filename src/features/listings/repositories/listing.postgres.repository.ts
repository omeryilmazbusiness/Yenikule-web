import type { ListingRepository } from "@/features/listings/repositories/listing.repository";
import type {
  Listing,
  ListingCreateInput,
  ListingFilters,
  ListingUpdateInput,
} from "@/features/listings/types/listing.types";
import {
  applyListingFilters,
  paginateListings,
} from "@/features/listings/utils/listing-filters";
import {
  imagesToListingMedia,
  listingMediaToImages,
  normalizeListingMedia,
  resolveListingMedia,
} from "@/features/listings/utils/listing-media";
import { mapListingRow } from "@/lib/db/row-mappers";
import { slugify } from "@/lib/format";
import { IMAGE_PLACEHOLDERS, sanitizeImages } from "@/lib/images";
import { asRows, getSql } from "@/lib/sql";
import { createId } from "@/lib/validations";

export class ListingPostgresRepository implements ListingRepository {
  async findAll(filters: ListingFilters = {}) {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM listings ORDER BY created_at DESC`);
    const all = rows.map((row) => mapListingRow(row as Parameters<typeof mapListingRow>[0]));
    const filtered = applyListingFilters(all, filters);
    const { page = 1, pageSize = 12 } = filters;
    return paginateListings(filtered, page, pageSize);
  }

  async findById(id: string): Promise<Listing | null> {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM listings WHERE id = ${id} LIMIT 1`);
    if (!rows[0]) return null;
    return mapListingRow(rows[0] as Parameters<typeof mapListingRow>[0]);
  }

  async findBySlug(slug: string): Promise<Listing | null> {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM listings WHERE slug = ${slug} LIMIT 1`);
    if (!rows[0]) return null;
    return mapListingRow(rows[0] as Parameters<typeof mapListingRow>[0]);
  }

  async findFeatured(limit = 6): Promise<Listing[]> {
    const sql = getSql();
    const rows = asRows(
      await sql`
        SELECT * FROM listings
        WHERE is_featured = true AND status = 'aktif'
        ORDER BY created_at DESC
        LIMIT ${limit}
      `,
    );
    return rows.map((row) => mapListingRow(row as Parameters<typeof mapListingRow>[0]));
  }

  async create(input: ListingCreateInput): Promise<Listing> {
    const sql = getSql();
    const now = new Date().toISOString();
    const slug = input.slug ?? slugify(input.title);
    const existing = await this.findBySlug(slug);
    if (existing) {
      throw new Error("Bu slug ile bir ilan zaten mevcut.");
    }

    const media = input.media?.length
      ? normalizeListingMedia(input.media)
      : imagesToListingMedia(
          sanitizeImages(input.images, IMAGE_PLACEHOLDERS.listing),
        );
    const id = createId();

    await sql`
      INSERT INTO listings (
        id, slug, title, description, short_description,
        category, type, status, price, currency, area,
        rooms, floor, total_floors, building_age,
        city, district, neighborhood, address,
        latitude, longitude, features, images, media,
        is_featured, project_id, created_at, updated_at
      ) VALUES (
        ${id}, ${slug}, ${input.title}, ${input.description}, ${input.shortDescription},
        ${input.category}, ${input.type}, ${input.status}, ${input.price}, ${input.currency}, ${input.area},
        ${input.rooms ?? null}, ${input.floor ?? null}, ${input.totalFloors ?? null}, ${input.buildingAge ?? null},
        ${input.city}, ${input.district}, ${input.neighborhood}, ${input.address},
        ${input.latitude ?? null}, ${input.longitude ?? null},
        ${JSON.stringify(input.features)}::jsonb,
        ${JSON.stringify(listingMediaToImages(media))}::jsonb,
        ${JSON.stringify(media)}::jsonb,
        ${input.isFeatured}, ${input.projectId ?? null}, ${now}, ${now}
      )
    `;

    const created = await this.findById(id);
    if (!created) throw new Error("İlan oluşturulamadı.");
    return created;
  }

  async update(id: string, input: ListingUpdateInput): Promise<Listing | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const slug = input.slug ?? (input.title ? slugify(input.title) : existing.slug);
    if (slug !== existing.slug) {
      const conflict = await this.findBySlug(slug);
      if (conflict && conflict.id !== id) {
        throw new Error("Bu slug ile bir ilan zaten mevcut.");
      }
    }

    const nextMedia =
      input.media !== undefined
        ? normalizeListingMedia(input.media)
        : input.images
          ? imagesToListingMedia(
              sanitizeImages(input.images, IMAGE_PLACEHOLDERS.listing),
            )
          : resolveListingMedia(existing);

    const merged: Listing = {
      ...existing,
      ...input,
      slug,
      media: nextMedia,
      images: listingMediaToImages(nextMedia),
      updatedAt: new Date().toISOString(),
    };

    const sql = getSql();
    await sql`
      UPDATE listings SET
        slug = ${merged.slug},
        title = ${merged.title},
        description = ${merged.description},
        short_description = ${merged.shortDescription},
        category = ${merged.category},
        type = ${merged.type},
        status = ${merged.status},
        price = ${merged.price},
        currency = ${merged.currency},
        area = ${merged.area},
        rooms = ${merged.rooms ?? null},
        floor = ${merged.floor ?? null},
        total_floors = ${merged.totalFloors ?? null},
        building_age = ${merged.buildingAge ?? null},
        city = ${merged.city},
        district = ${merged.district},
        neighborhood = ${merged.neighborhood},
        address = ${merged.address},
        latitude = ${merged.latitude ?? null},
        longitude = ${merged.longitude ?? null},
        features = ${JSON.stringify(merged.features)}::jsonb,
        images = ${JSON.stringify(merged.images)}::jsonb,
        media = ${JSON.stringify(merged.media ?? [])}::jsonb,
        is_featured = ${merged.isFeatured},
        project_id = ${merged.projectId ?? null},
        updated_at = ${merged.updatedAt}
      WHERE id = ${id}
    `;

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const sql = getSql();
    const rows = asRows(await sql`DELETE FROM listings WHERE id = ${id} RETURNING id`);
    return rows.length > 0;
  }

  /** Seed: mock veriyi ID koruyarak yazar */
  async upsert(listing: Listing): Promise<void> {
    const media = normalizeListingMedia(resolveListingMedia(listing));
    const images = listingMediaToImages(media);
    const sql = getSql();

    await sql`
      INSERT INTO listings (
        id, slug, title, description, short_description,
        category, type, status, price, currency, area,
        rooms, floor, total_floors, building_age,
        city, district, neighborhood, address,
        latitude, longitude, features, images, media,
        is_featured, project_id, created_at, updated_at
      ) VALUES (
        ${listing.id}, ${listing.slug}, ${listing.title}, ${listing.description}, ${listing.shortDescription},
        ${listing.category}, ${listing.type}, ${listing.status}, ${listing.price}, ${listing.currency}, ${listing.area},
        ${listing.rooms ?? null}, ${listing.floor ?? null}, ${listing.totalFloors ?? null}, ${listing.buildingAge ?? null},
        ${listing.city}, ${listing.district}, ${listing.neighborhood}, ${listing.address},
        ${listing.latitude ?? null}, ${listing.longitude ?? null},
        ${JSON.stringify(listing.features)}::jsonb,
        ${JSON.stringify(images)}::jsonb,
        ${JSON.stringify(media)}::jsonb,
        ${listing.isFeatured}, ${listing.projectId ?? null}, ${listing.createdAt}, ${listing.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        short_description = EXCLUDED.short_description,
        category = EXCLUDED.category,
        type = EXCLUDED.type,
        status = EXCLUDED.status,
        price = EXCLUDED.price,
        currency = EXCLUDED.currency,
        area = EXCLUDED.area,
        rooms = EXCLUDED.rooms,
        floor = EXCLUDED.floor,
        total_floors = EXCLUDED.total_floors,
        building_age = EXCLUDED.building_age,
        city = EXCLUDED.city,
        district = EXCLUDED.district,
        neighborhood = EXCLUDED.neighborhood,
        address = EXCLUDED.address,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        features = EXCLUDED.features,
        images = EXCLUDED.images,
        media = EXCLUDED.media,
        is_featured = EXCLUDED.is_featured,
        project_id = EXCLUDED.project_id,
        updated_at = EXCLUDED.updated_at
    `;
  }
}

export const listingPostgresRepository = new ListingPostgresRepository();
