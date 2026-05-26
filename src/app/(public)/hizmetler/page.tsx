import { redirect } from "next/navigation";

import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Hizmetlerimiz",
  description:
    "Konut projeleri, inşaat taahhüt, satış-kiralama, yatırım danışmanlığı ve satış sonrası hizmetler.",
  path: routes.services,
});

export default function ServicesPage() {
  redirect(`${routes.about}#hizmetler`);
}
