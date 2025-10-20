# API de Registro de Contractor

## Endpoint
`POST /api/v1/register/contractor`

## Descripción
Este endpoint permite registrar un nuevo contractor (contratista) en el sistema. El proceso incluye:
1. Crear un usuario en la tabla `users`
2. Crear un perfil de contractor en la tabla `contractors`
3. Asignar el rol "contractor" al usuario
4. Asociar categorías y profesiones si se proporcionan
5. Autenticar automáticamente al usuario
6. Retornar un token de acceso

## Headers
```
Content-Type: application/json
Accept: application/json
```

## Cuerpo de la Petición

### Campos Requeridos
```json
{
  "first_name": "string (máx. 255)",
  "last_name": "string (máx. 255)", 
  "email": "string (formato email, único)",
  "password": "string (mín. 8 caracteres)",
  "password_confirmation": "string (debe coincidir con password)",
  "business_name": "string (máx. 255)",
  "years_of_experience": "integer (mín. 0)"
}
```

### Campos Opcionales
```json
{
  "phone": "string (máx. 20)",
  "description": "string",
  "hourly_rate": "numeric (mín. 0)",
  "location": "string (máx. 255)",
  "availability": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  "categories": [1, 2, 3],
  "professions": [1, 2, 3]
}
```

## Ejemplo de Petición Completa
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+1234567890",
  "business_name": "Construcciones JP",
  "years_of_experience": 15,
  "description": "Contratista especializado en construcción residencial con más de 15 años de experiencia.",
  "hourly_rate": 50.00,
  "location": "Miami, FL",
  "availability": ["monday", "tuesday", "wednesday", "thursday", "friday"],
  "categories": [1, 3, 5],
  "professions": [2, 4]
}
```

## Respuesta Exitosa (201)
```json
{
  "success": true,
  "message": "Usuario autenticado exitosamente",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_at": "2024-01-15T10:30:00.000000Z",
    "user": {
      "id": 1,
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan.perez@example.com",
      "phone": "+1234567890",
      "email_verified_at": null,
      "created_at": "2024-01-01T10:30:00.000000Z",
      "updated_at": "2024-01-01T10:30:00.000000Z",
      "roles": [
        {
          "id": 3,
          "name": "contractor",
          "guard_name": "web",
          "created_at": "2024-01-01T00:00:00.000000Z",
          "updated_at": "2024-01-01T00:00:00.000000Z"
        }
      ],
      "permissions": []
    }
  }
}
```

## Respuestas de Error

### Error de Validación (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Este email ya está registrado."],
    "password": ["La confirmación de contraseña no coincide."],
    "business_name": ["El nombre del negocio es requerido."]
  }
}
```

### Error del Servidor (500)
```json
{
  "success": false,
  "message": "Error al registrar el contractor: [detalle del error]"
}
```

## Validaciones

### Campos de Usuario
- `first_name`: Requerido, string, máximo 255 caracteres
- `last_name`: Requerido, string, máximo 255 caracteres  
- `email`: Requerido, formato email válido, único en la tabla users
- `password`: Requerido, mínimo 8 caracteres, debe coincidir con password_confirmation
- `phone`: Opcional, string, máximo 20 caracteres

### Campos de Contractor
- `business_name`: Requerido, string, máximo 255 caracteres
- `years_of_experience`: Requerido, entero, mínimo 0
- `description`: Opcional, string
- `hourly_rate`: Opcional, numérico, mínimo 0
- `location`: Opcional, string, máximo 255 caracteres

### Disponibilidad
- `availability`: Opcional, array de strings
- Valores válidos: "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"

### Relaciones
- `categories`: Opcional, array de IDs de categorías existentes
- `professions`: Opcional, array de IDs de profesiones existentes

## Ejemplo de Uso en React/TypeScript

```typescript
interface ContractorRegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  business_name: string;
  years_of_experience: number;
  description?: string;
  hourly_rate?: number;
  location?: string;
  availability?: string[];
  categories?: number[];
  professions?: number[];
}

const registerContractor = async (data: ContractorRegistrationData) => {
  try {
    const response = await fetch('/api/v1/register/contractor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar contractor');
    }

    const result = await response.json();
    
    // Guardar token en localStorage o estado global
    localStorage.setItem('auth_token', result.data.token);
    localStorage.setItem('user', JSON.stringify(result.data.user));
    
    return result.data;
  } catch (error) {
    console.error('Error en registro de contractor:', error);
    throw error;
  }
};
```

## Notas Importantes

1. **Transacción de Base de Datos**: El registro se realiza dentro de una transacción para asegurar consistencia
2. **Autenticación Automática**: El usuario se autentica automáticamente tras el registro exitoso
3. **Roles y Permisos**: Se asigna automáticamente el rol "contractor"
4. **Validación de Relaciones**: Las categorías y profesiones se validan contra las tablas existentes
5. **Conversión de Datos**: El array de availability se convierte a JSON para almacenamiento
6. **Manejo de Errores**: Se capturan excepciones y se retornan mensajes informativos

## Estados del Contractor

El contractor creado tendrá inicialmente:
- `contract_status`: Depende del valor por defecto en la migración
- `is_verified`: false (puede requerir verificación posterior)
- `rating`: null (se calcula posteriormente basado en reseñas)