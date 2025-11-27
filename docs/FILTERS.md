# Sistema de Filtros Genérico

Sistema reutilizable para filtros, búsqueda, ordenamiento y paginación en consultas API.

## 🚀 Implementación Rápida

### 1. Crear Configuración de Filtros

```typescript
// src/lib/filters/configs/entity-filter.config.ts
import { BaseFilterConfig } from "../config/base-filter.config";

export class EntityFilterConfig extends BaseFilterConfig {
  constructor() {
    super();
    this.allowedFields = ["id", "name", "status"];
    this.allowedSortFields = ["name", "createdAt"];
    this.searchableFields = ["name", "description"];
    this.defaultSortField = "createdAt";
    this.defaultSortOrder = "DESC";
  }
}
```

### 2. Actualizar Servicio

```typescript
import {
  QueryStringBuilder,
  EntityFilterConfig,
  type FilterParams,
} from "@/lib/filters";

const filterConfig = new EntityFilterConfig();

export const entityService = {
  async findAll(filterParams: FilterParams) {
    const queryString = QueryStringBuilder.fromFilterParams(
      filterParams,
      filterConfig
    );
    return await apiClient.get(`/entities?${queryString}`);
  },
};
```

### 3. Usar en Componente

```typescript
import { useFilters } from "@/hooks/useFilters";
import { FilterUtils } from "@/lib/filters";

function EntityList() {
  const { filterParams, addFilter, updateSearch } = useFilters({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    entityService.findAll(filterParams);
  }, [filterParams]);

  return (
    <div>
      <input onChange={(e) => updateSearch(e.target.value)} />
      <button onClick={() => addFilter(FilterUtils.equals("status", "active"))}>
        Filtrar Activos
      </button>
    </div>
  );
}
```

## 📦 Operadores Disponibles

| Operador  | Uso       | Ejemplo                                   |
| --------- | --------- | ----------------------------------------- |
| `eq`      | Igual     | `FilterUtils.equals('field', 'value')`    |
| `like`    | Contiene  | `FilterUtils.contains('field', 'text')`   |
| `gt`      | Mayor que | `FilterUtils.greaterThan('field', 10)`    |
| `lt`      | Menor que | `FilterUtils.lessThan('field', 100)`      |
| `between` | Entre     | `FilterUtils.between('field', 10, 100)`   |
| `in`      | En lista  | `FilterUtils.inList('field', ['a', 'b'])` |
| `null`    | Es nulo   | `FilterUtils.isNull('field')`             |
| `nnull`   | No nulo   | `FilterUtils.isNotNull('field')`          |

## 🎯 Hook useFilters

```typescript
const {
  filterParams, // Parámetros completos para el servicio
  filters, // Array de filtros activos
  search, // Término de búsqueda
  page, // Página actual
  limit, // Límite de resultados
  addFilter, // Agregar filtro
  removeFilter, // Remover filtro
  updateSearch, // Actualizar búsqueda
  updateSort, // Actualizar ordenamiento
  updatePage, // Cambiar página
  clearFilters, // Limpiar todo
} = useFilters({ page: 1, limit: 10 });
```

## 🔧 Debounce en Búsqueda

```typescript
const [searchInput, setSearchInput] = useState("");
const { updateSearch } = useFilters();

useEffect(() => {
  const timer = setTimeout(() => {
    updateSearch(searchInput);
  }, 500);
  return () => clearTimeout(timer);
}, [searchInput]);
```

## 📋 Principios SOLID

- **SRP**: Cada clase una responsabilidad
- **OCP**: Extensible sin modificar código base
- **LSP**: Configuraciones intercambiables
- **ISP**: Interfaces específicas
- **DIP**: Dependencias de abstracciones

## 🎨 Patrones de Diseño

- **Builder**: QueryStringBuilder para construcción fluida
- **Template Method**: BaseFilterConfig como base extensible
- **Factory**: FilterUtils para crear filtros fácilmente

---

**Implementado en**: Módulo de Usuarios  
**Listo para**: Productos, Almacenes, Distribuciones, Contactos
