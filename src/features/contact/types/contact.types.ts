export type ContactMessageStatus = "yeni" | "okundu" | "yanitlandi" | "arsiv";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  listingId?: string;
  projectId?: string;
  vehicleId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactMessageCreateInput = Omit<
  ContactMessage,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export type ContactMessageUpdateInput = Partial<
  Pick<ContactMessage, "status">
>;

export type ContactMessageFilters = {
  search?: string;
  status?: ContactMessageStatus;
  page?: number;
  pageSize?: number;
};

export type PaginatedContactMessages = {
  items: ContactMessage[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
