import React, { useState } from 'react';
import { useTheme } from '@/core/context/ThemeContext';

const ThemeColorPicker: React.FC = () => {
  const { colors, setColors, resetColors } = useTheme();
  const [tempColors, setTempColors] = useState(colors);

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempColors(prev => ({ ...prev, primary: e.target.value }));
  };

  const handleSecondaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempColors(prev => ({ ...prev, secondary: e.target.value }));
  };

  const applyColors = () => {
    setColors(tempColors);
  };

  const handleReset = () => {
    resetColors();
    setTempColors({ primary: '#ffed00', secondary: '#1A1B16' });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border max-w-md">
      <h3 className="text-lg font-bold mb-4 text-secondary">
        🎨 Personalizar Colores del Tema
      </h3>
      
      <div className="space-y-4">
        {/* Color Primario */}
        <div>
          <label className="block text-sm font-medium mb-2 text-secondary">
            Color Primario
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={tempColors.primary}
              onChange={handlePrimaryChange}
              className="w-12 h-12 rounded-lg border-2 border-primary cursor-pointer"
            />
            <input
              type="text"
              value={tempColors.primary}
              onChange={handlePrimaryChange}
              className="flex-1 px-3 py-2 border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="#ffed00"
            />
          </div>
        </div>

        {/* Color Secundario */}
        <div>
          <label className="block text-sm font-medium mb-2 text-secondary">
            Color Secundario
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={tempColors.secondary}
              onChange={handleSecondaryChange}
              className="w-12 h-12 rounded-lg border-2 border-secondary cursor-pointer"
            />
            <input
              type="text"
              value={tempColors.secondary}
              onChange={handleSecondaryChange}
              className="flex-1 px-3 py-2 border-2 border-secondary rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
              placeholder="#1A1B16"
            />
          </div>
        </div>

        {/* Vista previa */}
        <div className="p-4 rounded-lg border-2" style={{ borderColor: tempColors.primary, backgroundColor: `${tempColors.primary}20` }}>
          <p className="text-sm font-medium" style={{ color: tempColors.secondary }}>
            Vista previa del tema
          </p>
          <div className="flex gap-2 mt-2">
            <button 
              className="btn-primary"
              style={{
                backgroundColor: tempColors.primary,
                color: tempColors.secondary,
                border: `2px solid ${tempColors.primary}`
              }}
            >
              Botón Primario
            </button>
            <button 
              className="btn-secondary"
              style={{
                backgroundColor: tempColors.secondary,
                color: tempColors.primary,
                border: `2px solid ${tempColors.secondary}`
              }}
            >
              Botón Secundario
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={applyColors}
            className="flex-1 bg-primary text-secondary px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-all"
          >
            ✅ Aplicar Cambios
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-secondary text-primary px-4 py-2 rounded-lg font-medium hover:bg-secondary-700 transition-all"
          >
            🔄 Resetear
          </button>
        </div>

        {/* Colores predefinidos */}
        <div>
          <p className="text-sm font-medium mb-2 text-secondary">Temas predefinidos:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTempColors({ primary: '#ffed00', secondary: '#1A1B16' })}
              className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ffed00' }}></div>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#1A1B16' }}></div>
                <span className="text-xs">Amarillo</span>
              </div>
            </button>
            
            <button
              onClick={() => setTempColors({ primary: '#3B82F6', secondary: '#1E293B' })}
              className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <div className="w-4 h-4 rounded-full bg-slate-800"></div>
                <span className="text-xs">Azul</span>
              </div>
            </button>
            
            <button
              onClick={() => setTempColors({ primary: '#10B981', secondary: '#1F2937' })}
              className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                <span className="text-xs">Verde</span>
              </div>
            </button>
            
            <button
              onClick={() => setTempColors({ primary: '#F59E0B', secondary: '#7C2D12' })}
              className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <div className="w-4 h-4 rounded-full bg-orange-900"></div>
                <span className="text-xs">Naranja</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeColorPicker;