export type SearchAnalyticsEvent = {
  term: string;
  searchedAt: string;
};

export type SearchAnalyticsStore = {
  events: SearchAnalyticsEvent[];
};
