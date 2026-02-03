# 🎨 Sistema de Colores del Tema

Este documento explica cómo usar el sistema de colores personalizable en toda la aplicación.

## 📋 Configuración

### 1. Variables CSS Disponibles

```css
/* Colores principales */
--color-primary: #ffed00
--color-primary-500: #ffed00
--color-secondary: #1A1B16
--color-secondary-500: #1A1B16

/* Variaciones automáticas */
--color-primary-25, --color-primary-50, --color-primary-100...
--color-secondary-25, --color-secondary-50, --color-secondary-100...
```

### 2. Clases CSS Predefinidas

```css
/* Textos */
.text-primary, .text-secondary
.text-primary-500, .text-secondary-500

/* Fondos */
.bg-primary, .bg-secondary
.bg-primary-500, .bg-secondary-500
.bg-primary-50, .bg-primary-100...

/* Bordes */
.border-primary, .border-secondary
.border-primary-500, .border-secondary-500

/* Estados hover */
.hover:bg-primary:hover, .hover:bg-secondary:hover
.hover:text-primary:hover, .hover:text-secondary:hover

/* Estados focus */
.focus:ring-primary:focus, .focus:ring-secondary:focus
.focus:border-primary:focus, .focus:border-secondary:focus

/* Botones predefinidos */
.btn-primary, .btn-secondary
.btn-outline-primary, .btn-outline-secondary

/* Gradientes */
.bg-gradient-primary, .bg-gradient-secondary
.bg-gradient-primary-to-secondary

/* Sombras */
.shadow-primary, .shadow-secondary
.shadow-primary-lg, .shadow-secondary-lg
```

## 🚀 Formas de Uso

### 1. Usando Clases CSS (Recomendado)

```tsx
// Botones
<button className="bg-primary text-secondary hover:bg-primary-600">
  Botón Primario
</button>

<button className="btn-primary">
  Botón con clase predefinida
</button>

// Textos y fondos
<div className="bg-primary-50 border-primary text-secondary p-4">
  Contenido con tema
</div>

// Estados hover y focus
<input className="border-primary focus:ring-primary focus:border-primary" />
```

### 2. Usando Variables CSS en estilos inline

```tsx
<div style={{
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-secondary)',
  borderColor: 'var(--color-primary)'
}}>
  Contenido personalizado
</div>
```

### 3. Usando el Hook useThemeColors

```tsx
import { useThemeColors } from '@/core/context/ThemeContext';

function MiComponente() {
  const { primary, secondary, style } = useThemeColors();
  
  return (
    <div>
      {/* Usando valores directos */}
      <p style={{ color: primary }}>Texto primario</p>
      
      {/* Usando objetos de estilo predefinidos */}
      <button style={style.bgPrimary}>Botón</button>
      <div style={style.borderSecondary}>Contenido</div>
    </div>
  );
}
```

### 4. Usando el Hook useTheme (Cambio dinámico)

```tsx
import { useTheme } from '@/core/context/ThemeContext';

function ConfiguradorColores() {
  const { colors, setColors, resetColors } = useTheme();
  
  const cambiarAPurpura = () => {
    setColors({
      primary: '#8B5CF6',
      secondary: '#1E1B4B'
    });
  };
  
  return (
    <div>
      <button onClick={cambiarAPurpura}>Tema Púrpura</button>
      <button onClick={resetColors}>Resetear</button>
    </div>
  );
}
```

## 🎛️ Componente ThemeColorPicker

Para usar el selector de colores visual:

```tsx
import ThemeColorPicker from '@/components/common/ThemeColorPicker';

function ConfiguracionTema() {
  return (
    <div>
      <h2>Personalizar Tema</h2>
      <ThemeColorPicker />
    </div>
  );
}
```

## 🔧 Configuración en el App Principal

Asegúrate de envolver tu aplicación con el ThemeProvider:

```tsx
// En tu App.tsx o layout principal
import { ThemeProvider } from '@/core/context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* Tu aplicación */}
    </ThemeProvider>
  );
}
```

## 📱 Ejemplos Prácticos

### Formulario con tema
```tsx
<form className="space-y-4">
  <input 
    className="border-primary focus:ring-primary focus:border-primary"
    placeholder="Nombre" 
  />
  <button className="btn-primary w-full">
    Enviar
  </button>
</form>
```

### Card con tema
```tsx
<div className="bg-white border-primary rounded-lg shadow-primary p-6">
  <h3 className="text-secondary font-bold">Título</h3>
  <p className="text-secondary-500">Descripción</p>
  <button className="btn-outline-primary mt-4">Acción</button>
</div>
```

### Navegación con tema
```tsx
<nav className="bg-secondary">
  <div className="text-primary font-bold">Logo</div>
  <ul className="flex space-x-4">
    <li><a href="#" className="text-primary hover:text-primary-300">Inicio</a></li>
    <li><a href="#" className="text-primary hover:text-primary-300">Servicios</a></li>
  </ul>
</nav>
```

## 💾 Persistencia

Los colores se guardan automáticamente en `localStorage` y se mantienen entre sesiones del navegador.

## 🎨 Temas Predefinidos

```tsx
// Tema por defecto (Amarillo)
{ primary: '#ffed00', secondary: '#1A1B16' }

// Tema azul
{ primary: '#3B82F6', secondary: '#1E293B' }

// Tema verde
{ primary: '#10B981', secondary: '#1F2937' }

// Tema naranja
{ primary: '#F59E0B', secondary: '#7C2D12' }
```

## ⚡ Consejos de Rendimiento

1. **Usa clases CSS** cuando sea posible (mejor rendimiento)
2. **Usa variables CSS** para casos específicos
3. **Usa hooks** solo cuando necesites reactividad al cambio de colores
4. Los colores se aplican instantáneamente sin recargar la página

## 🔄 Migración de Código Existente

Para migrar código existente:

```tsx
// Antes
<button className="bg-yellow-400 text-gray-900">Botón</button>

// Después
<button className="bg-primary text-secondary">Botón</button>

// O con clases predefinidas
<button className="btn-primary">Botón</button>
```

¡Con este sistema puedes cambiar toda la apariencia de tu aplicación modificando solo dos colores! 🚀