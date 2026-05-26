"use client";

import { useEffect } from "react";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Bir hata oluştu</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Sayfa yüklenirken beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin veya ana
        sayfaya dönün.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={reset}>
          Tekrar Dene
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href={routes.home}>Ana Sayfa</a>
        </Button>
      </div>
    </Container>
  );
}
