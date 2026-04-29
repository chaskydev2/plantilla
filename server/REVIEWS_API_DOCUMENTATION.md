# Sistema de Calificaciones (Reviews) - HomeownerProfile → Contractor

## 📝 Descripción

Sistema completo de calificaciones donde los **HomeownerProfile** pueden calificar a los **Contractor** con estrellas (1-5) y comentarios opcionales. El sistema calcula automáticamente el promedio de calificaciones para cada contractor.

---

## 🗄️ Estructura de Base de Datos

### Tabla: `reviews`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | bigint | ID único de la calificación |
| `homeowner_profile_id` | bigint | ID del HomeownerProfile que califica |
| `contractor_id` | bigint | ID del Contractor calificado |
| `rating` | tinyint | Calificación de 1 a 5 estrellas |
| `comment` | text | Comentario opcional |
| `created_at` | timestamp | Fecha de creación |
| `updated_at` | timestamp | Fecha de actualización |

**Restricción única:** Un HomeownerProfile solo puede calificar una vez a cada Contractor (pero puede actualizar su calificación).

---

## 📍 Endpoints API

### 1. **Crear o Actualizar Calificación** (Requiere autenticación)

```http
POST /api/v1/reviews/contractor/{contractorId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excelente servicio, muy profesional"
}
```

**Validaciones:**
- `rating`: Requerido, entero entre 1 y 5
- `comment`: Opcional, máximo 1000 caracteres

**Respuesta exitosa (201 o 200):**
```json
{
  "success": true,
  "message": "Calificación creada exitosamente",
  "data": {
    "id": 1,
    "homeowner_profile_id": 5,
    "contractor_id": 10,
    "rating": 5,
    "comment": "Excelente servicio, muy profesional",
    "created_at": "2026-01-23T10:30:00.000000Z",
    "updated_at": "2026-01-23T10:30:00.000000Z",
    "homeowner_profile": {
      "user_id": 5,
      "user": {
        "id": 5,
        "name": "Juan Pérez",
        "email": "juan@example.com"
      }
    },
    "contractor": {
      "user_id": 10,
      "company_name": "Plomería Express",
      "average_rating": "4.50",
      "user": {
        "id": 10,
        "name": "María García"
      }
    }
  }
}
```

---

### 2. **Ver Todas las Calificaciones de un Contractor** (Público)

```http
GET /api/v1/contractors/{contractorId}/reviews
```

**Respuesta:**
```json
{A
  "success": true,
  "message": "Calificaciones obtenidas correctamente",
  "data": {
    "reviews": [
      {
        "id": 1,
        "homeowner_profile_id": 5,
        "contractor_id": 10,
        "rating": 5,
        "comment": "Excelente servicio",
        "created_at": "2026-01-23T10:30:00.000000Z",
        "homeowner_profile": {
          "user_id": 5,
          "user": {
            "name": "Juan Pérez"
          }
        }
      }
    ],
    "stats": {
      "average_rating": "4.50",
      "total_reviews": 12,
      "rating_distribution": {
        "5_stars": 6,
        "4_stars": 4,
        "3_stars": 1,
        "2_stars": 1,
        "1_star": 0
      }
    }
  }
}
```

---

### 3. **Ver Mi Calificación a un Contractor** (Requiere autenticación)

```http
GET /api/v1/reviews/contractor/{contractorId}/my-review
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Calificación obtenida",
  "data": {
    "id": 1,
    "homeowner_profile_id": 5,
    "contractor_id": 10,
    "rating": 5,
    "comment": "Excelente servicio",
    "created_at": "2026-01-23T10:30:00.000000Z",
    "contractor": {
      "user_id": 10,
      "company_name": "Plomería Express",
      "average_rating": "4.50"
    }
  }
}
```

---

### 4. **Eliminar Mi Calificación** (Requiere autenticación)

```http
DELETE /api/v1/reviews/contractor/{contractorId}
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Calificación eliminada correctamente"
}
```

---

## 🔗 Relaciones de Modelos

### Modelo: `Review`

```php
// Relaciones
$review->homeownerProfile  // HomeownerProfile que dio la calificación
$review->contractor        // Contractor que recibió la calificación

// Métodos útiles
$review->isPositive()      // true si rating >= 4
$review->isNegative()      // true si rating <= 2
$review->stars_text        // "⭐⭐⭐⭐⭐"
```

### Modelo: `Contractor`

```php
// Relaciones
$contractor->reviews()     // Todas las calificaciones recibidas

// Métodos útiles
$contractor->updateAverageRating()  // Recalcular promedio
$contractor->average_rating         // Promedio actual (decimal)
```

### Modelo: `HomeownerProfile`

```php
// Relaciones
$homeowner->reviews()      // Todas las calificaciones dadas

// Métodos útiles
$homeowner->hasReviewedContractor($contractorId)     // bool
$homeowner->getReviewForContractor($contractorId)    // Review|null
```

---

## 🔐 Validaciones y Seguridad

1. **Solo HomeownerProfile puede calificar:** El sistema verifica que el usuario autenticado tenga un perfil de propietario.

2. **No auto-calificación:** Un usuario no puede calificarse a sí mismo.

3. **Una calificación por contractor:** Cada HomeownerProfile solo puede tener una calificación activa por Contractor (pero puede actualizarla).

4. **Actualización automática del promedio:** Cada vez que se crea, actualiza o elimina una calificación, se recalcula automáticamente el `average_rating` del Contractor.

---

## 📊 Cálculo de Promedio

El promedio se calcula automáticamente con:

```php
$contractor->updateAverageRating();
```

Este método:
1. Calcula el promedio de todas las calificaciones del contractor
2. Redondea a 2 decimales
3. Actualiza el campo `average_rating` en la tabla `contractors`

---

## 🧪 Datos de Prueba

Para crear reviews de prueba:

```bash
php artisan db:seed --class=ReviewSeeder
```

---

## 📱 Ejemplo de Flujo Completo

### Paso 1: HomeownerProfile califica a un Contractor

```bash
curl -X POST http://localhost/api/v1/reviews/contractor/10 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Excelente trabajo, muy profesional"
  }'
```

### Paso 2: Ver todas las calificaciones del Contractor

```bash
curl http://localhost/api/v1/contractors/10/reviews
```

### Paso 3: Actualizar mi calificación

```bash
curl -X POST http://localhost/api/v1/reviews/contractor/10 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Buen trabajo, pero llegó tarde"
  }'
```

### Paso 4: Ver mi calificación

```bash
curl http://localhost/api/v1/reviews/contractor/10/my-review \
  -H "Authorization: Bearer {token}"
```

### Paso 5: Eliminar mi calificación

```bash
curl -X DELETE http://localhost/api/v1/reviews/contractor/10 \
  -H "Authorization: Bearer {token}"
```

---

## ✅ Características Implementadas

- ✅ Crear y actualizar calificaciones
- ✅ Ver calificaciones de un contractor
- ✅ Estadísticas de calificaciones (promedio, distribución)
- ✅ Eliminar calificaciones
- ✅ Validación de HomeownerProfile
- ✅ Prevención de auto-calificación
- ✅ Actualización automática de promedios
- ✅ Restricción única por HomeownerProfile-Contractor
- ✅ Comentarios opcionales
- ✅ Migración de base de datos
- ✅ Seeder de datos de prueba

---

## 🎯 Casos de Uso

1. **Búsqueda de contractors por calificación:**
   ```php
   $topContractors = Contractor::byRating(4.0)->get();
   ```

2. **Verificar si un homeowner ya calificó:**
   ```php
   if ($homeowner->hasReviewedContractor($contractorId)) {
       // Ya tiene una calificación
   }
   ```

3. **Obtener solo reseñas positivas:**
   ```php
   $positiveReviews = $contractor->reviews()->minimumRating(4)->get();
   ```

4. **Reseñas recientes (últimos 30 días):**
   ```php
   $recentReviews = $contractor->reviews()->recent(30)->get();
   ```

---

## 🚀 ¡Sistema Listo!

El sistema de calificaciones está completamente funcional y listo para usar. Los HomeownerProfile pueden calificar a los Contractors con estrellas y comentarios, y el promedio se actualiza automáticamente.
