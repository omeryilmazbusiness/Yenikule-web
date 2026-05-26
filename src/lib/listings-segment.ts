export type ListingsSegment = "konut" | "arac";

export const LISTINGS_SEGMENTS: {
  value: ListingsSegment;
  label: string;
}[] = [
  { value: "konut", label: "Konut" },
  { value: "arac", label: "Araç" },
];

export function parseListingsSegment(
  params: URLSearchParams,
): ListingsSegment {
  return params.get("segment") === "arac" ? "arac" : "konut";
}

export function parseListingsSegmentFromPageSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ListingsSegment {
  const value = raw.segment;
  const segment = typeof value === "string" ? value : value?.[0];
  return segment === "arac" ? "arac" : "konut";
}

export function appendListingsSegmentToParams(
  params: URLSearchParams,
  segment: ListingsSegment,
): void {
  if (segment === "arac") {
    params.set("segment", "arac");
  } else {
    params.delete("segment");
  }
}
