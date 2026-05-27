import {
  Building2,
  FileText,
  MapPin,
  Palette,
  Phone,
  Share2,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SettingsFormSection = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const SETTINGS_FORM_SECTIONS: SettingsFormSection[] = [
  {
    id: "marka",
    label: "Marka & logo",
    description: "Site adı, kısa ad ve logo.",
    icon: Palette,
  },
  {
    id: "hakkimizda",
    label: "Hakkımızda",
    description: "Metin ve hero görseli.",
    icon: FileText,
  },
  {
    id: "sirket",
    label: "Şirket bilgileri",
    description: "Ticari unvan ve resmi kayıtlar.",
    icon: Building2,
  },
  {
    id: "iletisim",
    label: "İletişim",
    description: "Telefon, WhatsApp ve e-posta.",
    icon: Phone,
  },
  {
    id: "adres",
    label: "Adres",
    description: "Ofis ve harita adresi.",
    icon: MapPin,
  },
  {
    id: "tasarim",
    label: "Ana sayfa videosu",
    description: "Hero arka plan videosu.",
    icon: Video,
  },
  {
    id: "sosyal",
    label: "Sosyal medya",
    description: "Sosyal ağ bağlantıları.",
    icon: Share2,
  },
];
