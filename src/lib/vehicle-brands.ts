/** Marka adını logo dosyası anahtarına çevirir */
export function normalizeVehicleBrandKey(brand: string): string {
  const value = brand
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (value.includes("mercedes")) return "mercedes";
  if (value === "bmw" || value.startsWith("bmw ")) return "bmw";
  if (value === "ford" || value.startsWith("ford ")) return "ford";
  if (value === "tesla" || value.startsWith("tesla ")) return "tesla";
  if (value.includes("volkswagen") || value === "vw") return "volkswagen";
  if (value.includes("audi")) return "audi";
  if (value.includes("renault")) return "renault";
  if (value.includes("toyota")) return "toyota";
  if (value.includes("honda")) return "honda";
  if (value.includes("hyundai")) return "hyundai";
  if (value.includes("fiat")) return "fiat";
  if (value.includes("peugeot")) return "peugeot";
  if (value.includes("opel")) return "opel";
  if (value.includes("nissan")) return "nissan";
  if (value.includes("kia")) return "kia";
  if (value.includes("volvo")) return "volvo";
  if (value.includes("porsche")) return "porsche";
  if (value.includes("land rover") || value.includes("range rover")) return "land-rover";

  return "default";
}

const BRAND_LOGO_PATHS: Record<string, string> = {
  audi: "/images/brands/audi.png",
  bmw: "/images/brands/bmw.png",
  ford: "/images/brands/ford.svg",
  mercedes: "/images/brands/mercedes.png",
  tesla: "/images/brands/tesla.svg",
  volkswagen: "/images/brands/volkswagen.png",
  default: "/images/brands/default.svg",
};

export function getVehicleBrandLogoSrc(brand: string): string {
  const key = normalizeVehicleBrandKey(brand);
  return BRAND_LOGO_PATHS[key] ?? BRAND_LOGO_PATHS.default!;
}

export function hasVehicleBrandLogo(brand: string): boolean {
  return normalizeVehicleBrandKey(brand) !== "default";
}

export function getVehicleBrandInitial(brand: string): string {
  const trimmed = brand.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toLocaleUpperCase("tr-TR");
}
