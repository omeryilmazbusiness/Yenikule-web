import Link from "next/link";
import {
  ArrowRight,
  Car,
  Home,
  Key,
  Landmark,
  Store,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { routes } from "@/lib/routes";
import type { ListingCategory, ListingType } from "@/features/listings/types/listing.types";
import { cn } from "@/lib/cn";

type CategoryItem = {
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

function buildListingsHref(params: {
  category?: ListingCategory;
  type?: ListingType;
}): string {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.type) search.set("type", params.type);
  const query = search.toString();
  return query ? `${routes.listings.index}?${query}` : routes.listings.index;
}

const categories: CategoryItem[] = [
  {
    label: "Satılık Daireler",
    description: "Konut ve rezidans satışları",
    icon: Home,
    href: buildListingsHref({ category: "konut", type: "satilik" }),
  },
  {
    label: "Kiralık Daireler",
    description: "Uzun ve kısa dönem kiralık",
    icon: Key,
    href: buildListingsHref({ category: "konut", type: "kiralik" }),
  },
  {
    label: "Satılık Dükkanlar",
    description: "Ticari satış fırsatları",
    icon: Store,
    href: buildListingsHref({ category: "isyeri", type: "satilik" }),
  },
  {
    label: "Kiralık Dükkanlar",
    description: "Ofis ve dükkan kiralama",
    icon: Store,
    href: buildListingsHref({ category: "isyeri", type: "kiralik" }),
  },
  {
    label: "Villalar",
    description: "Müstakil ve lüks yaşam",
    icon: Landmark,
    href: buildListingsHref({ category: "villa" }),
  },
  {
    label: "Araçlar",
    description: "Araç ve ekipman portföyü",
    icon: Car,
    href: routes.vehicles.index,
  },
];

export function HomeCategoryShowcase() {
  return (
    <Section background="muted" className="home-section">
      <Container>
        <SectionHeading
          eyebrow="Kategoriler"
          title="İhtiyacınıza Uygun Portföyü Keşfedin"
          subtitle="Satılık, kiralık, villa ve ticari alanlara tek tıkla ulaşın."
          align="center"
        />

        <ul className="home-category-rail lg:grid lg:grid-cols-3 lg:gap-6">
          {categories.map((category) => (
            <li key={category.label}>
              <Link
                href={category.href}
                className={cn(
                  "soft-card soft-card-lift group flex h-full min-h-[10rem] flex-col p-5 sm:min-h-[11rem] sm:p-6",
                  "touch-manipulation",
                )}
              >
                <div className="soft-card-icon mb-5">
                  <category.icon className="size-5" aria-hidden />
                </div>
                <h3 className="font-heading text-base font-medium text-foreground transition-premium group-hover:text-bronze sm:text-lg">
                  {category.label}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-bronze transition-premium">
                  İncele
                  <ArrowRight className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
