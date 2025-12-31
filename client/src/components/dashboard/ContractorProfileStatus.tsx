import React, { useEffect, useState } from "react";
import { ContractorService } from '@/core/services/contractor/contractor.service';

const ContractorProfileStatus: React.FC = () => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ContractorService.getAttributesForContractors()
      .then((res) => {
        console.log('Respuesta de atributos:', res);
        // Soporta tanto estructura paginada como simple
        let attrs: any[] = [];
        if (Array.isArray(res.data?.data)) {
          attrs = res.data.data;
        } else if (Array.isArray(res.data)) {
          attrs = res.data;
        }
        // Imprime solo los nombres de los atributos
        console.log('Nombres de atributos:', attrs.map((a: any) => a.name));
        setAttributes(attrs);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar los requisitos.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-red-50 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">Completa tu registro</h2>
      <p className="text-sm text-red-600 dark:text-red-200 mb-4">
        Para continuar, adjunta los documentos requeridos y completa los siguientes pasos para la verificación de tu perfil.
      </p>
      {/* DEBUG: Mostrar datos crudos de attributes */}
      <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-700 dark:text-gray-200">
        <strong>Datos recibidos:</strong>
        <pre className="whitespace-pre-wrap break-all">{JSON.stringify(attributes, null, 2)}</pre>
      </div>
      {/* Lista de requisitos dinámicos */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">Requisitos para el registro</h3>
        {loading && <p className="text-sm text-gray-500">Cargando requisitos...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-200">
            {attributes.length === 0 && <li>No hay requisitos disponibles.</li>}
            {attributes.map((attr: any, idx: number) => (
              <li key={attr.id || idx}>{attr.name}</li>
            ))}
          </ul>
        )}
      </div>
      <form className="space-y-4">
        {attributes.map((attr: any, idx: number) => (
          <div key={attr.id || idx}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{attr.name}</label>
            <input type="file" className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-200 dark:bg-gray-800 dark:border-gray-600" name={attr.slug || attr.name} />
          </div>
        ))}
        <button  className="mt-4 px-6 py-2 bg-[#F5D238] text-[#1A1B16] font-bold rounded-lg shadow hover:bg-yellow-400 transition">Enviar documentos</button>
      </form>
      <div className="mt-6">
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">Opciones adicionales</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-200">
          <li>Solicitar ayuda para subir documentos</li>
          <li>Ver requisitos de registro</li>
          <li>Contactar soporte</li>
        </ul>
      </div>
    </div>
  );
};

export default ContractorProfileStatus;
