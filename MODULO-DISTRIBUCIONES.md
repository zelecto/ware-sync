# Módulo de Distribuciones

## Descripción

Módulo completo para gestionar distribuciones de productos entre bodegas o hacia contactos (clientes, distribuidores, proveedores).

## Estructura Creada

### Interfaces

- `src/interface/distribution.ts` - Define las interfaces `Distribution`, `DistributionDetail` y el enum `DistributionStatus`

### Servicios

- `src/services/distributions.service.ts` - Servicio con métodos para:
  - `findAll()` - Listar todas las distribuciones
  - `findOne(id)` - Obtener una distribución por ID
  - `create(data)` - Crear nueva distribución
  - `update(id, data)` - Actualizar distribución
  - `complete(id)` - Completar distribución (actualiza inventarios)
  - `cancel(id)` - Cancelar distribución
  - `remove(id)` - Eliminar distribución

### Componentes

- `src/components/distribution/DistributionForm.tsx` - Formulario para crear distribuciones
- `src/components/distribution/DistributionTable.tsx` - Tabla con listado de distribuciones
- `src/components/distribution/DistributionDetail.tsx` - Vista detallada de una distribución
- `src/components/distribution/index.tsx` - Exportaciones del módulo

### Páginas

- `src/page/Distributions/Distributions.tsx` - Página principal con listado
- `src/page/Distributions/Create.tsx` - Página para crear distribución
- `src/page/Distributions/Show.tsx` - Página para ver detalle
- `src/page/Distributions/Index.tsx` - Exportación del módulo

### Rutas

Se agregaron las siguientes rutas en `src/router/index.tsx`:

- `/distributions` - Listado de distribuciones
- `/distributions/create` - Crear nueva distribución
- `/distributions/show/:id` - Ver detalle de distribución

## Características

### Estados de Distribución

- **PENDING**: Distribución creada pero no completada
- **COMPLETED**: Distribución completada (inventarios actualizados)
- **CANCELLED**: Distribución cancelada

### Funcionalidades

1. **Crear Distribución**

   - Seleccionar bodega de origen
   - Seleccionar destino (bodega o contacto, no ambos)
   - Agregar múltiples productos con cantidades
   - Validación de stock disponible

2. **Listar Distribuciones**

   - Ver todas las distribuciones con su estado
   - Filtrar por estado
   - Acciones rápidas (ver, completar, cancelar, eliminar)

3. **Ver Detalle**

   - Información completa de la distribución
   - Lista de productos distribuidos
   - Acciones según el estado

4. **Completar Distribución**

   - Actualiza inventarios automáticamente
   - Reduce stock en bodega origen
   - Aumenta stock en bodega destino (si aplica)

5. **Cancelar/Eliminar**
   - Cancelar distribuciones pendientes
   - Eliminar distribuciones no completadas

## Validaciones

- No se puede especificar bodega destino y contacto al mismo tiempo
- La bodega origen y destino deben ser diferentes
- Validación de stock disponible antes de crear
- No se puede modificar/eliminar distribuciones completadas
- No se puede completar distribuciones canceladas

## Uso

### Acceder al módulo

Navegar a `/distributions` en la aplicación.

### Crear una distribución

1. Click en "Nueva Distribución"
2. Seleccionar bodega de origen
3. Seleccionar destino (bodega o contacto)
4. Agregar productos con cantidades
5. Click en "Crear Distribución"

### Completar una distribución

1. Desde el listado o detalle, click en "Completar"
2. Confirmar la acción
3. Los inventarios se actualizan automáticamente

## Integración con Backend

El módulo está diseñado para integrarse con el servicio NestJS proporcionado, siguiendo la misma estructura y endpoints.
