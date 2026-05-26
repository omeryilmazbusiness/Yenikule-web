"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { sanitizeImageUrl } from "@/lib/images";

export type ImageUploaderProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  className?: string;
  folder?: "listings" | "projects" | "vehicles" | "general";
};

export function ImageUploader({
  value,
  onChange,
  maxFiles = 12,
  accept = "image/*",
  disabled = false,
  className,
  folder = "general",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const blobUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const blobUrls = blobUrlsRef.current;
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
      blobUrls.clear();
    };
  }, []);

  const addPreview = useCallback((url: string, blobUrl: string) => {
    blobUrlsRef.current.add(blobUrl);
    setPreviews((current) => ({ ...current, [url]: blobUrl }));
  }, []);

  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const payload = (await response.json()) as {
        success?: boolean;
        files?: { url: string }[];
        error?: string;
      };

      if (!response.ok || !payload.files?.[0]?.url) {
        throw new Error(payload.error ?? "Görsel yüklenemedi.");
      }

      return sanitizeImageUrl(payload.files[0].url);
    },
    [folder],
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || disabled) return;

      const remaining = maxFiles - value.length;
      if (remaining <= 0) return;

      const selected = Array.from(files).slice(0, remaining);
      setIsUploading(true);

      try {
        const uploaded: string[] = [];

        for (const file of selected) {
          const blobUrl = URL.createObjectURL(file);
          const serverUrl = await uploadFile(file);
          addPreview(serverUrl, blobUrl);
          uploaded.push(serverUrl);
        }

        onChange([...value, ...uploaded]);
        toast.success(
          uploaded.length === 1
            ? "Görsel yüklendi."
            : `${uploaded.length} görsel yüklendi.`,
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Görsel yüklenemedi.";
        toast.error(message);
      } finally {
        setIsUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [addPreview, disabled, maxFiles, onChange, uploadFile, value],
  );

  const removeImage = (url: string) => {
    const blobUrl = previews[url];
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      blobUrlsRef.current.delete(blobUrl);
    }

    setPreviews((current) => {
      const next = { ...current };
      delete next[url];
      return next;
    });

    onChange(value.filter((item) => item !== url));
  };

  const canAddMore = value.length < maxFiles;

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors",
          canAddMore && !disabled && "hover:border-primary/40 hover:bg-muted/50",
          (!canAddMore || disabled) && "opacity-60",
        )}
      >
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          {isUploading ? (
            <Loader2 className="size-6 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="size-6" aria-hidden />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Görselleri sürükleyin veya seçin
          </p>
          <p className="text-xs text-muted-foreground">
            En fazla {maxFiles} görsel · Mock depolama (sunucu belleği)
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || !canAddMore || isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Yükleniyor…" : "Görsel Seç"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="sr-only"
          disabled={disabled || !canAddMore || isUploading}
          onChange={(event) => void handleFiles(event.target.files)}
        />
      </div>

      {value.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url) => {
            const safeUrl = sanitizeImageUrl(url);
            return (
              <li
                key={url}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previews[url] ?? previews[safeUrl] ?? safeUrl}
                  alt="Yüklenen görsel önizlemesi"
                  className="size-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 size-8 opacity-0 transition-opacity group-hover:opacity-100"
                  disabled={disabled}
                  onClick={() => removeImage(url)}
                  aria-label="Görseli kaldır"
                >
                  <X className="size-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
