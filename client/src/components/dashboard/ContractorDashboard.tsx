import React, { useEffect, useState } from "react";
import type { 
  ContractorDashboardProps, 
  ContractorStats, 
  TeamMember,
  DashboardData
} from "@/types/dashboard";
import { ContractorService } from '@/core/services/contractor/contractor.service';
import { AttributeContractorUploadService } from '@/core/services/contractor/attributeContractorUpload.service';

import StatCard from "./StatCard";
import ContractorTeam from "./ContractorTeam";
import EarningsOverview from "./EarningsOverview";
import ContractorProfile from "./ContractorProfile";
import UploadedDocumentItem from "./UploadedDocumentItem";

const ContractorDashboard = ({ user }: ContractorDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [contractorStats, setContractorStats] = useState<ContractorStats>({
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: "$0",
    monthlyEarnings: "$0",
    averageRating: 0,
    totalReviews: 0,
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [attributes, setAttributes] = useState<any[]>([]);
  const [uploadedAttributes, setUploadedAttributes] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [editingUploadId, setEditingUploadId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  
  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';
  
  const getDocumentUrl = (value: string): string => {
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `${API_BASE}/${value.replace(/^\/?api(\/|$)/, '')}`;
  };
  /* ===================== DATA ===================== */

  // Fetch dashboard data
  useEffect(() => {
    if (user?.verification) {
      ContractorService.getDashboard()
        .then((res: any) => {
          console.log(res);
          const data = res?.data?.data || res?.data || res;
          setDashboardData(data);
          
          // Map team members
          if (data?.team_members) {
            const mappedTeamMembers: TeamMember[] = data.team_members.map((member: any) => ({
              user_id: member.user_id || member.id,
              name: member.user?.name || member.name || 'Unknown',
              role: member.professions?.[0]?.name || 'Team Member',
              avatar: member.user?.name?.substring(0, 2).toUpperCase() || 'TM',
              status: 'offline' as const,
              user: member.user,
              professions: member.professions,
            }));
            setTeamMembers(mappedTeamMembers);
          }

          // Map statistics
          if (data?.statistics) {
            const stats = data.statistics;
            setContractorStats({
              activeJobs: data.jobs?.filter((j: any) => j.is_active).length || 0,
              completedJobs: data.jobs?.filter((j: any) => !j.is_active).length || 0,
              totalEarnings: `$${stats.total_paid?.toLocaleString() || '0'}`,
              monthlyEarnings: `$${stats.average_paid?.toLocaleString() || '0'}`,
              averageRating: 4.8, // TODO: Calculate from reviews if available
              totalReviews: stats.jobs_count || 0,
            });
          }

          setError(null);
        })
        .catch((err) => {
          console.error('Failed to load dashboard data:', err);
          setError("Failed to load dashboard data");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.verification]);

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
      .catch(() => setError("Failed to load requirements"))
      .finally(() => setLoading(false));
  }, [user?.verification]);

  useEffect(() => {
    const contractorId = user?.id || user?.user_id;
    if (!contractorId) return;

    AttributeContractorUploadService.getByContractor(contractorId)
      .then((res: any) => {
        const candidates = res?.data?.data ?? res?.data ?? res;
        setUploadedAttributes(Array.isArray(candidates) ? candidates : []);
      })
      .catch(() => setUploadedAttributes([]));
  }, [user?.id, user?.user_id, submitSuccess]);

  /* ===================== HELPERS ===================== */

  const handleFileChange = (key: string, file?: File | null) => {
    if (!file) {
      setSelectedFiles(prev => ({ ...prev, [key]: null }));
      return;
    }

    // Validar tipo de archivo (MIME type)
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'jpg', 'jpeg'];
    
    const isValidMimeType = allowedMimeTypes.includes(file.type);
    const isValidExtension = fileExtension && allowedExtensions.includes(fileExtension);
    
    if (!isValidMimeType || !isValidExtension) {
      setSubmitError('Only PDF and JPG/JPEG files are accepted');
      setTimeout(() => setSubmitError(null), 3000);
      return;
    }

    setSelectedFiles(prev => ({ ...prev, [key]: file }));
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

  /* ===================== PDF EXPORT ===================== */

  const handleExportPdf = async () => {
    try {
      setExportingPdf(true);
      
      // Get user data from localStorage
      const userDataStr = localStorage.getItem('user_data');
      if (!userDataStr) {
        alert('User data not found');
        return;
      }
      
      const userData = JSON.parse(userDataStr);
      const contractorId = userData.id;
      
      if (!contractorId) {
        alert('Contractor ID not found');
        return;
      }

      // Call API to get PDF blob
      const blob = await ContractorService.exportPdfCV(contractorId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contractor_cv_${contractorId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    } finally {
      setExportingPdf(false);
    }
  };

  /* ===================== EDIT DOCUMENT ===================== */

  const handleEditSubmit = async (uploadId: number, attributeId: number, file: File | null) => {
    if (!file) {
      setSubmitError("Please select a file to replace");
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const contractorId = user?.id || user?.user_id;
      if (!contractorId) {
        throw new Error("Contractor not found");
      }

      const response = await AttributeContractorUploadService.updateDocument(
        uploadId,
        contractorId,
        attributeId,
        file,
        localStorage.getItem("token") || localStorage.getItem("_tkn") || "",
        {
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              setUploadProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
            }
          },
        }
      );

      setSubmitSuccess("Document updated successfully");
      setEditingUploadId(null);
      setSelectedFiles({});
      setUploadProgress(null);

      // Recargar documentos subidos
      if (contractorId) {
        const res = await AttributeContractorUploadService.getByContractor(contractorId);

        const data = res?.data?.data ?? res?.data ?? res;
        setUploadedAttributes(Array.isArray(data) ? data : []);
      }

      console.log("Document updated:", response);
    } catch (err: any) {
      console.error("Edit error:", err);
      setSubmitError(err.message || "Update failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ===================== SUBMIT ===================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const contractorId = user?.id || user?.user_id;
      if (!contractorId) throw new Error("Contractor not found");

      const payload = attributes
        .map(attr => ({
          attribute_id: Number(attr.id),
          value: selectedFiles[attr.slug || attr.name] ?? null,
        }))
        .filter(p => p.value !== null);
      
      console.log("Payload:", payload);
      
      if (!payload.length) throw new Error("Select at least one file");

      const response = await AttributeContractorUploadService.upload(
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

      const successMessage =
        response?.data?.message ||
        response?.data?.detail ||
        "Documents submitted successfully";

      console.log(response);

      setSubmitSuccess(successMessage);
      setSelectedFiles({});
      setUploadProgress(null);
    } catch (err: any) {
      console.log("Submission error:", err);
      setSubmitError(err.message || "Submission failed");
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
                  📄 Required documentation
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Upload the documents to validate your profile
                </p>
              </header>

              {loading && <p className="text-sm text-gray-500">Loading requirements...</p>}
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
                          ✔ View uploaded document
                        </button>
                      ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-yellow-300 rounded-xl p-5 cursor-pointer hover:bg-yellow-50 transition">
                          <span className="material-icons text-3xl text-yellow-500">
                            upload_file
                          </span>
                          <span className="text-sm font-semibold mt-2">
                            Select file
                          </span>
                          <input
                            type="file"
                            hidden
                            accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg,image/jpg"
                            onChange={e =>
                              handleFileChange(key, e.target.files?.[0] ?? null)
                            }
                          />
                        </label>
                      )}

                      {selectedFiles[key] && !uploaded?.value && (
                        <p className="text-sm text-green-600 mt-2">
                          Selected file: {selectedFiles[key]?.name}
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
                    {submitLoading ? "Submitting..." : "Submit documents"}
                  </button>
                )}

                {uploadProgress !== null && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Uploading</span>
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
                <section className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-yellow-100">
                    ✅ Submitted Documents ({uploadedAttributes.length})
                  </h3>
                  <ul className="space-y-4">
                    {uploadedAttributes.map(item => {
                      const isEditing = editingUploadId === item.id;
                      const editKey = `edit-${item.id}`;

                      return (
                        <div key={item.id || `${item.attribute_id}-${item.value}`} className="border rounded-xl p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                  Editing: {item.attribute?.name || `Document #${item.attribute_id}`}
                                </p>
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-5 cursor-pointer hover:bg-blue-50 transition">
                                  <span className="material-icons text-3xl text-blue-500">
                                    upload_file
                                  </span>
                                  <span className="text-sm font-semibold mt-2">Select new file</span>
                                  <input
                                    type="file"
                                    hidden
                                    accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg,image/jpg"
                                    onChange={event => handleFileChange(editKey, event.target.files?.[0] ?? null)}
                                  />
                                </label>
                              </div>

                              {selectedFiles[editKey] && (
                                <p className="text-sm text-green-600">
                                  New file: {selectedFiles[editKey]?.name}
                                </p>
                              )}

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditSubmit(item.id, item.attribute_id, selectedFiles[editKey] || null)}
                                  disabled={submitLoading || !selectedFiles[editKey]}
                                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
                                >
                                  {submitLoading ? "Updating..." : "Save"}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingUploadId(null);
                                    setSelectedFiles(prev => ({ ...prev, [editKey]: null }));
                                  }}
                                  className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
                                >
                                  Cancel
                                </button>
                              </div>

                              {uploadProgress !== null && (
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Updating</span>
                                    <span>{uploadProgress}%</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full">
                                    <div
                                      className="h-2 bg-blue-400 rounded-full"
                                      style={{ width: `${uploadProgress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <UploadedDocumentItem
                              key={item.id || `${item.attribute_id}-${item.value}`}
                              item={item}
                              allRequirementsUploaded={allRequirementsUploaded}
                              getDocumentUrl={getDocumentUrl}
                              setPdfViewerUrl={setPdfViewerUrl}
                              onEdit={() => setEditingUploadId(item.id)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </ul>
                </section>
              )}
            </section>
          )}

          {user?.verification && (
            <>
              {/* Export CV Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleExportPdf}
                  disabled={exportingPdf}
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span className="material-icons text-xl">
                    {exportingPdf ? 'hourglass_empty' : 'download'}
                  </span>
                  {exportingPdf ? 'Exporting...' : 'Export CV as PDF'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                  title="Active" 
                  value={contractorStats.activeJobs.toString()} 
                  subtitle="Active jobs" 
                />
                <StatCard 
                  title="Completed" 
                  value={contractorStats.completedJobs.toString()} 
                  subtitle="Finished jobs" 
                />
                <StatCard 
                  title="Total Earned" 
                  value={contractorStats.totalEarnings} 
                  subtitle="Total earnings" 
                />
              </div>

              {dashboardData && (
                <>
                  <EarningsOverview contractorStats={contractorStats} />
                  <ContractorTeam teamMembers={teamMembers} />
                  
                  {/* Jobs Summary */}
                  {dashboardData.jobs && dashboardData.jobs.length > 0 && (
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-yellow-200 mb-4">
                        Recent Jobs
                      </h2>
                      <div className="space-y-3">
                        {dashboardData.jobs.map((job) => (
                          <div 
                            key={job.id} 
                            className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                <p className="text-sm text-gray-600">
                                  {job.service_type} • {job.location}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(job.job_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">
                                  ${job.amount_paid.toLocaleString()}
                                </p>
                                <span 
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    job.is_active 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {job.is_active ? 'Active' : 'Completed'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Jobs by Service Type */}
                  {dashboardData.jobs_summary?.by_service_type && 
                   dashboardData.jobs_summary.by_service_type.length > 0 && (
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-yellow-200 mb-4">
                        Jobs by Service Type
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dashboardData.jobs_summary.by_service_type.map((summary, idx) => (
                          <div 
                            key={idx} 
                            className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800"
                          >
                            <h3 className="font-semibold text-lg">{summary.service_type}</h3>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm">
                                <span className="text-gray-600">Jobs:</span>{' '}
                                <span className="font-semibold">{summary.jobs_count}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-600">Total:</span>{' '}
                                <span className="font-semibold text-green-600">
                                  ${summary.total_paid.toLocaleString()}
                                </span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-600">Average:</span>{' '}
                                <span className="font-semibold">
                                  ${summary.avg_paid.toLocaleString()}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}

              <ContractorProfile />
            </>
          )}
        </main>

       
      </div>
    </div>
  );
};

export default ContractorDashboard;