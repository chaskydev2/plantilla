import React, { useEffect, useState } from "react";
import type { AxiosProgressEvent } from "axios";
import type { User } from "@/types/dashboard";
import { AttributeHomeownerService } from "@/core/services/homeowner/attributeHomeowner.service";
import { AttributeHomeownerUploadService } from "@/core/services/homeowner/attributeHomeownerUpload.service";
import { DashboardHomeownerService } from "@/core/services/homeowner/dashboardHomeowner.service";

import StatCard from "./StatCard";
import UploadedDocumentItem from "./UploadedDocumentItem";

interface HomeOwnerDashboardProps {
  user?: User | null;
}

const HomeOwnerDashboard: React.FC<HomeOwnerDashboardProps> = ({ user }) => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [uploadedAttributes, setUploadedAttributes] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [editingAttributeId, setEditingAttributeId] = useState<number | null>(null);
  const [editingUploadId, setEditingUploadId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);

  // Dashboard data
  const [dashLoading, setDashLoading] = useState<boolean>(false);
  const [dashError, setDashError] = useState<string | null>(null);
  const [homeProfile, setHomeProfile] = useState<any | null>(null);
  const [statistics, setStatistics] = useState<{ services_count?: number; job_posts_count?: number; scam_alerts_count?: number }>({});
  const [services, setServices] = useState<any[]>([]);
  const [recentJobPosts, setRecentJobPosts] = useState<any[]>([]);
  const [recentClaims, setRecentClaims] = useState<any[]>([]);

  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';

  const homeownerProfile: any =
    (user as any)?.homeowner_profile ||
    (user as any)?.homeownerProfile ||
    (user as any)?.profile ||
    null;

  const homeownerId: number | null =
    homeownerProfile?.id ||
    homeownerProfile?.homeowner_id ||
    homeownerProfile?.user_id ||
    (user as any)?.homeowner_id ||
    user?.id ||
    (user as any)?.user_id ||
    null;

  const userId = (user as any)?.id ?? null;
  const userAltId = (user as any)?.user_id ?? null;

  const isVerified = Boolean(
    (user as any)?.verification ||
      homeownerProfile?.verification ||
      homeownerProfile?.verified_at
  );

  const displayName =
    homeownerProfile?.first_name && homeownerProfile?.last_name
      ? `${homeownerProfile.first_name} ${homeownerProfile.last_name}`
      : user?.name || user?.email || "";

  const getDocumentUrl = (value: string): string => {
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `${API_BASE}/${value.replace(/^\/?api(\/|$)/, '')}`;
  };

  const extractArray = (source: any): any[] => {
    if (!source) return [];

    if (Array.isArray(source)) {
      return source;
    }

    if (typeof source === "object") {
      for (const value of Object.values(source)) {
        const candidate = extractArray(value);
        if (candidate.length) {
          return candidate;
        }
      }
    }

    return [];
  };

  const normalizeAttributes = (items: any[]): any[] => {
    const uniqueMap = new Map<number, any>();

    items
      .map(item => {
        if (item?.attribute) {
          return {
            ...item.attribute,
            id: item.attribute.id ?? item.attribute.attribute_id,
            slug: item.attribute.slug ?? item.attribute.key ?? item.attribute.name,
          };
        }

        if (item?.attribute_id && item?.name) {
          return {
            ...item,
            id: item.attribute_id,
            slug: item.slug || item.key || item.code || item.name,
          };
        }

        return item;
      })
      .filter(attr => attr && (attr.id || attr.attribute_id))
      .forEach(attr => {
        const attrId = Number(attr.id || attr.attribute_id);
        if (Number.isNaN(attrId)) return;

        if (!uniqueMap.has(attrId)) {
          uniqueMap.set(attrId, {
            ...attr,
            id: attrId,
            name:
              attr.name ||
              attr.title ||
              attr.attribute_name ||
              attr.label ||
              `Requirement #${attrId}`,
            slug: attr.slug || attr.key || attr.code || attr.name || String(attrId),
          });
        }
      });

    return Array.from(uniqueMap.values());
  };

  useEffect(() => {
    let isMounted = true;

    const fetchRequirements = async () => {
      if (isVerified) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const fallback = async () => {
          const res = await AttributeHomeownerService.getCatalog();
          const fallbackList = extractArray(res);
          return normalizeAttributes(fallbackList);
        };

        const fetchByHomeowner = async () => {
          if (!homeownerId) return [];
          const res = await AttributeHomeownerService.getByHomeowner(Number(homeownerId));
          return normalizeAttributes(extractArray(res));
        };

        const fetchByUser = async () => {
          const identifier =
            (user as any)?.user_id ||
            (user as any)?.id ||
            homeownerProfile?.user_id;

          if (!identifier) return [];
          const res = await AttributeHomeownerService.getByUser(Number(identifier));
          return normalizeAttributes(extractArray(res));
        };

        let normalizedAttributes = await fetchByHomeowner();

        
        if (!normalizedAttributes.length) {
          normalizedAttributes = await fetchByUser();
        }

        if (!normalizedAttributes.length) {
          normalizedAttributes = await fallback();
        }

        if (isMounted) {
          setAttributes(normalizedAttributes);
          setError(normalizedAttributes.length ? null : "No requirements found");
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to load requirements");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRequirements();

    return () => {
      isMounted = false;
    };
  }, [isVerified, homeownerId, userId, userAltId]);

  // Fetch dashboard data (stats, services, recent items)
  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      setDashLoading(true);
      setDashError(null);
      try {
        const res = await DashboardHomeownerService.getMyDashboard();
        console.log(res);
        const data: any = (res as any)?.data ?? res;
        const payload = data?.data ?? data; // tolerate wrapped shapes

        if (!isMounted) return;

        setHomeProfile(payload?.homeowner_profile || null);
        setStatistics(payload?.statistics || {});
        setServices(Array.isArray(payload?.services) ? payload.services : []);
        setRecentJobPosts(Array.isArray(payload?.recent_job_posts) ? payload.recent_job_posts : []);
        setRecentClaims(Array.isArray(payload?.recent_scam_alerts) ? payload.recent_scam_alerts : []);
      } catch (e: any) {
        if (isMounted) setDashError(e?.message || "Failed to load dashboard");
      } finally {
        if (isMounted) setDashLoading(false);
      }
    };

    // Load dashboard always; UI shows it when verified
    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [userId, homeownerId]);

  useEffect(() => {
    if (!homeownerId) return;

    AttributeHomeownerUploadService.getByHomeowner(homeownerId)
      .then(res => {
        const data = res?.data?.data ?? res?.data ?? res;
        setUploadedAttributes(Array.isArray(data) ? data : []);
      })
      .catch(() => setUploadedAttributes([]));
  }, [homeownerId, submitSuccess]);

  const handleFileChange = (key: string, file?: File | null) => {
    if (!file) {
      setSelectedFiles(prev => ({ ...prev, [key]: null }));
      return;
    }

    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setSubmitError('Only PDF and JPG files are accepted');
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
          (ua.attribute_id === attr.id || ua.attribute?.id === attr.id) &&
          ua.value
      )
    );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      if (!homeownerId) {
        throw new Error("Homeowner not found");
      }

      const payload = attributes
        .map(attr => ({
          attribute_id: Number(attr.id),
          value: selectedFiles[attr.slug || attr.name] ?? null,
        }))
        .filter(item => item.value !== null);

      if (!payload.length) {
        throw new Error("Select at least one file");
      }

      const response = await AttributeHomeownerUploadService.upload(
        homeownerId,
        payload,
        localStorage.getItem("token") ||
          localStorage.getItem("_tkn") ||
          "",
        {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              setUploadProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
            }
          },
        }
      );

      const successMessage =
        response?.data?.message ||
        response?.data?.detail ||
        "Documents submitted successfully";

      setSubmitSuccess(successMessage);
      setSelectedFiles({});
      setUploadProgress(null);
    } catch (err: any) {
      setSubmitError(err.message || "Submission failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (uploadId: number, attributeId: number, file: File | null) => {
    if (!file) {
      setSubmitError("Please select a file to replace");
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      if (!homeownerId) {
        throw new Error("Homeowner not found");
      }

      await AttributeHomeownerUploadService.updateDocument(
        uploadId,
        homeownerId,
        attributeId,
        file,
        localStorage.getItem("token") || localStorage.getItem("_tkn") || "",
        {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              setUploadProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
            }
          },
        }
      );

      setSubmitSuccess("Document updated successfully");
      setEditingAttributeId(null);
      setEditingUploadId(null);
      setSelectedFiles({});
      setUploadProgress(null);

      // Recargar documentos subidos
      const res = await AttributeHomeownerUploadService.getByHomeowner(homeownerId);
      const data = res?.data?.data ?? res?.data ?? res;
      setUploadedAttributes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setSubmitError(err.message || "Update failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {pdfViewerUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setPdfViewerUrl(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[80vh]"
            onClick={event => event.stopPropagation()}
          >
            <iframe src={pdfViewerUrl} className="w-full h-full rounded-2xl" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        <main className="flex-1 space-y-8">
          {!isVerified && (
            <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-yellow-200">
              <header className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-yellow-200">
                  Required documentation
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Upload the documents needed to verify your homeowner account.
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
                  const isEditing = editingAttributeId === attr.id;

                  return (
                    <div key={attr.id} className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
                      <p className="font-semibold mb-2">{attr.name}</p>

                      {uploaded?.value && !isEditing ? (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => setPdfViewerUrl(getDocumentUrl(uploaded.value))}
                            className="text-green-600 font-semibold underline"
                          >
                            ✔ View uploaded document
                          </button>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingAttributeId(attr.id)}
                              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-yellow-300 rounded-xl p-5 cursor-pointer hover:bg-yellow-50 transition">
                            <span className="material-icons text-3xl text-yellow-500">
                              upload_file
                            </span>
                            <span className="text-sm font-semibold mt-2">
                              {isEditing ? 'Replace file' : 'Select file'}
                            </span>
                            <input
                              type="file"
                              hidden
                              accept="application/pdf,image/jpeg"
                              onChange={event => handleFileChange(key, event.target.files?.[0] ?? null)}
                            />
                          </label>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAttributeId(null);
                                setSelectedFiles(prev => ({ ...prev, [key]: null }));
                              }}
                              className="w-full px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      )}

                      {selectedFiles[key] && (
                        <p className="text-sm text-green-600 mt-2">
                          {isEditing ? 'New file selected:' : 'Selected file:'} {selectedFiles[key]?.name}
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
                                    accept="application/pdf,image/jpeg"
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

          {isVerified && (
            <>
              <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-yellow-200">
                  Welcome{displayName ? `, ${displayName}` : ""}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Manage your projects, schedule visits, and save your favorite contractors.
                </p>
                {homeProfile && (
                  <p className="mt-1 text-xs text-gray-500">
                    Location: {homeProfile.city ?? '-'}, {homeProfile.state_code ?? '-'}, {homeProfile.country_code ?? '-'}
                  </p>
                )}
                {dashError && (
                  <p className="mt-2 text-sm text-red-600">{dashError}</p>
                )}
              </section>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Interested Services" value={String(statistics?.services_count ?? 0)} subtitle="Saved interests" />
                <StatCard title="Job Posts" value={String(statistics?.job_posts_count ?? 0)} subtitle="Created by you" />
                <StatCard title="Claims" value={String(statistics?.scam_alerts_count ?? 0)} subtitle="Reported issues" />
              </div>

              <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-yellow-200">Interested Services</h3>
                {dashLoading && <p className="text-sm text-gray-500 mt-2">Loading services...</p>}
                {!dashLoading && services.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No interested services yet.</p>
                )}
                <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.slice(0, 8).map((svc: any) => (
                    <li key={svc.id ?? `${svc?.service_id}-${svc?.profession_id}`}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border">
                      <p className="font-medium">{svc.name ?? svc.title ?? svc.service_name ?? 'Service'}</p>
                      {svc.profession?.name && (
                        <p className="text-xs text-gray-500">Profession: {svc.profession.name}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-yellow-200">Recent Job Posts</h3>
                {dashLoading && <p className="text-sm text-gray-500 mt-2">Loading job posts...</p>}
                {!dashLoading && recentJobPosts.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No recent job posts.</p>
                )}
                <ul className="mt-3 space-y-2">
                  {recentJobPosts.slice(0, 5).map((jp: any) => (
                    <li key={jp.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border">
                      <p className="font-medium">{jp.title ?? jp.name ?? 'Job Post'}</p>
                      {jp.created_at && (
                        <p className="text-xs text-gray-500">Created: {new Date(jp.created_at).toLocaleString()}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-yellow-200">Recent Claims</h3>
                {dashLoading && <p className="text-sm text-gray-500 mt-2">Loading claims...</p>}
                {!dashLoading && recentClaims.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No recent claims.</p>
                )}
                <ul className="mt-3 space-y-2">
                  {recentClaims.slice(0, 5).map((c: any) => (
                    <li key={c.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border">
                      <p className="font-medium">{c.title ?? c.subject ?? 'Claim'}</p>
                      {c.created_at && (
                        <p className="text-xs text-gray-500">Reported: {new Date(c.created_at).toLocaleString()}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </main>

 
      </div>
    </div>
  );
};

export default HomeOwnerDashboard;
