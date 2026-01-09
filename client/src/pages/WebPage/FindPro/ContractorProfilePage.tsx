import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { ContractorService } from "@/core/services/contractor/contractor.service";
import type { IApiResponse } from "@/core/types/IApi";
import type { ContractorFullInfo, NearbyContractorCard } from "@/types/contractor";
import { ContractorProfileSkeleton } from "@/pages/WebPage/FindPro/components/contractor-profile/ContractorProfileSkeleton";
import { ContractorPrimaryInfo } from "@/pages/WebPage/FindPro/components/contractor-profile/ContractorPrimaryInfo";
import {
  ContractorChatAside,
  type ChatMessage,
} from "@/pages/WebPage/FindPro/components/contractor-profile/ContractorChatAside";
import { NearbyContractorsSection } from "@/pages/WebPage/FindPro/components/contractor-profile/NearbyContractorsSection";
import {
  createContractorProfileViewModel,
  extractList,
  mapNearbyContractor,
} from "@/pages/WebPage/FindPro/utils/contractorProfile";
import type { ContractorProfileViewModel } from "@/pages/WebPage/FindPro/utils/contractorProfile";

export default function ContractorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [contractor, setContractor] = useState<ContractorFullInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageDraft, setMessageDraft] = useState("");
  const [nearbyContractors, setNearbyContractors] = useState<NearbyContractorCard[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState<string | null>(null);

  const profile = useMemo<ContractorProfileViewModel | null>(
    () => (contractor ? createContractorProfileViewModel(contractor) : null),
    [contractor],
  );

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

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    ContractorService.getFullInfo(id)
      .then((response) => {
        console.log(response);
        if (!active) return;
        const api = response as IApiResponse<ContractorFullInfo>;
        if (!api?.success || !api.data) {
          throw new Error(api?.message || "Contractor data unavailable");
        }
        setContractor(api.data);
      })
      .catch((err: any) => {
        if (!active) return;
        console.log(err);
        const message = err?.response?.data?.message || err?.message || "Unable to load contractor";
        setError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!profile) return;

    setChatMessages((prev) => {
      if (prev.length) return prev;
      return [
        {
          id: Date.now(),
          sender: "support",
          text: `Hi ${profile.displayName}, we are here to help. What do you need today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];
    });
  }, [profile]);

  useEffect(() => {
    if (!id) return;

    let active = true;
    const controller = new AbortController();
    setNearbyLoading(true);
    setNearbyError(null);

    ContractorService.getNearByContractorId(id, {}, { signal: controller.signal })
      .then((response) => {
        console.log(response);
        if (!active) return;
        const api = response as IApiResponse<any>;
        if (!api?.success) {
          throw new Error(api?.message || "Unable to load nearby contractors");
        }
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
        console.log("Nearby contractors fetch error", {
          status,
          message: backendMessage,
        });
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

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!messageDraft.trim()) return;
    const trimmedMessage = messageDraft.trim();
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "contractor",
        text: trimmedMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setMessageDraft("");
  };

  const handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageDraft(event.target.value);
  };

  if (loading) {
    return <ContractorProfileSkeleton />;
  }

  if (error) {
    return <div className="p-8 text-center text-[#F5D238]">{error}</div>;
  }

  if (!contractor || !profile) {
    return <div className="p-8 text-center text-[#F5D238]">Contractor not found.</div>;
  }

  return (
    <div className="min-h-screen  bg-[#F5D238] pb-12 overflow-x-hidden">
      <div className="mx-auto w-full max-w-screen-xl px-3 pt-10 sm:px-4 lg:px-8">

        <div className="mt-2 overflow-hidden rounded-3xl border border-[#1E1E17]/12 bg-white/95 shadow-[0_12px_36px_rgba(30,30,23,0.18)] backdrop-blur">
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

          <div className="grid gap-6 border-b border-[#1E1E17]/8 bg-white px-4 py-8 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-10">
            <ContractorPrimaryInfo contractor={contractor} profile={profile} />

            <ContractorChatAside
              messages={chatMessages}
              messageDraft={messageDraft}
              onSubmit={handleSendMessage}
              onDraftChange={handleDraftChange}
            />
          </div>

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
