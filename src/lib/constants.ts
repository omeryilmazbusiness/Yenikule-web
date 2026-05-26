import type { ListingCategory, ListingStatus, ListingType } from "@/features/listings/types/listing.types";
import type { ProjectStatus } from "@/features/projects/types/project.types";
import type { VehicleCategory, VehicleStatus } from "@/features/vehicles/types/vehicle.types";

export const LISTING_CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: "konut", label: "Konut" },
  { value: "isyeri", label: "İş Yeri" },
  { value: "arsa", label: "Arsa" },
  { value: "villa", label: "Villa" },
  { value: "proje", label: "Proje" },
];

export const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: "satilik", label: "Satılık" },
  { value: "kiralik", label: "Kiralık" },
  { value: "devren", label: "Devren" },
];

export const LISTING_STATUSES: { value: ListingStatus; label: string }[] = [
  { value: "aktif", label: "Aktif" },
  { value: "rezerve", label: "Rezerve" },
  { value: "satildi", label: "Satıldı" },
  { value: "kiralandi", label: "Kiralandı" },
  { value: "pasif", label: "Pasif" },
];

export const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "planlama", label: "Planlama" },
  { value: "insaat", label: "İnşaat Halinde" },
  { value: "tamamlandi", label: "Tamamlandı" },
  { value: "satista", label: "Satışta" },
];

export const VEHICLE_CATEGORIES: { value: VehicleCategory; label: string }[] = [
  { value: "otomobil", label: "Otomobil" },
  { value: "suv", label: "SUV" },
  { value: "ticari", label: "Ticari Araç" },
  { value: "motosiklet", label: "Motosiklet" },
];

export const VEHICLE_STATUSES: { value: VehicleStatus; label: string }[] = [
  { value: "aktif", label: "Aktif" },
  { value: "rezerve", label: "Rezerve" },
  { value: "satildi", label: "Satıldı" },
  { value: "pasif", label: "Pasif" },
];

export const VEHICLE_FUEL_TYPES = [
  { value: "benzin", label: "Benzin" },
  { value: "dizel", label: "Dizel" },
  { value: "lpg", label: "LPG" },
  { value: "hibrit", label: "Hibrit" },
  { value: "elektrik", label: "Elektrik" },
] as const;

export const VEHICLE_TRANSMISSIONS = [
  { value: "manuel", label: "Manuel" },
  { value: "otomatik", label: "Otomatik" },
] as const;

export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 48,
} as const;

export const SORT_OPTIONS = {
  listings: [
    { value: "newest", label: "En Yeni" },
    { value: "price-asc", label: "Fiyat (Artan)" },
    { value: "price-desc", label: "Fiyat (Azalan)" },
    { value: "area-desc", label: "Metrekare (Büyükten Küçüğe)" },
  ],
  projects: [
    { value: "newest", label: "En Yeni" },
    { value: "name-asc", label: "İsim (A-Z)" },
  ],
  vehicles: [
    { value: "newest", label: "En Yeni" },
    { value: "price-asc", label: "Fiyat (Artan)" },
    { value: "price-desc", label: "Fiyat (Azalan)" },
  ],
} as const;

export const CONTACT_SUBJECTS = [
  "Genel Bilgi",
  "Satış",
  "Kiralama",
  "Proje Bilgisi",
  "Araç Satışı",
  "İnsan Kaynakları",
  "Diğer",
] as const;
