import { useState, useCallback, useMemo } from "react";
import type { FilterParams, FilterCondition } from "@/lib/filters";
import type { SortOrder } from "@/lib/filters";

/**
 * Hook personalizado para manejar filtros en componentes
 * Facilita la gestión del estado de filtros, búsqueda y ordenamiento
 */
export function useFilters(initialParams?: Partial<FilterParams>) {
  const [filters, setFilters] = useState<FilterCondition[]>(
    initialParams?.filters || []
  );
  const [search, setSearch] = useState<string>(initialParams?.search || "");
  const [sortBy, setSortBy] = useState<string | undefined>(
    initialParams?.sortBy
  );
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(
    initialParams?.sortOrder
  );
  const [page, setPage] = useState<number>(initialParams?.page || 1);
  const [limit, setLimit] = useState<number>(initialParams?.limit || 10);

  /**
   * Agrega un nuevo filtro
   */
  const addFilter = useCallback((filter: FilterCondition) => {
    setFilters((prev) => [...prev, filter]);
    setPage(1); // Reset a la primera página
  }, []);

  /**
   * Remueve un filtro por campo
   */
  const removeFilter = useCallback((field: string) => {
    setFilters((prev) => prev.filter((f) => f.field !== field));
    setPage(1);
  }, []);

  /**
   * Actualiza un filtro existente
   */
  const updateFilter = useCallback((filter: FilterCondition) => {
    setFilters((prev) => {
      const index = prev.findIndex((f) => f.field === filter.field);
      if (index >= 0) {
        const newFilters = [...prev];
        newFilters[index] = filter;
        return newFilters;
      }
      return [...prev, filter];
    });
    setPage(1);
  }, []);

  /**
   * Limpia todos los filtros
   */
  const clearFilters = useCallback(() => {
    setFilters([]);
    setPage(1);
  }, []);

  /**
   * Actualiza la búsqueda
   */
  const updateSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  }, []);

  /**
   * Limpia la búsqueda
   */
  const clearSearch = useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  /**
   * Actualiza el ordenamiento
   */
  const updateSort = useCallback((field: string, order: SortOrder) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  }, []);

  /**
   * Limpia el ordenamiento
   */
  const clearSort = useCallback(() => {
    setSortBy(undefined);
    setSortOrder(undefined);
  }, []);

  /**
   * Actualiza la página
   */
  const updatePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  /**
   * Actualiza el límite de resultados
   */
  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset a la primera página
  }, []);

  /**
   * Resetea todos los filtros y parámetros
   */
  const reset = useCallback(() => {
    setFilters([]);
    setSearch("");
    setSortBy(undefined);
    setSortOrder(undefined);
    setPage(1);
    setLimit(10);
  }, []);

  /**
   * Parámetros de filtro actuales
   */
  const filterParams = useMemo<FilterParams>(
    () => ({
      filters: filters.length > 0 ? filters : undefined,
      search: search || undefined,
      sortBy,
      sortOrder,
      page,
      limit,
    }),
    [filters, search, sortBy, sortOrder, page, limit]
  );

  /**
   * Indica si hay filtros activos
   */
  const hasActiveFilters = useMemo(
    () => filters.length > 0 || search.length > 0,
    [filters, search]
  );

  return {
    // Estado
    filters,
    search,
    sortBy,
    sortOrder,
    page,
    limit,
    filterParams,
    hasActiveFilters,

    // Acciones
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    updateSearch,
    clearSearch,
    updateSort,
    clearSort,
    updatePage,
    updateLimit,
    reset,
  };
}
