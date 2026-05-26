import type {
  ContactMessage,
  ContactMessageCreateInput,
  ContactMessageFilters,
  ContactMessageUpdateInput,
  PaginatedContactMessages,
} from "@/features/contact/types/contact.types";

export interface ContactRepository {
  findAll(filters?: ContactMessageFilters): Promise<PaginatedContactMessages>;
  findById(id: string): Promise<ContactMessage | null>;
  create(input: ContactMessageCreateInput): Promise<ContactMessage>;
  update(
    id: string,
    input: ContactMessageUpdateInput,
  ): Promise<ContactMessage | null>;
  delete(id: string): Promise<boolean>;
  countUnread(): Promise<number>;
}
