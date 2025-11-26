import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  accessor?: (item: T) => any;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  totalPages: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limitOptions?: number[];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  getRowKey?: (item: T, index: number) => string | number;
}

export function DataTable<T = any>({
  data,
  columns,
  currentPage,
  totalPages,
  limit,
  total,
  hasNextPage,
  hasPreviousPage,
  limitOptions,
  onPageChange,
  onLimitChange,
  emptyMessage = "No hay datos disponibles",
  isLoading = false,
  getRowKey,
}: DataTableProps<T>) {
  const defaultGetRowKey = (item: any, index: number) => {
    return item.id ?? item.personId ?? index;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Cargando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow
                  key={
                    getRowKey
                      ? getRowKey(item, index)
                      : defaultGetRowKey(item, index)
                  }
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item)
                        : column.accessor
                        ? column.accessor(item)
                        : (item as any)[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          limit={limit}
          total={total}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          limitOptions={limitOptions}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}
