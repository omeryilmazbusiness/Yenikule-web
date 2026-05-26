import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/cn";

export type AdminDataTableColumn<T> = {
  key: string;
  header: string;
  cell: (item: T) => ReactNode;
  className?: string;
};

export type AdminDataTableProps<T> = {
  columns: AdminDataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingRows?: number;
  className?: string;
  caption?: string;
};

export function AdminDataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "Kayıt bulunamadı.",
  isLoading = false,
  loadingRows = 5,
  className,
  caption,
}: AdminDataTableProps<T>) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      <Table>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <TableRow key={`loading-${rowIndex}`}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      <Skeleton className="h-5 w-full max-w-[12rem]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}

          {!isLoading && data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : null}

          {!isLoading
            ? data.map((item) => (
                <TableRow key={keyExtractor(item)}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}
