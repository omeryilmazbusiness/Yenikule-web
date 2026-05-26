import { Skeleton } from "@/components/ui/skeleton";

export function ContactFormFallback() {
  return (
    <div className="contact-page-form space-y-5" aria-busy="true" aria-label="Form yükleniyor">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-md" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="min-h-[9rem] w-full" />
      <Skeleton className="h-12 w-40 rounded-full" />
    </div>
  );
}
