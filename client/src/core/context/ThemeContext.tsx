"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeColors {
  primary: string;
  secondary: string;
}

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  resetColors: () => void;
};

const defaultColors: ThemeColors = {
  primary: '#ffed00',
  secondary: '#1A1B16'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Estado para colores del tema
  const [colors, setColorsState] = useState<ThemeColors>(() => {
    if (typeof window !== 'undefined') {
      const savedColors = localStorage.getItem('themeColors');
      return savedColors ? JSON.parse(savedColors) : defaultColors;
    }
    return defaultColors;
  });

  useEffect(() => {
    // This code will only run on the client side
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "light"; // Default to light theme

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  // Funciones para manejar colores
  const setColors = (newColors: ThemeColors) => {
    setColorsState(newColors);
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeColors', JSON.stringify(newColors));
      updateCSSVariables(newColors);
    }
  };

  const resetColors = () => {
    setColors(defaultColors);
  };

  const updateCSSVariables = (colors: ThemeColors) => {
    const root = document.documentElement;
    
    // Actualizar variables CSS principales
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-500', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-secondary-500', colors.secondary);

    // Actualizar variables DaisyUI
    const primaryHSL = hexToHSL(colors.primary);
    const secondaryHSL = hexToHSL(colors.secondary);
    
    root.style.setProperty('--p', primaryHSL);
    root.style.setProperty('--s', secondaryHSL);
  };

  // Función para convertir HEX a HSL para DaisyUI
  const hexToHSL = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
  };

  useEffect(() => {
    // Aplicar colores al cargar el componente
    if (isInitialized) {
      updateCSSVariables(colors);
    }
  }, [isInitialized, colors]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, setColors, resetColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Hook personalizado para usar los colores fácilmente
export const useThemeColors = () => {
  const { colors } = useTheme();
  
  return {
    primary: colors.primary,
    secondary: colors.secondary,
    // Funciones helper para usar en estilos inline
    style: {
      primary: { color: colors.primary },
      secondary: { color: colors.secondary },
      bgPrimary: { backgroundColor: colors.primary },
      bgSecondary: { backgroundColor: colors.secondary },
      borderPrimary: { borderColor: colors.primary },
      borderSecondary: { borderColor: colors.secondary },
    }
  };
};
