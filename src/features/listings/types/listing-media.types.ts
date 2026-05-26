export type ListingMediaType = "image" | "video";

export type ListingMedia = {
  id: string;
  type: ListingMediaType;
  url: string;
  isPrimary: boolean;
};
