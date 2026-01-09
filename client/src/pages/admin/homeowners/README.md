# Módulo de Propietarios (Homeowners)

Este módulo gestiona los perfiles de propietarios de viviendas en el sistema.

## Archivos Creados

### Tipos
- `src/core/types/IHomeowner.ts` - Interfaces y tipos para propietarios

### Servicios
- `src/core/services/homeowner/homeowner.service.ts` - Servicio API para operaciones CRUD

### Componentes
- `src/pages/admin/homeowners/Main.tsx` - Página principal con tabla de propietarios
- `src/pages/admin/homeowners/form-stepper.tsx` - Formulario modal con stepper para crear/editar
- `src/pages/admin/homeowners/index.ts` - Archivo de exportación

## Funcionalidades

### Gestión de Datos
- ✅ Crear nuevo propietario
- ✅ Editar propietario existente
- ✅ Eliminar propietario
- ✅ Búsqueda por texto
- ✅ Filtros por país y estado
- ✅ Paginación
- ✅ Ordenamiento

### Formulario Stepper
El formulario está dividido en 3 pasos:

1. **Usuario**: Selección del usuario del sistema
2. **Dirección Principal**: Información básica de ubicación (requerida)
3. **Detalles Adicionales**: Información complementaria como coordenadas GPS

### Campos del Modelo
- `user_id` (requerido) - ID del usuario asociado
- `preferred_zip` (requerido) - Código postal preferido
- `address_line1` (requerido) - Dirección principal
- `address_line2` (opcional) - Dirección secundaria
- `city` (requerido) - Ciudad
- `state_code` (requerido) - Código del estado
- `country_code` (requerido) - Código del país
- `lat` (opcional) - Latitud GPS
- `lng` (opcional) - Longitud GPS

### Tabla de Visualización
La tabla muestra:
- ID del usuario
- Información del usuario (nombre, email)
- Dirección completa
- Ubicación (ciudad, estado, código postal)
- País
- Coordenadas GPS (si están disponibles)
- Fecha de creación
- Acciones (editar, eliminar)

### Filtros Disponibles
- **Por País**: Filtro dropdown con países predefinidos
- **Por Estado**: Filtro dropdown con estados de EE.UU.
- **Búsqueda**: Por ciudad, estado o código postal

## Uso

### Importar en Rutas
```typescript
import HomeownersPage from '@/pages/admin/homeowners';
```

### Permisos (Por implementar)
```typescript
// Descomentar cuando se configuren los permisos
hasPermission("propietario_crear") // Crear
hasPermission("propietario_editar") // Editar  
hasPermission("propietario_eliminar") // Eliminar
```

## API Endpoints Esperados
- `GET /v1/homeowners` - Listar con paginación y filtros
- `POST /v1/homeowners` - Crear nuevo
- `PUT /v1/homeowners/{id}` - Actualizar
- `DELETE /v1/homeowners/{id}` - Eliminar
- `GET /v1/homeowners/stats` - Estadísticas
- `GET /v1/homeowners/country/{code}` - Filtrar por país
- `GET /v1/homeowners/state/{code}` - Filtrar por estado
- `GET /v1/homeowners/zip/{zip}` - Filtrar por código postal

## Tecnologías Utilizadas
- React + TypeScript
- React Hook Form + Yup (validación)
- Tailwind CSS (estilos)
- Lucide React (iconos)
- Stepper component (navegación por pasos)

## Notas
- El formulario usa un stepper de 3 pasos para mejorar la UX
- Las coordenadas GPS son opcionales pero útiles para servicios de ubicación
- Compatible con el sistema de permisos existente
- Sigue los mismos patrones que el módulo de contractors