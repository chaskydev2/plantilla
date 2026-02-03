import { Link, useLocation, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { ArrowLeft, Users, Briefcase, Download, Star } from "lucide-react";

// Servicios
import { ContractorService } from "@/core/services/contractor/contractor.service";
import { ReviewService } from "@/core/services/ReviewService";
import { MessageService } from "@/core/services/messages/message.service"; 

// Tipos
import type { IApiResponse } from "@/core/types/IApi";
import type { ContractorFullInfo, NearbyContractorCard } from "@/types/contractor";
import type { ContractorProfileViewModel } from "@/pages/WebPage/FindPro/utils/contractorProfile";
import { borderPrimary } from "@/components/form-registration";
// Componentes
import { ContractorProfileSkeleton } from "@/pages/WebPage/FindPro/components/contractor-profile/ContractorProfileSkeleton";
import { ContractorPrimaryInfo } from "@/pages/WebPage/FindPro/components/contractor-profile/ContractorPrimaryInfo";
import {
  ContractorChatAside,
  type ChatMessage,
} from "@/pages/WebPage/FindPro/components/contractor-profile/ContractorChatAside";
import { NearbyContractorsSection } from "@/pages/WebPage/FindPro/components/contractor-profile/NearbyContractorsSection";

// Utils
import {
  createContractorProfileViewModel,
  extractList,
  mapNearbyContractor,
} from "@/pages/WebPage/FindPro/utils/contractorProfile";

export default function ContractorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Estados de Datos
  const [contractor, setContractor] = useState<ContractorFullInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageDraft, setMessageDraft] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(true);

  // Estados de Nearby Contractors
  const [nearbyContractors, setNearbyContractors] = useState<NearbyContractorCard[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState<string | null>(null);

  // Estado de Rating
  const [currentRating, setCurrentRating] = useState(0);
  const [exportingCv, setExportingCv] = useState(false);
  const [isHomeowner, setIsHomeowner] = useState(false);
  const [cvRating, setCvRating] = useState(0);
 
  const [isContractor, setIsContractor] = useState(false);

  // Traer la review previa del homeowner para este contractor
  const fetchMyReview = useCallback(async (contractorId: number) => {
    try {
      const api = await ReviewService.getMyReview(contractorId);
      if (api?.success && api.data) {
        setCvRating(api.data.rating ?? 0);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setCvRating(0);
        return;
      }
      console.error("Failed to load my review:", err);
    }
  }, []);
  // ViewModel
  const profile = useMemo<ContractorProfileViewModel | null>(
    () => (contractor ? createContractorProfileViewModel(contractor) : null),
    [contractor],
  );

  // Lógica del botón "Atrás"
  const backLinkTarget = useMemo(() => {
    const state = location.state as { from?: { pathname: string; search?: string } } | null;
    if (state?.from) {
      return {
        pathname: state.from.pathname,
        search: state.from.search ?? "",
      };
    }
    if (location.search) {
      return { pathname: "/findpro", search: location.search };
    }
    return "/findpro";
  }, [location.state, location.search]);

  // Verificar si el usuario es homeowner o contractor
  useEffect(() => {
    try {
      const userDataStr = localStorage.getItem("user_data");
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        const roleName = userData.role_name?.toLowerCase() || "";
        const roles = userData.roles || [];
        const hasHomeownerRole = roleName.includes("homeowner") ||
          roles.some((role: any) => role.name?.toLowerCase() === "homeowner");
        setIsHomeowner(hasHomeownerRole);

        const hasContractorRole = roleName.includes("contractor") ||
          roles.some((role: any) => role.name?.toLowerCase() === "contractor");
        setIsContractor(hasContractorRole);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  }, []);

  // --- 1. CARGA INICIAL DEL CONTRACTOR ---
  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    ContractorService.getFullInfo(id)
      .then((response) => {
        if (!active) return;
        const api = response as IApiResponse<ContractorFullInfo>;
        if (!api?.success || !api.data) {
          throw new Error(api?.message || "Contractor data unavailable");
        }
        setContractor(api.data);
      })
      .catch((err: any) => {
        if (!active) return;
        const message = err?.response?.data?.message || err?.message || "Unable to load contractor";
        setError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  // --- 1.1 CARGA DE MI REVIEW (para prellenar las estrellas) ---
  useEffect(() => {
    if (!isHomeowner || !id) return;
    const contractorId = contractor?.user_id ?? contractor?.user?.id ?? Number(id);
    if (!contractorId) return;

    fetchMyReview(contractorId);
  }, [contractor?.user_id, contractor?.user?.id, fetchMyReview, id, isHomeowner]);

  // --- 2. CARGA DE MENSAJES DEL CHAT ---
  useEffect(() => {
    if (!isHomeowner || !id || !profile) return;
    let active = true;
    const controller = new AbortController();

    setIsLoadingChat(true);
    console.log("🔄 Loading chat messages for contractor ID:", id);

    MessageService.getConversation(id, { signal: controller.signal })
      .then((response) => {
        if (!active) return;
        console.log("📨 Chat response:", response);
        const api = response as IApiResponse<any>;
        if (!api?.success) {
          console.log("⚠️ API response not successful, showing welcome message");
          // Si no hay éxito, mostrar mensaje de bienvenida
          setChatMessages([
            {
              id: Date.now(),
              sender: "support",
              text: `Hi ${profile.displayName}, we are here to help. What do you need today?`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setIsLoadingChat(false);
          return;
        }

        const data = api.data;
        console.log("📦 Chat data:", data);
        if (data?.messages && Array.isArray(data.messages) && data.messages.length > 0) {
          console.log("✅ Found", data.messages.length, "messages");
          const mappedMessages: ChatMessage[] = data.messages.map((msg: any) => {
            console.log("Message sender_type:", msg.sender_type);
            return {
              id: msg.id || Date.now(),
              sender: msg.sender_type === "App\\Models\\HomeownerProfile" || msg.sender_type === "HomeownerProfile" ? "homeowner" : "support",
              text: msg.message || "",
              timestamp: msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
          });
          setChatMessages(mappedMessages);
        } else {
          console.log("ℹ️ No messages found, showing welcome message");
          // Si no hay mensajes previos, mostrar mensaje de bienvenida
          setChatMessages([
            {
              id: Date.now(),
              sender: "support",
              text: `Hi ${profile.displayName}, we are here to help. What do you need today?`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }
        setIsLoadingChat(false);
      })
      .catch((err: any) => {
        if (!active || err?.name === "CanceledError") return;
        console.error("❌ Failed to load chat messages:", err);
        // En caso de error, mostrar mensaje de bienvenida
        setChatMessages([
          {
            id: Date.now(),
            sender: "support",
            text: `Hi ${profile.displayName}, we are here to help. What do you need today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsLoadingChat(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, isHomeowner, profile]);

  // --- 3. CARGA DE CONTRACTORS CERCANOS ---
  useEffect(() => {
    if (!id) return;
    let active = true;
    const controller = new AbortController();
    setNearbyLoading(true);
    setNearbyError(null);

    ContractorService.getNearByContractorId(id, {}, { signal: controller.signal })
      .then((response) => {
        if (!active) return;
        const api = response as IApiResponse<any>;
        if (!api?.success) throw new Error(api?.message || "Unable to load nearby contractors");
        
        const list = extractList(api.data);
        const currentId = String(contractor?.user_id ?? contractor?.user?.id ?? id ?? "");
        const mapped = list
          .map(mapNearbyContractor)
          .filter((item): item is NearbyContractorCard => Boolean(item && item.id !== currentId));
        setNearbyContractors(mapped);
      })
      .catch((err: any) => {
        if (!active) return;
        if (err?.name === "CanceledError") return;
        const status = err?.response?.status;
        const backendMessage = err?.response?.data?.message || err?.message;
        if (status === 401) {
          setNearbyError(backendMessage || "Unauthenticated.");
          return;
        }
        setNearbyError(backendMessage || "Unable to load nearby contractors");
      })
      .finally(() => {
        if (active) setNearbyLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [contractor?.user_id, contractor?.user?.id, id]);

  // --- HANDLERS DEL CHAT ---
  const handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageDraft(event.target.value);
  };

  const handleRatingSubmit = async (ratingValue: number) => {
    if (!contractor) return;
    const targetUserId = contractor.user_id ?? contractor.user?.id ?? Number(id);

    try {
      await ReviewService.create({
        contractor_id: targetUserId,
        rating: ratingValue,
      });

      await fetchMyReview(targetUserId);

      if (id) {
        const updatedResponse = await ContractorService.getFullInfo(id);
        const api = updatedResponse as IApiResponse<ContractorFullInfo>;
        if (api.success && api.data) {
          setContractor(api.data);
        }
      }

    } catch (error: any) {
      console.error("Rating error:", error);
      const msg = error.response?.data?.message || "Failed to submit rating.";
      alert(msg);
    }
  };

  const handleExportCv = async () => {
    if (!contractor) return;
    const contractorId = contractor.user_id ?? contractor.user?.id ?? Number(id);
    if (!contractorId) {
      alert("No contractor ID available to export CV.");
      return;
    }
    try {
      setExportingCv(true);
      const response = await ContractorService.exportPdfCV(contractorId);
      const r: any = response;
      const blob = r instanceof Blob
        ? r
        : r?.data instanceof Blob
          ? r.data
          : new Blob([r?.data ?? r], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contractor_cv_${contractorId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("CV export error:", error);
      const msg = error?.response?.data?.message || "No se pudo descargar el CV";
      alert(msg);
    } finally {
      setExportingCv(false);
    }
  };

  // --- RENDER ---

  if (loading) return <ContractorProfileSkeleton />;
  if (error) return <div className="p-8 text-center text-[#ffed00]">{error}</div>;
  if (!contractor || !profile) return <div className="p-8 text-center text-[#ffed00]">Contractor not found.</div>;

  return (
    <div className="min-h-screen bg-[#ffed00] pb-12 overflow-x-hidden">
      <div className="mx-auto w-full max-w-screen-xl px-3 pt-10 sm:px-4 lg:px-8">
        
        {/* Contenedor Principal estilo Tarjeta */}
        <div className="mt-2 overflow-hidden rounded-3xl border border-[#1E1E17]/12 bg-white/95 shadow-[0_12px_36px_rgba(30,30,23,0.18)] backdrop-blur">
          
          {/* Header */}
          <div className="border-b border-[#1E1E17]/15 bg-[#1E1E17] px-3 py-3 text-white sm:px-4 lg:px-5">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-0.5">
                <span className="inline-flex items-center rounded-full bg-white/12 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.28em] text-white/70">
                  Profile Overview
                </span>
                <h1 className="text-lg font-bold sm:text-xl">{profile.displayName}</h1>
                <p className="text-[10px] text-white/65 sm:max-w-xl sm:text-xs">
                  Discover verified professionals with transparent information to help homeowners hire confidently.
                </p>
              </div>
              <Link
                to={backLinkTarget}
                className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-[#1E1E17] shadow-[0_6px_14px_rgba(30,30,23,0.18)] transition hover:bg-white/90"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to map
              </Link>
            </div>
          </div>
          
          {/* Grid Principal de 2 Columnas */}
          <div className="grid gap-6 border-b border-[#1E1E17]/8 bg-white px-4 py-8 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-10">
            
            {/* --- COLUMNA IZQUIERDA: Solo Info Principal --- */}
            <div>
              <ContractorPrimaryInfo contractor={contractor} profile={profile} />
            </div>

            {/* --- COLUMNA DERECHA: Chat + Equipo + Trabajos --- */}
            <div className="flex flex-col gap-6">
              
              {/* 1. CHAT (Arriba en la columna derecha) - Solo visible si NO es contractor */}
              {!isContractor && (
                <ContractorChatAside
                  messages={chatMessages}
                  messageDraft={messageDraft}
                  onDraftChange={handleDraftChange}
                  rating={currentRating}
                  onRatingChange={setCurrentRating}
                  onRatingSubmit={handleRatingSubmit}
                  contractorId={contractor?.user_id ?? contractor?.user?.id ?? Number(id) ?? 0}
                  isLoadingChat={isLoadingChat}
                  onMessageSent={(message) => {
                    // Agregar el mensaje a la lista local
                    const newMessage: ChatMessage = {
                      id: message.id || Date.now(),
                      sender: "contractor",
                      text: message.message || messageDraft,
                      timestamp: message.created_at || new Date().toISOString(),
                    };
                    setChatMessages((prev) => [...prev, newMessage]);
                  }}
                />
              )}

              {/* 2. SECCIÓN: NUESTRO EQUIPO (Debajo del chat) */}
            <div className="rounded-3xl border px-8 py-8 shadow-md"
                style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
              >
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#1E1E17]">
                  <Users className="h-5 w-5" />
                  Our Team
                </h3>
                {contractor?.team_members && contractor.team_members.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {contractor.team_members.map((member: any) => (
                      <div key={member.id} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-300">
                          {member.user?.profile_photo_url || member.photo_url ? (
                            <img 
                              src={member.user?.profile_photo_url || member.photo_url} 
                              alt={member.name} 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm font-bold text-gray-500">
                              {member.name?.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-[#1E1E17] text-sm">{member.name}</p>
                          <p className="truncate text-xs text-gray-600">{member.role || "Specialist"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-400">No team members registered.</p>
                )}
              </div>

              {/* 3. SECCIÓN: TRABAJOS RECIENTES (Debajo del equipo) */}
              <div className="rounded-3xl border px-8 py-8 shadow-md"
                style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
              >
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#1E1E17]">
                  <Briefcase className="h-5 w-5" />
                  Recent Jobs
                </h3>
                {contractor?.jobs && contractor.jobs.length > 0 ? (
                  <div className="space-y-4">
                    {contractor.jobs.map((job: any) => (
                      <div key={job.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold leading-tight text-[#1E1E17]">{job.title}</h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                job.status === 'Completado' ? 'bg-green-100 text-green-800' :
                                job.status === 'En progreso' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {job.status === 'Completado' ? 'Completed' : job.status === 'En progreso' ? 'In Progress' : job.status || 'Project'}
                              </span>
                            </div>
                          </div>
                          {job.budget && (
                            <div className="shrink-0 text-left sm:text-right">
                              <span className="block text-base font-bold text-[#1E1E17]">${Number(job.budget).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-400">No jobs registered yet.</p>
                )}
              </div>

              {/* 4. DESCARGAR CV (Debajo de trabajos) */}
             
              <div className="rounded-[2rem] border-2 border-[#ffed00]/25 bg-gradient-to-br from-[#090909] via-[#111] to-[#080808] p-10 shadow-2xl text-white">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-[#ffed00]/20 to-[#ffed00]/10 border border-[#ffed00]/30">
                        <Download className="h-5 w-5 text-[#ffed00]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">Download CV</h3>
                        <p className="text-xs text-white/60">Generate PDF with experience, references and team.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportCv}
                      disabled={exportingCv}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ffed00] to-[#E5C228] px-5 py-2.5 text-sm font-bold text-[#1E1E17] shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-60 border border-[#ffed00] flex-shrink-0"
                    >
                      <Download className="h-4 w-4" />
                      {exportingCv ? "Generating..." : "Download CV (PDF)"}
                    </button>
                  </div>

                  {/* Rating Section - Solo para Homeowners */}
                  {isHomeowner && (
                    <div className="border-t border-white/10 pt-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">Rate this Contractor</h4>
                          <p className="text-xs text-white/50">Share your experience with others</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setCvRating(star)}
                                className="transition-all hover:scale-110"
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= cvRating
                                      ? "fill-[#ffed00] text-[#ffed00]"
                                      : "text-white/30"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          {cvRating > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                handleRatingSubmit(cvRating);
                                setCvRating(0);
                              }}
                              className="ml-2 rounded-lg bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-all border border-white/20"
                            >
                              Submit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Contractors Cercanos */}
          <NearbyContractorsSection
            loading={nearbyLoading}
            error={nearbyError}
            contractors={nearbyContractors}
          />
        </div>
      </div>
    </div>
  );
}