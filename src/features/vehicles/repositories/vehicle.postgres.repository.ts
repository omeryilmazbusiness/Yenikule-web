import type { VehicleRepository } from "@/features/vehicles/repositories/vehicle.repository";
import type {
  Vehicle,
  VehicleCreateInput,
  VehicleFilters,
  VehicleUpdateInput,
} from "@/features/vehicles/types/vehicle.types";
import {
  applyVehicleFilters,
  paginateVehicles,
} from "@/features/vehicles/utils/vehicle-filters";
import { mapVehicleRow } from "@/lib/db/row-mappers";
import { slugify } from "@/lib/format";
import { IMAGE_PLACEHOLDERS, sanitizeImages } from "@/lib/images";
import { asRows, getSql } from "@/lib/sql";
import { createId } from "@/lib/validations";

export class VehiclePostgresRepository implements VehicleRepository {
  async findAll(filters: VehicleFilters = {}) {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM vehicles ORDER BY created_at DESC`);
    const all = rows.map((row) => mapVehicleRow(row as Parameters<typeof mapVehicleRow>[0]));
    const filtered = applyVehicleFilters(all, filters);
    const { page = 1, pageSize = 12 } = filters;
    return paginateVehicles(filtered, page, pageSize);
  }

  async findById(id: string): Promise<Vehicle | null> {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM vehicles WHERE id = ${id} LIMIT 1`);
    if (!rows[0]) return null;
    return mapVehicleRow(rows[0] as Parameters<typeof mapVehicleRow>[0]);
  }

  async findBySlug(slug: string): Promise<Vehicle | null> {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM vehicles WHERE slug = ${slug} LIMIT 1`);
    if (!rows[0]) return null;
    return mapVehicleRow(rows[0] as Parameters<typeof mapVehicleRow>[0]);
  }

  async findFeatured(limit = 6): Promise<Vehicle[]> {
    const sql = getSql();
    const rows = asRows(
      await sql`
        SELECT * FROM vehicles
        WHERE is_featured = true AND status = 'aktif'
        ORDER BY created_at DESC
        LIMIT ${limit}
      `,
    );
    return rows.map((row) => mapVehicleRow(row as Parameters<typeof mapVehicleRow>[0]));
  }

  async create(input: VehicleCreateInput): Promise<Vehicle> {
    const slug = input.slug ?? slugify(input.title);
    const existing = await this.findBySlug(slug);
    if (existing) throw new Error("Bu slug ile bir araç ilanı zaten mevcut.");

    const id = createId();
    const now = new Date().toISOString();
    const images = sanitizeImages(input.images, IMAGE_PLACEHOLDERS.vehicle);

    const sql = getSql();
    await sql`
      INSERT INTO vehicles (
        id, slug, title, description, short_description,
        category, status, brand, model, trim, condition,
        year, mileage, fuel_type, transmission, engine_size,
        color, price, currency, city, features, images,
        is_featured, created_at, updated_at
      ) VALUES (
        ${id}, ${slug}, ${input.title}, ${input.description}, ${input.shortDescription},
        ${input.category}, ${input.status}, ${input.brand}, ${input.model}, ${input.trim ?? null},
        ${input.condition ? JSON.stringify(input.condition) : null}::jsonb,
        ${input.year}, ${input.mileage}, ${input.fuelType}, ${input.transmission}, ${input.engineSize ?? null},
        ${input.color}, ${input.price}, ${input.currency}, ${input.city},
        ${JSON.stringify(input.features)}::jsonb,
        ${JSON.stringify(images)}::jsonb,
        ${input.isFeatured}, ${now}, ${now}
      )
    `;

    const created = await this.findById(id);
    if (!created) throw new Error("Araç ilanı oluşturulamadı.");
    return created;
  }

  async update(id: string, input: VehicleUpdateInput): Promise<Vehicle | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const slug = input.slug ?? (input.title ? slugify(input.title) : existing.slug);
    if (slug !== existing.slug) {
      const conflict = await this.findBySlug(slug);
      if (conflict && conflict.id !== id) {
        throw new Error("Bu slug ile bir araç ilanı zaten mevcut.");
      }
    }

    const merged: Vehicle = {
      ...existing,
      ...input,
      slug,
      images: input.images
        ? sanitizeImages(input.images, IMAGE_PLACEHOLDERS.vehicle)
        : existing.images,
      updatedAt: new Date().toISOString(),
    };

    const sql = getSql();
    await sql`
      UPDATE vehicles SET
        slug = ${merged.slug},
        title = ${merged.title},
        description = ${merged.description},
        short_description = ${merged.shortDescription},
        category = ${merged.category},
        status = ${merged.status},
        brand = ${merged.brand},
        model = ${merged.model},
        trim = ${merged.trim ?? null},
        condition = ${merged.condition ? JSON.stringify(merged.condition) : null}::jsonb,
        year = ${merged.year},
        mileage = ${merged.mileage},
        fuel_type = ${merged.fuelType},
        transmission = ${merged.transmission},
        engine_size = ${merged.engineSize ?? null},
        color = ${merged.color},
        price = ${merged.price},
        currency = ${merged.currency},
        city = ${merged.city},
        features = ${JSON.stringify(merged.features)}::jsonb,
        images = ${JSON.stringify(merged.images)}::jsonb,
        is_featured = ${merged.isFeatured},
        updated_at = ${merged.updatedAt}
      WHERE id = ${id}
    `;

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const sql = getSql();
    const rows = asRows(await sql`DELETE FROM vehicles WHERE id = ${id} RETURNING id`);
    return rows.length > 0;
  }

  async upsert(vehicle: Vehicle): Promise<void> {
    const sql = getSql();
    await sql`
      INSERT INTO vehicles (
        id, slug, title, description, short_description,
        category, status, brand, model, trim, condition,
        year, mileage, fuel_type, transmission, engine_size,
        color, price, currency, city, features, images,
        is_featured, created_at, updated_at
      ) VALUES (
        ${vehicle.id}, ${vehicle.slug}, ${vehicle.title}, ${vehicle.description}, ${vehicle.shortDescription},
        ${vehicle.category}, ${vehicle.status}, ${vehicle.brand}, ${vehicle.model}, ${vehicle.trim ?? null},
        ${vehicle.condition ? JSON.stringify(vehicle.condition) : null}::jsonb,
        ${vehicle.year}, ${vehicle.mileage}, ${vehicle.fuelType}, ${vehicle.transmission}, ${vehicle.engineSize ?? null},
        ${vehicle.color}, ${vehicle.price}, ${vehicle.currency}, ${vehicle.city},
        ${JSON.stringify(vehicle.features)}::jsonb,
        ${JSON.stringify(vehicle.images)}::jsonb,
        ${vehicle.isFeatured}, ${vehicle.createdAt}, ${vehicle.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        short_description = EXCLUDED.short_description,
        category = EXCLUDED.category,
        status = EXCLUDED.status,
        brand = EXCLUDED.brand,
        model = EXCLUDED.model,
        trim = EXCLUDED.trim,
        condition = EXCLUDED.condition,
        year = EXCLUDED.year,
        mileage = EXCLUDED.mileage,
        fuel_type = EXCLUDED.fuel_type,
        transmission = EXCLUDED.transmission,
        engine_size = EXCLUDED.engine_size,
        color = EXCLUDED.color,
        price = EXCLUDED.price,
        currency = EXCLUDED.currency,
        city = EXCLUDED.city,
        features = EXCLUDED.features,
        images = EXCLUDED.images,
        is_featured = EXCLUDED.is_featured,
        updated_at = EXCLUDED.updated_at
    `;
  }
}

export const vehiclePostgresRepository = new VehiclePostgresRepository();
