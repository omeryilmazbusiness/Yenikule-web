import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/cn";
import {
  isBlobOrDataUrl,
  isNextImageOptimizable,
  sanitizeImageUrl,
} from "@/lib/images";

type AspectRatio = "16/9" | "4/3" | "3/2" | "1/1" | "21/9";

const aspectRatioClasses: Record<AspectRatio, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
};

type OptimizedImageProps = Omit<ImageProps, "fill" | "src"> & {
  src: string;
  aspectRatio?: AspectRatio;
  wrapperClassName?: string;
  rounded?: boolean;
  fallbackSrc?: string;
  /** Fill parent container (e.g. gallery slide) instead of enforcing aspect ratio */
  fillParent?: boolean;
};

export function OptimizedImage({
  src,
  alt,
  className,
  wrapperClassName,
  aspectRatio = "16/9",
  rounded = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fallbackSrc,
  priority,
  fillParent = false,
  ...props
}: OptimizedImageProps) {
  const resolvedSrc = sanitizeImageUrl(src, fallbackSrc);
  const isSvg = resolvedSrc.toLowerCase().endsWith(".svg");
  const useNativeImg =
    isBlobOrDataUrl(resolvedSrc) || !isNextImageOptimizable(resolvedSrc);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        !fillParent && aspectRatioClasses[aspectRatio],
        fillParent && "absolute inset-0 size-full",
        rounded && !fillParent && "rounded-xl",
        wrapperClassName,
      )}
    >
      {useNativeImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={alt}
          className={cn("absolute inset-0 size-full object-cover", className)}
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={isSvg}
          className={cn("object-cover", className)}
          {...props}
        />
      )}
    </div>
  );
}
