import Link from "next/link";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Sayfa Bulunamadı",
  description: "Aradığınız sayfa bulunamadı.",
  path: "/404",
  noIndex: true,
});

export default function NotFoundPage() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-foreground">Sayfa bulunamadı</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
      </p>
      <Button className="mt-8" asChild>
        <Link href={routes.home}>Ana Sayfaya Dön</Link>
      </Button>
    </Container>
  );
}
