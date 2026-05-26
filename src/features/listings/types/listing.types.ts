import type { ListingMedia } from "@/features/listings/types/listing-media.types";

export type ListingCategory =
  | "konut"
  | "isyeri"
  | "arsa"
  | "villa"
  | "proje";

export type ListingType = "satilik" | "kiralik" | "devren";

export type ListingStatus =
  | "aktif"
  | "rezerve"
  | "satildi"
  | "kiralandi"
  | "pasif";

export type Listing = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category: ListingCategory;
  type: ListingType;
  status: ListingStatus;
  price: number;
  currency: string;
  area: number;
  rooms?: string;
  floor?: number;
  totalFloors?: number;
  buildingAge?: number;
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  latitude?: number;
  longitude?: number;
  features: string[];
  /** @deprecated images — media kullanın; geriye dönük uyumluluk için doldurulur */
  images: string[];
  media?: ListingMedia[];
  isFeatured: boolean;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
};

export type ListingFilters = {
  search?: string;
  category?: ListingCategory;
  type?: ListingType;
  status?: ListingStatus;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: string;
  isFeatured?: boolean;
  projectId?: string;
  includeAllStatuses?: boolean;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "area-desc";
};

export type ListingCreateInput = Omit<
  Listing,
  "id" | "slug" | "createdAt" | "updatedAt"
> & { slug?: string };

export type ListingUpdateInput = Partial<ListingCreateInput>;

export type PaginatedListings = {
  items: Listing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
