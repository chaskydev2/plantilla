import React from 'react';

const GuGuarantee: React.FC = () => {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Contenido principal */}
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4 inline-block animate-bounce" aria-hidden="true">
            🚧
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Página en construcción</h1>
          <p className="mt-2 text-slate-600">
            Esta sección está en construcción. Vuelve pronto para ver novedades.
          </p>
          <div className="mt-6 flex justify-center gap-2" aria-label="Cargando">
            <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" />
            <span
              className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
              style={{ animationDelay: '0.1s' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuGuarantee;