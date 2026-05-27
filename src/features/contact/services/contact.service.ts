import { contactFormSchema } from "@/features/contact/schemas/contact.schema";
import { contactMockRepository } from "@/features/contact/repositories/contact.mock.repository";
import { contactPostgresRepository } from "@/features/contact/repositories/contact.postgres.repository";
import type { ContactRepository } from "@/features/contact/repositories/contact.repository";
import type {
  ContactMessage,
  ContactMessageCreateInput,
  ContactMessageFilters,
  ContactMessageUpdateInput,
  PaginatedContactMessages,
} from "@/features/contact/types/contact.types";
import { isMockMode } from "@/lib/env";

function getRepository(): ContactRepository {
  if (isMockMode()) {
    return contactMockRepository;
  }
  return contactPostgresRepository;
}

export const contactService = {
  async getAll(
    filters?: ContactMessageFilters,
  ): Promise<PaginatedContactMessages> {
    return getRepository().findAll(filters);
  },

  async getById(id: string): Promise<ContactMessage | null> {
    return getRepository().findById(id);
  },

  async submit(raw: unknown): Promise<ContactMessage | null> {
    const parsed = contactFormSchema.parse(raw);

    if (parsed.hp?.trim()) {
      return null;
    }

    const input: ContactMessageCreateInput = {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      subject: parsed.subject,
      message: parsed.message,
      listingId: parsed.listingId,
      projectId: parsed.projectId,
      vehicleId: parsed.vehicleId,
    };
    return getRepository().create(input);
  },

  async updateStatus(
    id: string,
    input: ContactMessageUpdateInput,
  ): Promise<ContactMessage | null> {
    return getRepository().update(id, input);
  },

  async remove(id: string): Promise<boolean> {
    return getRepository().delete(id);
  },

  async getUnreadCount(): Promise<number> {
    return getRepository().countUnread();
  },
};
