export const routes = {
  home: "/",
  about: "/hakkimizda",
  aboutServices: "/hakkimizda#hizmetler",
  services: "/hizmetler",
  contact: "/iletisim",
  listings: {
    index: "/ilanlar",
    detail: (slug: string) => `/ilanlar/${slug}`,
    create: "/admin/ilanlar/yeni",
    edit: (id: string) => `/admin/ilanlar/${id}/duzenle`,
  },
  projects: {
    index: "/projeler",
    detail: (slug: string) => `/projeler/${slug}`,
    create: "/admin/projeler/yeni",
    edit: (id: string) => `/admin/projeler/${id}/duzenle`,
  },
  vehicles: {
    index: "/araclar",
    detail: (slug: string) => `/araclar/${slug}`,
    create: "/admin/araclar/yeni",
    edit: (id: string) => `/admin/araclar/${id}/duzenle`,
  },
  auth: {
    login: "/admin/login",
    logout: "/cikis",
  },
  admin: {
    dashboard: "/admin",
    listings: "/admin/ilanlar",
    projects: "/admin/projeler",
    vehicles: "/admin/araclar",
    media: "/admin/medya",
    messages: "/admin/mesajlar",
    settings: "/admin/ayarlar",
  },
  legal: {
    privacy: "/gizlilik-politikasi",
    terms: "/kullanim-kosullari",
    kvkk: "/kvkk",
  },
} as const;

export type Routes = typeof routes;
