export type VehicleCategory = "otomobil" | "suv" | "ticari" | "motosiklet";

export type VehicleStatus = "aktif" | "rezerve" | "satildi" | "pasif";

export type VehicleFuelType =
  | "benzin"
  | "dizel"
  | "lpg"
  | "hibrit"
  | "elektrik";

export type VehicleTransmission = "manuel" | "otomatik";

export type VehicleCondition = {
  accidentFree: boolean;
  paintFree: boolean;
};

export type Vehicle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category: VehicleCategory;
  status: VehicleStatus;
  brand: string;
  model: string;
  /** Donanım / paket adı (ör. M Sport) */
  trim?: string;
  condition?: VehicleCondition;
  year: number;
  mileage: number;
  fuelType: VehicleFuelType;
  transmission: VehicleTransmission;
  engineSize?: string;
  color: string;
  price: number;
  currency: string;
  city: string;
  features: string[];
  images: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type VehicleFilters = {
  search?: string;
  category?: VehicleCategory;
  status?: VehicleStatus;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  fuelType?: VehicleFuelType;
  transmission?: VehicleTransmission;
  isFeatured?: boolean;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "price-asc" | "price-desc";
};

export type VehicleCreateInput = Omit<
  Vehicle,
  "id" | "slug" | "createdAt" | "updatedAt"
> & { slug?: string };

export type VehicleUpdateInput = Partial<VehicleCreateInput>;

export type PaginatedVehicles = {
  items: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
