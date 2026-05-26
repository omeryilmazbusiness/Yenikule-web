export type SiteAddress = {
  street: string;
  district: string;
  city: string;
  postalCode: string;
  country: string;
  full: string;
};

export type SiteSocialLinks = {
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
};

export type SiteCompanyInfo = {
  legalName: string;
  taxOffice: string;
  taxNumber: string;
  mersis: string;
};

export type SiteSettings = {
  name: string;
  shortName: string;
  description: string;
  about: string;
  logoUrl?: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  address: SiteAddress;
  workingHours: string;
  socialLinks: SiteSocialLinks;
  company: SiteCompanyInfo;
  updatedAt: string;
};
