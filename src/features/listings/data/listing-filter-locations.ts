import { mockListings } from "@/features/listings/data/listings.mock";

function buildLocationOptions() {
  const districtsByCity = new Map<string, Set<string>>();

  for (const listing of mockListings) {
    if (!districtsByCity.has(listing.city)) {
      districtsByCity.set(listing.city, new Set());
    }
    districtsByCity.get(listing.city)!.add(listing.district);
  }

  const cities = [...districtsByCity.keys()].sort((a, b) =>
    a.localeCompare(b, "tr"),
  );

  const districts: Record<string, string[]> = {};
  for (const [city, set] of districtsByCity) {
    districts[city] = [...set].sort((a, b) => a.localeCompare(b, "tr"));
  }

  return { cities, districtsByCity: districts };
}

const built = buildLocationOptions();

export const LISTING_FILTER_CITIES = built.cities;
export const LISTING_FILTER_DISTRICTS_BY_CITY = built.districtsByCity;

export const LISTING_ROOM_PRESETS = ["1+1", "2+1", "3+1", "4+1"] as const;
