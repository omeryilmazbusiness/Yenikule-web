import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Car,
  Hammer,
  Handshake,
  KeyRound,
  LineChart,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wrench,
} from "lucide-react";

export type AboutValue = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type AboutService = {
  icon: LucideIcon;
  title: string;
  description: string;
  tag?: string;
};

export const aboutStats = [
  { value: "15+", label: "Yıllık Deneyim" },
  { value: "50+", label: "Tamamlanan Proje" },
  { value: "100%", label: "Şeffaf Süreç" },
] as const;

export const aboutPillars = [
  {
    icon: Target,
    title: "Doğru Planlama",
    text: "Her projede ihtiyaç analizi, bütçe uyumu ve uzun vadeli değer hedefiyle ilerliyoruz.",
  },
  {
    icon: Sparkles,
    title: "Modern Mimari",
    text: "Enerji verimli yapılar, güncel malzeme seçimi ve yaşam kalitesi odaklı tasarım.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenilir Teslim",
    text: "Sözleşmeden anahtar teslime kadar yazılı taahhütler ve düzenli saha raporlaması.",
  },
] as const;

export const aboutValues: AboutValue[] = [
  {
    icon: Shield,
    title: "Güven ve Şeffaflık",
    description:
      "Sözleşmeden teslimata kadar tüm süreçlerde açık iletişim ve yazılı taahhütlerle ilerliyoruz.",
  },
  {
    icon: Building2,
    title: "Kaliteli İşçilik",
    description:
      "Malzeme seçiminden uygulama detaylarına kadar ulusal standartlara uygun üretim yapıyoruz.",
  },
  {
    icon: Users,
    title: "Müşteri Odaklılık",
    description:
      "Her projede yatırımcı ve alıcı beklentilerini dinleyerek uzun vadeli memnuniyet hedefliyoruz.",
  },
  {
    icon: Handshake,
    title: "Sürdürülebilir Ortaklık",
    description:
      "Tedarikçiler, yatırımcılar ve yerel paydaşlarla güvene dayalı iş birlikleri kuruyoruz.",
  },
];

export const aboutServices: AboutService[] = [
  {
    icon: Building2,
    title: "Konut Projeleri",
    description:
      "Modern planlama, enerji verimli yapılar ve yaşam kalitesi odaklı konut çözümleri.",
    tag: "Proje",
  },
  {
    icon: Hammer,
    title: "İnşaat & Taahhüt",
    description:
      "Anahtar teslim projelerde zamanında teslim ve yüksek işçilik standartları.",
    tag: "Taahhüt",
  },
  {
    icon: KeyRound,
    title: "Satış & Kiralama",
    description:
      "Portföy yönetimi, değerleme ve müşteriye özel gayrimenkul danışmanlığı.",
    tag: "Gayrimenkul",
  },
  {
    icon: LineChart,
    title: "Yatırım Danışmanlığı",
    description:
      "Bölgesel analiz ve getiri odaklı yatırım fırsatlarıyla doğru karar desteği.",
    tag: "Danışmanlık",
  },
  {
    icon: ShieldCheck,
    title: "Hukuki & Tapu Desteği",
    description:
      "Sözleşme, tapu ve resmi süreçlerde şeffaf ve güvenilir rehberlik.",
    tag: "Destek",
  },
  {
    icon: Wrench,
    title: "Satış Sonrası Hizmet",
    description:
      "Teslim sonrası teknik destek ve müşteri memnuniyeti odaklı takip.",
    tag: "Destek",
  },
  {
    icon: Car,
    title: "Araç Satış & Takas",
    description:
      "Kurumsal ve bireysel araç portföyünde güvenilir alım-satım ve takas desteği.",
    tag: "Araç",
  },
];
