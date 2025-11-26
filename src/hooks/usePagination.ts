import { useState, useCallback, useMemo } from "react";
import type {
  PaginationState,
  PaginationOptions,
  PaginationMeta,
} from "@/interface/pagination";

/**
 * Hook personalizado para manejar la paginación de manera general
 * Compatible con el backend que usa page y limit
 */
export function usePagination(options: PaginationOptions = {}) {
  const {
    initialPage = 1,
    initialLimit = 10,
    limitOptions = [10, 20, 50, 100],
  } = options;

  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const setPage = useCallback((page: number) => {
    setPaginationState((prev) => ({
      ...prev,
      currentPage: page,
      hasPreviousPage: page > 1,
      hasNextPage: page < prev.totalPages,
    }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPaginationState((prev) => ({
      ...prev,
      limit,
      currentPage: 1, // Reset a la primera página al cambiar el límite
      hasPreviousPage: false,
    }));
  }, []);

  const updateFromMeta = useCallback(
    (meta: PaginationMeta | undefined) => {
      if (!meta) {
        console.warn("updateFromMeta called with undefined meta");
        return;
      }
      setPaginationState({
        currentPage: meta.page || 1,
        limit: meta.limit || initialLimit,
        total: meta.total || 0,
        totalPages: meta.totalPages || 0,
        hasNextPage: meta.hasNextPage || false,
        hasPreviousPage: meta.hasPreviousPage || false,
      });
    },
    [initialLimit]
  );

  const nextPage = useCallback(() => {
    setPaginationState((prev) => {
      if (prev.hasNextPage) {
        const newPage = prev.currentPage + 1;
        return {
          ...prev,
          currentPage: newPage,
          hasPreviousPage: true,
          hasNextPage: newPage < prev.totalPages,
        };
      }
      return prev;
    });
  }, []);

  const previousPage = useCallback(() => {
    setPaginationState((prev) => {
      if (prev.hasPreviousPage) {
        const newPage = prev.currentPage - 1;
        return {
          ...prev,
          currentPage: newPage,
          hasPreviousPage: newPage > 1,
          hasNextPage: true,
        };
      }
      return prev;
    });
  }, []);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goToLastPage = useCallback(() => {
    setPaginationState((prev) => ({
      ...prev,
      currentPage: prev.totalPages,
      hasPreviousPage: prev.totalPages > 1,
      hasNextPage: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setPaginationState({
      currentPage: initialPage,
      limit: initialLimit,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  }, [initialPage, initialLimit]);

  const paginationParams = useMemo(
    () => ({
      page: paginationState.currentPage,
      limit: paginationState.limit,
    }),
    [paginationState.currentPage, paginationState.limit]
  );

  return {
    ...paginationState,
    paginationParams,
    limitOptions,
    setPage,
    setLimit,
    updateFromMeta,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    reset,
  };
}
