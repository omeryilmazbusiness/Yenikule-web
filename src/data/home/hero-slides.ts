export type HeroSlideType = "video" | "image";

export type HeroSlide = {
  id: string;
  type: HeroSlideType;
  src: string;
  poster: string;
  title: string;
  subtitle: string;
  label: string;
};

/** Slider geçiş süresi (ms) */
export const HERO_SLIDE_INTERVAL_MS = 7000;

/**
 * Hero slider içerikleri — video/görsel dosyalarını public/ altına ekleyin.
 * Eksik dosyalarda poster ve gradient fallback devreye girer.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "villa-life",
    type: "video",
    src: "/videos/villa-life.mp4",
    poster: "/images/hero/villa-poster.jpg",
    title: "Villa Yaşamı",
    subtitle: "Bahçe, ferahlık ve özel yaşam alanları",
    label: "Villa & Konut",
  },
  {
    id: "modern-residence",
    type: "video",
    src: "/videos/modern-residence.mp4",
    poster: "/images/hero/residence-poster.jpg",
    title: "Modern Residence",
    subtitle: "Şehir içinde premium konut deneyimi",
    label: "Residence",
  },
  {
    id: "family-housing",
    type: "video",
    src: "/videos/family-housing.mp4",
    poster: "/images/hero/housing-poster.jpg",
    title: "Aile Konutları",
    subtitle: "Güvenli site, sosyal alanlar ve kaliteli malzeme",
    label: "Yaşam Alanı",
  },
  {
    id: "urban-living",
    type: "image",
    src: "/images/hero/urban-living.jpg",
    poster: "/images/placeholders/listing.svg",
    title: "Kentsel Yaşam",
    subtitle: "Doğru lokasyonda sürdürülebilir değer",
    label: "Yatırım",
  },
];

export const HERO_POSTER_FALLBACK = "/images/placeholders/hero-poster.svg";
