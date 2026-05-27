import type { ContactRepository } from "@/features/contact/repositories/contact.repository";
import type {
  ContactMessage,
  ContactMessageCreateInput,
  ContactMessageFilters,
  ContactMessageUpdateInput,
  PaginatedContactMessages,
} from "@/features/contact/types/contact.types";
import { mapContactRow } from "@/lib/db/row-mappers";
import { asRows, getSql } from "@/lib/sql";
import { createId } from "@/lib/validations";

function paginateMessages(
  items: ContactMessage[],
  page = 1,
  pageSize = 20,
): PaginatedContactMessages {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export class ContactPostgresRepository implements ContactRepository {
  async findAll(filters: ContactMessageFilters = {}): Promise<PaginatedContactMessages> {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`);
    let result = rows.map((row) => mapContactRow(row as Parameters<typeof mapContactRow>[0]));

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q),
      );
    }

    if (filters.status) {
      result = result.filter((m) => m.status === filters.status);
    }

    return paginateMessages(result, filters.page, filters.pageSize);
  }

  async findById(id: string): Promise<ContactMessage | null> {
    const sql = getSql();
    const rows = asRows(await sql`SELECT * FROM contact_messages WHERE id = ${id} LIMIT 1`);
    if (!rows[0]) return null;
    return mapContactRow(rows[0] as Parameters<typeof mapContactRow>[0]);
  }

  async create(input: ContactMessageCreateInput): Promise<ContactMessage> {
    const id = createId();
    const now = new Date().toISOString();
    const sql = getSql();

    await sql`
      INSERT INTO contact_messages (
        id, name, email, phone, subject, message, status,
        listing_id, project_id, vehicle_id,
        ip_address, user_agent, created_at, updated_at
      ) VALUES (
        ${id}, ${input.name}, ${input.email}, ${input.phone}, ${input.subject}, ${input.message}, 'yeni',
        ${input.listingId ?? null}, ${input.projectId ?? null}, ${input.vehicleId ?? null},
        ${input.ipAddress ?? null}, ${input.userAgent ?? null}, ${now}, ${now}
      )
    `;

    const created = await this.findById(id);
    if (!created) throw new Error("Mesaj kaydedilemedi.");
    return created;
  }

  async update(
    id: string,
    input: ContactMessageUpdateInput,
  ): Promise<ContactMessage | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const status = input.status ?? existing.status;
    const updatedAt = new Date().toISOString();
    const sql = getSql();

    await sql`
      UPDATE contact_messages
      SET status = ${status}, updated_at = ${updatedAt}
      WHERE id = ${id}
    `;

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const sql = getSql();
    const rows = asRows(await sql`DELETE FROM contact_messages WHERE id = ${id} RETURNING id`);
    return rows.length > 0;
  }

  async countUnread(): Promise<number> {
    const sql = getSql();
    const rows = asRows<{ count: number }>(
      await sql`SELECT COUNT(*)::int AS count FROM contact_messages WHERE status = 'yeni'`,
    );
    return Number(rows[0]?.count ?? 0);
  }

  async upsert(message: ContactMessage): Promise<void> {
    const sql = getSql();
    await sql`
      INSERT INTO contact_messages (
        id, name, email, phone, subject, message, status,
        listing_id, project_id, vehicle_id,
        ip_address, user_agent, created_at, updated_at
      ) VALUES (
        ${message.id}, ${message.name}, ${message.email}, ${message.phone}, ${message.subject}, ${message.message}, ${message.status},
        ${message.listingId ?? null}, ${message.projectId ?? null}, ${message.vehicleId ?? null},
        ${message.ipAddress ?? null}, ${message.userAgent ?? null}, ${message.createdAt}, ${message.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        subject = EXCLUDED.subject,
        message = EXCLUDED.message,
        status = EXCLUDED.status,
        listing_id = EXCLUDED.listing_id,
        project_id = EXCLUDED.project_id,
        vehicle_id = EXCLUDED.vehicle_id,
        updated_at = EXCLUDED.updated_at
    `;
  }
}

export const contactPostgresRepository = new ContactPostgresRepository();
