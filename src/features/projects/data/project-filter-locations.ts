import { mockProjects } from "@/features/projects/data/projects.mock";

function buildLocationOptions() {
  const districtsByCity = new Map<string, Set<string>>();

  for (const project of mockProjects) {
    if (!districtsByCity.has(project.city)) {
      districtsByCity.set(project.city, new Set());
    }
    districtsByCity.get(project.city)!.add(project.district);
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

export const PROJECT_FILTER_CITIES = built.cities;
export const PROJECT_FILTER_DISTRICTS_BY_CITY = built.districtsByCity;
