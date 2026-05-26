import { Container } from "@/components/common/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="py-16">
      <Skeleton className="mb-4 h-3 w-24 rounded-full" />
      <Skeleton className="mb-8 h-10 w-2/3 max-w-md rounded-xl" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-2xl" />
        ))}
      </div>
    </Container>
  );
}
