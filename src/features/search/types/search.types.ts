export type SearchEntityType = "listing" | "project" | "vehicle";

export type SearchIndexItem = {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle: string;
  href: string;
  badge: string;
  /** Normalize edilmiş arama metni */
  searchText: string;
  isFeatured?: boolean;
  listingType?: "satilik" | "kiralik" | "devren";
};

export type SearchHit = {
  item: SearchIndexItem;
  score: number;
};

export type GroupedSearchResults = {
  listings: SearchHit[];
  projects: SearchHit[];
  vehicles: SearchHit[];
  total: number;
};
