import type { ReactNode } from "react";

import { Container } from "@/components/common/Container";
import { cn } from "@/lib/cn";

type PageShellProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  eyebrow?: string;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
};

export function PageShell({
  children,
  title,
  description,
  eyebrow,
  className,
  containerClassName,
  fullWidth = false,
}: PageShellProps) {
  const content = (
    <>
      {(title || description) && (
        <header className="mb-8 md:mb-10">
          {eyebrow ? <p className="section-eyebrow mb-3">{eyebrow}</p> : null}
          {title ? (
            <h1 className="font-heading text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          ) : null}
        </header>
      )}
      {children}
    </>
  );

  return (
    <div className={cn("flex-1 py-8 md:py-10 lg:py-12", className)}>
      {fullWidth ? (
        <div className={containerClassName}>{content}</div>
      ) : (
        <Container className={containerClassName}>{content}</Container>
      )}
    </div>
  );
}
