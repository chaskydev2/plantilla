import React, { useEffect, useState } from "react";
import type { ContractorDashboardProps, ContractorStats, TeamMember } from "@/types/dashboard";
import { ContractorService } from '@/core/services/contractor/contractor.service';
import { AttributeContractorUploadService } from '@/core/services/contractor/attributeContractorUpload.service';

import StatCard from "./StatCard";
import ContractorTeam from "./ContractorTeam";
import EarningsOverview from "./EarningsOverview";
import ContractorProfile from "./ContractorProfile";
import QuickActionsPanel from "./QuickActionsPanel";
import SupportChat from "./SupportChat";
import UploadedDocumentItem from "./UploadedDocumentItem";

const ContractorDashboard = ({ user }: ContractorDashboardProps) => {
  const [contractorStats] = useState<ContractorStats>({
    activeJobs: 8,
    completedJobs: 45,
    totalEarnings: "$12,450",
    monthlyEarnings: "$3,200",
    averageRating: 4.8,
    totalReviews: 28,
  });

  const teamMembers: TeamMember[] = [
    { name: "Carlos Martinez", role: "Lead Electrician", avatar: "CM", status: "online" },
    { name: "Ana Rodriguez", role: "Assistant", avatar: "AR", status: "online" },
    { name: "Juan Perez", role: "Helper", avatar: "JP", status: "offline" },
  ];

  const [attributes, setAttributes] = useState<any[]>([]);
  const [uploadedAttributes, setUploadedAttributes] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);

  const getDocumentUrl = (value: string) => `http://127.0.0.1:8000/${value}`;

  /* ===================== DATA ===================== */

  useEffect(() => {
    if (user?.verification) {
      setLoading(false);
      return;
    }

    ContractorService.getAttributesForContractors()
      .then((res: any) => {
        setAttributes(res?.data?.data || res?.data || res || []);
        setError(null);
      })
      .catch(() => setError("Error al cargar los requisitos"))
      .finally(() => setLoading(false));
  }, [user?.verification]);

  useEffect(() => {
    const contractorId = user?.id || user?.user_id;
    if (!contractorId) return;

    AttributeContractorUploadService.getByContractor(contractorId)
      .then((res: any) => setUploadedAttributes(res?.data || res || []))
      .catch(() => setUploadedAttributes([]));
  }, [user?.id, user?.user_id, submitSuccess]);

  /* ===================== HELPERS ===================== */

  const handleFileChange = (key: string, file?: File | null) => {
    setSelectedFiles(prev => ({ ...prev, [key]: file ?? null }));
  };

  const allRequirementsUploaded =
    attributes.length > 0 &&
    attributes.every(attr =>
      uploadedAttributes.some(
        ua =>
          (ua.attribute_id === attr.id ||
            ua.attribute?.id === attr.id) &&
          ua.value
      )
    );

  /* ===================== SUBMIT ===================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const contractorId = user?.id || user?.user_id;
      if (!contractorId) throw new Error("Contractor no encontrado");

      const payload = attributes
        .map(attr => ({
          attribute_id: Number(attr.id),
          value: selectedFiles[attr.slug || attr.name] ?? null,
        }))
        .filter(p => p.value !== null);

      if (!payload.length) throw new Error("Selecciona al menos un archivo");

      await AttributeContractorUploadService.upload(
        contractorId,
        payload,
        localStorage.getItem("token") || localStorage.getItem("_tkn") || "",
        {
          onUploadProgress: (e: any) => {
            if (e.total) {
              setUploadProgress(Math.round((e.loaded * 100) / e.total));
            }
          },
        }
      );

      setSubmitSuccess("Documentos enviados correctamente");
      setSelectedFiles({});
      setUploadProgress(null);
    } catch (err: any) {
      setSubmitError(err.message || "Error al enviar");
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ===================== RENDER ===================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* PDF MODAL */}
      {pdfViewerUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setPdfViewerUrl(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[80vh]"
            onClick={e => e.stopPropagation()}
          >
            <iframe src={pdfViewerUrl} className="w-full h-full rounded-2xl" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        <main className="flex-1 space-y-8">
          {!user?.verification && (
            <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-yellow-200">
              <header className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-yellow-200">
                  📄 Documentación requerida
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Sube los documentos para validar tu perfil
                </p>
              </header>

              {loading && <p className="text-sm text-gray-500">Cargando requisitos...</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-5">
                {attributes.map(attr => {
                  const key = attr.slug || attr.name;
                  const uploaded = uploadedAttributes.find(
                    ua => ua.attribute_id === attr.id || ua.attribute?.id === attr.id
                  );

                  return (
                    <div key={attr.id} className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
                      <p className="font-semibold mb-2">{attr.name}</p>

                      {uploaded?.value ? (
                        <button
                          type="button"
                          onClick={() => setPdfViewerUrl(getDocumentUrl(uploaded.value))}
                          className="text-green-600 font-semibold underline"
                        >
                          ✔ Ver documento enviado
                        </button>
                      ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-yellow-300 rounded-xl p-5 cursor-pointer hover:bg-yellow-50 transition">
                          <span className="material-icons text-3xl text-yellow-500">
                            upload_file
                          </span>
                          <span className="text-sm font-semibold mt-2">
                            Seleccionar archivo
                          </span>
                          <input
                            type="file"
                            hidden
                            onChange={e =>
                              handleFileChange(key, e.target.files?.[0] ?? null)
                            }
                          />
                        </label>
                      )}

                      {selectedFiles[key] && !uploaded?.value && (
                        <p className="text-sm text-green-600 mt-2">
                          Archivo seleccionado: {selectedFiles[key]?.name}
                        </p>
                      )}
                    </div>
                  );
                })}

                {!allRequirementsUploaded && (
                  <button
                    disabled={submitLoading}
                    className="w-full py-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-lg"
                  >
                    {submitLoading ? "Enviando..." : "Enviar documentos"}
                  </button>
                )}

                {uploadProgress !== null && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Subiendo</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-yellow-400 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {submitSuccess && <p className="text-green-600">{submitSuccess}</p>}
                {submitError && <p className="text-red-600">{submitError}</p>}
              </form>

              {uploadedAttributes.length > 0 && (
                <section className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-yellow-100">
                    Documentos enviados
                  </h3>
                  <ul className="space-y-2">
                    {uploadedAttributes.map(item => (
                      <UploadedDocumentItem
                        key={item.id || `${item.attribute_id}-${item.value}`}
                        item={item}
                        allRequirementsUploaded={allRequirementsUploaded}
                        getDocumentUrl={getDocumentUrl}
                        setPdfViewerUrl={setPdfViewerUrl}
                      />
                    ))}
                  </ul>
                </section>
              )}
            </section>
          )}

          {user?.verification && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Activos" value="8" subtitle="Trabajos activos" />
                <StatCard title="Completados" value="45" subtitle="Finalizados" />
                <StatCard title="Rating" value="4.8/5" subtitle="Calificación" />
              </div>

              <EarningsOverview contractorStats={contractorStats} />
              <ContractorTeam teamMembers={teamMembers} />
              <ContractorProfile />
            </>
          )}
        </main>

        {user?.edit_profile && (
          <aside className="w-full lg:w-96 space-y-6">
            <QuickActionsPanel />
            <SupportChat />
          </aside>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;