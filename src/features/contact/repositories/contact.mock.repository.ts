import { mockContactMessages } from "@/features/contact/data/contact.mock";
import type { ContactRepository } from "@/features/contact/repositories/contact.repository";
import type {
  ContactMessage,
  ContactMessageCreateInput,
  ContactMessageFilters,
  ContactMessageUpdateInput,
  PaginatedContactMessages,
} from "@/features/contact/types/contact.types";
import { createId } from "@/lib/validations";

const globalStore = globalThis as typeof globalThis & {
  __contactStore?: ContactMessage[];
};

function getStore(): ContactMessage[] {
  if (!globalStore.__contactStore) {
    globalStore.__contactStore = structuredClone(mockContactMessages);
  }
  return globalStore.__contactStore;
}

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

export class ContactMockRepository implements ContactRepository {
  async findAll(filters: ContactMessageFilters = {}): Promise<PaginatedContactMessages> {
    let result = [...getStore()];

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

    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return paginateMessages(result, filters.page, filters.pageSize);
  }

  async findById(id: string): Promise<ContactMessage | null> {
    return getStore().find((m) => m.id === id) ?? null;
  }

  async create(input: ContactMessageCreateInput): Promise<ContactMessage> {
    const now = new Date().toISOString();
    const message: ContactMessage = {
      ...input,
      id: createId(),
      status: "yeni",
      createdAt: now,
      updatedAt: now,
    };

    getStore().unshift(message);
    return message;
  }

  async update(
    id: string,
    input: ContactMessageUpdateInput,
  ): Promise<ContactMessage | null> {
    const store = getStore();
    const index = store.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const updated: ContactMessage = {
      ...store[index]!,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    store[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const store = getStore();
    const index = store.findIndex((m) => m.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  }

  async countUnread(): Promise<number> {
    return getStore().filter((m) => m.status === "yeni").length;
  }
}

export const contactMockRepository = new ContactMockRepository();
