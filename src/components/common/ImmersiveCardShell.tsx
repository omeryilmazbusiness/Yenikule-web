import Link from "next/link";
import type { ReactNode } from "react";

import { OptimizedImage } from "@/components/common/OptimizedImage";
import { cn } from "@/lib/cn";

type ImmersiveCardShellProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  fallbackSrc?: string;
  sizes?: string;
  eyebrow?: ReactNode;
  title: string;
  badges?: ReactNode;
  topEndOverlay?: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: "default" | "featured";
};

export function ImmersiveCardShell({
  href,
  imageSrc,
  imageAlt,
  fallbackSrc,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  eyebrow,
  title,
  badges,
  topEndOverlay,
  meta,
  description,
  footer,
  className,
  size = "default",
}: ImmersiveCardShellProps) {
  return (
    <article
      className={cn(
        "immersive-card group",
        size === "featured" && "immersive-card-featured",
        className,
      )}
    >
      <div className="immersive-card-inner">
        <div className="immersive-card-media" aria-hidden>
          <OptimizedImage
            src={imageSrc}
            alt={imageAlt}
            fillParent
            rounded={false}
            sizes={sizes}
            fallbackSrc={fallbackSrc}
            className="immersive-card-image"
          />
        </div>

        <div className="immersive-card-shade-top" aria-hidden />

        {badges ? (
          <div className="immersive-card-badges">{badges}</div>
        ) : null}

        {topEndOverlay ? (
          <div className="immersive-card-top-end">{topEndOverlay}</div>
        ) : null}

        <Link href={href} className="immersive-card-overlay-link">
          <span className="sr-only">{title}</span>
        </Link>

        <div className="immersive-card-body">
          <div className="immersive-card-panel">
            <div className="immersive-card-content">
              {eyebrow ? (
                <p className="immersive-card-eyebrow">{eyebrow}</p>
              ) : null}
              <h3 className="immersive-card-title">{title}</h3>
              {meta ? <div className="immersive-card-meta">{meta}</div> : null}
              {description ? (
                <div className="immersive-card-description">{description}</div>
              ) : null}
            </div>

            {footer ? (
              <div className="immersive-card-footer">{footer}</div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
