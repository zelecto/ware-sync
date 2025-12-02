# WareSync - Sistema de Gestión de Almacenes

## 📋 Descripción General

**WareSync** es una aplicación web moderna para la gestión integral de almacenes, inventarios y distribuciones. Desarrollada con React 19, TypeScript y Vite, ofrece una interfaz intuitiva para administrar productos, almacenes, contactos (proveedores/clientes) y movimientos de inventario.

## 🎯 Características Principales

### 🔐 Sistema de Autenticación y Roles

- Autenticación basada en JWT
- Control de acceso basado en roles (RBAC)
- Dos roles principales:
  - **ADMIN**: Acceso completo al sistema
  - **WORKER**: Acceso limitado a operaciones específicas
- Rutas protegidas según permisos
- Gestión de sesión persistente

### 👥 Gestión de Usuarios

- CRUD completo de usuarios (solo ADMIN)
- Asignación de roles
- Vinculación con información personal
- Listado con filtros y paginación

### 📦 Gestión de Productos

- Registro de productos con SKU único
- Múltiples unidades de medida (unidad, caja, paquete, bolsa, litro, kilo)
- Control de stock mínimo
- Gestión de precios de compra
- Asociación con múltiples proveedores
- Seguimiento de stock por almacén
- Indicadores visuales de niveles de stock
- Vista detallada con historial

### 🏢 Gestión de Almacenes

- CRUD de almacenes
- Ubicación geográfica (ciudad, dirección)
- Vista de inventario por almacén
- Alertas de stock bajo
- Detalle de productos almacenados

### 👤 Gestión de Contactos

- Registro de proveedores y clientes
- Información completa (nombre, email, teléfono, dirección)
- Vista en tarjetas y tabla
- Asociación con productos
- Filtrado y búsqueda

### 🚚 Sistema de Distribuciones

- **Entrada de Proveedores**: Registro de mercancía entrante
- **Transferencias entre Almacenes**: Movimiento de productos
- Estados de distribución:
  - PENDING (Pendiente)
  - COMPLETED (Completada)
  - CANCELLED (Cancelada)
- Detalle de productos por distribución
- Historial de movimientos
- Confirmación de operaciones

### 🔍 Sistema de Filtros Avanzado

- Filtrado genérico y reutilizable
- Operadores múltiples (igual, contiene, mayor que, menor que, entre, etc.)
- Búsqueda en tiempo real
- Ordenamiento dinámico
- Paginación integrada
- Configuración por entidad

### 📊 Dashboard

- Vista general del sistema
- Métricas y estadísticas
- Acceso rápido a módulos

## 🏗️ Arquitectura del Proyecto

```
ware-sync/
├── public/                    # Recursos estáticos
│   ├── icon.png
│   └── logo.png
├── src/
│   ├── components/           # Componentes React
│   │   ├── auth/            # Autenticación
│   │   ├── contact/         # Contactos
│   │   ├── distribution/    # Distribuciones
│   │   ├── layout/          # Layout y navegación
│   │   ├── product/         # Productos
│   │   ├── ui/              # Componentes UI reutilizables
│   │   ├── user/            # Usuarios
│   │   └── warehouse/       # Almacenes
│   ├── contexts/            # Contextos React
│   │   ├── AuthContext.tsx
│   │   └── BreadcrumbContext.tsx
│   ├── hooks/               # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useFilters.ts
│   │   ├── usePagination.ts
│   │   └── useBreadcrumbItem.ts
│   ├── interface/           # Interfaces TypeScript
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── warehouse.ts
│   │   ├── contact.ts
│   │   ├── distribution.ts
│   │   └── pagination.ts
│   ├── layouts/             # Layouts principales
│   │   ├── RootLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── lib/                 # Utilidades y helpers
│   │   ├── api/            # Cliente API
│   │   ├── filters/        # Sistema de filtros
│   │   ├── utils.ts
│   │   ├── role-utils.ts
│   │   └── pagination-utils.ts
│   ├── page/                # Páginas de la aplicación
│   │   ├── auth/           # Login
│   │   ├── Contacts/       # Páginas de contactos
│   │   ├── Dasboard/       # Dashboard
│   │   ├── Distributions/  # Páginas de distribuciones
│   │   ├── Products/       # Páginas de productos
│   │   ├── Users/          # Páginas de usuarios
│   │   ├── Warehouses/     # Páginas de almacenes
│   │   ├── Home.tsx
│   │   └── NotFound.tsx
│   ├── router/              # Configuración de rutas
│   │   └── index.tsx
│   ├── services/            # Servicios API
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── contacts.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── distributions.service.ts
│   │   ├── products.service.ts
│   │   ├── users.service.ts
│   │   └── warehouses.service.ts
│   ├── types/               # Tipos TypeScript
│   ├── App.tsx
│   └── main.tsx
├── docs/                    # Documentación
│   └── FILTERS.md
├── .env.example             # Variables de entorno ejemplo
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Stack Tecnológico

### Frontend Core

- **React 19.2.0** - Framework UI con React Compiler
- **TypeScript 5.9.3** - Tipado estático
- **Vite 7.2.2** - Build tool y dev server

### UI & Estilos

- **Tailwind CSS 4.1.17** - Framework CSS utility-first
- **Shadcn/ui** - Componentes UI basados en Radix UI
- **Lucide React** - Librería de iconos
- **class-variance-authority** - Gestión de variantes de componentes
- **clsx + tailwind-merge** - Utilidades para clases CSS

### Routing & Estado

- **React Router DOM 7.9.6** - Enrutamiento SPA
- **Context API** - Gestión de estado global

### Formularios & Validación

- **Formik 2.4.9** - Manejo de formularios
- **Zod 4.1.12** - Validación de esquemas

### HTTP & API

- **Axios 1.13.2** - Cliente HTTP

### Notificaciones

- **React Hot Toast 2.6.0** - Sistema de notificaciones

### Herramientas de Desarrollo

- **ESLint 9.39.1** - Linter
- **Babel React Compiler** - Optimización de React

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- pnpm (gestor de paquetes)

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd ware-sync
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Editar `.env` con la URL de tu API:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. **Iniciar servidor de desarrollo**

```bash
pnpm dev
```

5. **Build para producción**

```bash
pnpm build
```

6. **Preview del build**

```bash
pnpm preview
```

## 📱 Módulos del Sistema

### 1. Autenticación (`/login`)

- Login con email y contraseña
- Validación de credenciales
- Almacenamiento de token JWT
- Redirección automática según autenticación

### 2. Dashboard (`/dashboard`)

- Vista principal del sistema
- Resumen de métricas
- Acceso rápido a módulos

### 3. Usuarios (`/users`) - Solo ADMIN

- Listado de usuarios con paginación
- Crear nuevo usuario
- Editar usuario existente
- Asignación de roles
- Filtros y búsqueda

### 4. Contactos (`/contacts`) - Solo ADMIN

- Vista en tarjetas y tabla
- Crear proveedor/cliente
- Editar información de contacto
- Asociar con productos
- Búsqueda y filtros

### 5. Productos (`/products`)

- Listado de productos
- Crear producto con SKU
- Editar información
- Ver detalle con stock por almacén
- Gestionar proveedores
- Indicadores de stock
- Búsqueda y filtros

### 6. Almacenes (`/warehouses`)

- Listado de almacenes
- Crear almacén
- Editar información
- Ver inventario del almacén
- Alertas de stock bajo

### 7. Distribuciones (`/distributions`)

- **Transferencias** (`/distributions`)
  - Crear transferencia entre almacenes
  - Ver historial
  - Detalle de movimiento
- **Entradas de Proveedor** (`/distributions/inbound`)
  - Registrar entrada de mercancía
  - Seleccionar proveedor
  - Agregar productos y cantidades
  - Confirmar recepción

## 🔑 Sistema de Permisos

### Roles y Accesos

| Módulo         | ADMIN | WORKER |
| -------------- | ----- | ------ |
| Dashboard      | ✅    | ✅     |
| Usuarios       | ✅    | ❌     |
| Contactos      | ✅    | ❌     |
| Productos      | ✅    | ✅     |
| Almacenes      | ✅    | ✅     |
| Distribuciones | ✅    | ✅     |

### Implementación de Permisos

```typescript
// Rutas protegidas por rol
<ProtectedRoute allowedRoles={["ADMIN"]}>
  <DashboardLayout />
</ProtectedRoute>;

// Hook para verificar permisos
const { hasRole } = useAuth();
if (hasRole("ADMIN")) {
  // Mostrar contenido admin
}
```

## 🔍 Sistema de Filtros

El proyecto implementa un sistema de filtros genérico y reutilizable basado en principios SOLID.

### Características

- Filtrado por múltiples campos
- Operadores: igual, contiene, mayor que, menor que, entre, en lista, nulo, no nulo
- Búsqueda en tiempo real
- Ordenamiento ascendente/descendente
- Paginación integrada
- Configuración por entidad

### Uso Básico

```typescript
import { useFilters } from "@/hooks/useFilters";
import { FilterUtils } from "@/lib/filters";

const { filterParams, addFilter, updateSearch } = useFilters({
  page: 1,
  limit: 10,
});

// Agregar filtro
addFilter(FilterUtils.equals("status", "active"));

// Búsqueda
updateSearch("término");

// Usar en servicio
productService.findAll(filterParams);
```

Ver documentación completa en [`docs/FILTERS.md`](docs/FILTERS.md)

## 📊 Modelos de Datos

### Usuario

```typescript
interface User {
  personId: string;
  person: Person;
  password: string;
  role: UserRole; // ADMIN | WORKER
}
```

### Producto

```typescript
interface Product {
  sku: string;
  name: string;
  unit?: ProductUnit;
  purchasePrice: string;
  minStock?: number;
  isActive?: boolean;
  warehouses?: WarehouseStock[];
  suppliers?: ProductSupplier[];
}
```

### Almacén

```typescript
interface Warehouse {
  name: string;
  city: string;
  address: string;
}
```

### Distribución

```typescript
interface Distribution {
  originWarehouseId?: string;
  destinationWarehouseId: string;
  contactId?: string;
  status: DistributionStatus; // PENDING | COMPLETED | CANCELLED
  type: DistributionType; // SUPPLIER_INBOUND | WAREHOUSE_TRANSFER
  details: DistributionDetail[];
}
```

## 🎨 Componentes UI Reutilizables

El proyecto utiliza componentes de Shadcn/ui personalizados:

- **Button** - Botones con variantes y estados de carga
- **Card** - Tarjetas de contenido
- **Dialog** - Modales y diálogos
- **Table** - Tablas de datos con paginación
- **Input** - Campos de entrada
- **Select** - Selectores dropdown
- **Badge** - Etiquetas de estado
- **Tooltip** - Tooltips informativos
- **Sidebar** - Barra lateral de navegación
- **ConfirmDialog** - Diálogos de confirmación
- **DataTable** - Tabla de datos con paginación integrada
- **ProductAutocomplete** - Autocompletado de productos
- **SupplierAutocomplete** - Autocompletado de proveedores

## 🔄 Flujos Principales

### Flujo de Entrada de Mercancía

1. Usuario navega a "Entradas de Proveedor"
2. Clic en "Nueva Entrada"
3. Selecciona proveedor
4. Selecciona almacén destino
5. Agrega productos y cantidades
6. Confirma la entrada
7. Sistema actualiza inventario

### Flujo de Transferencia

1. Usuario navega a "Distribuciones"
2. Clic en "Nueva Transferencia"
3. Selecciona almacén origen
4. Selecciona almacén destino
5. Agrega productos y cantidades
6. Confirma transferencia
7. Sistema actualiza inventarios

### Flujo de Gestión de Productos

1. Usuario crea producto con SKU
2. Asigna proveedores
3. Define stock mínimo
4. Producto disponible para distribuciones
5. Sistema monitorea niveles de stock
6. Alertas cuando stock < mínimo

## 📈 Historial de Desarrollo

### Fase 1: Fundamentos (Commits iniciales)

- Inicialización del proyecto con React + TypeScript + Vite
- Configuración de Tailwind CSS
- Implementación de componentes UI base

### Fase 2: Autenticación y Layout

- Sistema de autenticación con JWT
- Context API para gestión de usuario
- Layout del dashboard con sidebar
- Rutas protegidas

### Fase 3: Módulos CRUD

- Gestión de usuarios
- Gestión de contactos
- Gestión de productos
- Gestión de almacenes

### Fase 4: Sistema de Distribuciones

- Módulo de distribuciones
- Transferencias entre almacenes
- Entradas de proveedores
- Detalle de movimientos

### Fase 5: Mejoras y Optimizaciones

- Sistema de filtros genérico
- Paginación completa
- Breadcrumbs dinámicos
- Indicadores de stock
- Diálogos de confirmación

### Fase 6: Control de Acceso

- Implementación de RBAC
- Roles ADMIN y WORKER
- Restricciones por rol en UI
- Protección de rutas por permisos

### Nomenclatura

- Componentes: PascalCase (`UserForm.tsx`)
- Hooks: camelCase con prefijo `use` (`useAuth.ts`)
- Servicios: camelCase con sufijo `.service` (`auth.service.ts`)
- Interfaces: PascalCase (`User`, `Product`)
- Enums: PascalCase (`UserRole`, `DistributionStatus`)

### Imports

```typescript
// Externos
import { useState } from "react";

// Internos con alias @
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
```

## 🔐 Seguridad

- Tokens JWT almacenados en localStorage
- Validación de permisos en frontend y backend
- Rutas protegidas por autenticación
- Validación de formularios con Zod
- Sanitización de inputs

## 🌐 API Integration

El proyecto se conecta a una API REST mediante Axios:

```typescript
// Cliente API configurado
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 👥 Contribución

Este proyecto sigue un flujo de desarrollo estructurado con commits descriptivos siguiendo el formato:

```
feat(módulo): descripción breve del cambio
refactor(módulo): descripción de la refactorización
fix(módulo): descripción del bug corregido
```
