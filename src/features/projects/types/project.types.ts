export type ProjectStatus = "planlama" | "insaat" | "tamamlandi" | "satista";

export type Project = {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  status: ProjectStatus;
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  totalUnits: number;
  availableUnits: number;
  startYear: number;
  deliveryYear?: number;
  features: string[];
  amenities: string[];
  images: string[];
  coverImage: string;
  brochureUrl?: string;
  isFeatured: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectFilters = {
  search?: string;
  status?: ProjectStatus;
  city?: string;
  district?: string;
  isFeatured?: boolean;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "name-asc";
};

export type ProjectCreateInput = Omit<
  Project,
  "id" | "slug" | "createdAt" | "updatedAt" | "coverImage"
> & {
  slug?: string;
  coverImage?: string;
};

export type ProjectUpdateInput = Partial<ProjectCreateInput>;

export type PaginatedProjects = {
  items: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
