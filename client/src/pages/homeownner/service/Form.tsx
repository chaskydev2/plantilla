import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { HomeownerProfileServiceService as ItemService } from "@/core/services/homeowner/homeownerProfileService.service";
import { ServiceService } from "@/core/services/service/service.service";
import type { IHomeownerServiceLink } from "@/core/types/IHomeownerService";
import type { IService } from "@/core/types/IService";
import { useAppSelector } from "@/hooks";
import { toastify } from "@/core/utils/toastify";

type HomeownerServiceFormProps = {
  onClose?: () => void;
  onSaved?: () => void;
  showBreadcrumb?: boolean;
};

const resolveService = (item: IHomeownerServiceLink): IService => {
  if (item.service) return item.service;
  return {
    id: item.service_id ?? item.id ?? 0,
    name: item.name ?? "",
    slug: item.slug ?? "",
    icon: item.icon,
    image: item.image,
    description: item.description,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
};

export default function HomeownerServiceForm({ onClose, onSaved, showBreadcrumb = true }: HomeownerServiceFormProps) {
  const authUser = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const homeownerProfileId = useMemo(() => {
    const parsed = authUser?.id ? Number(authUser.id) : undefined;
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [authUser?.id]);

  const shouldShowBreadcrumb = showBreadcrumb && !onClose;

  const [availableServices, setAvailableServices] = useState<IService[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!homeownerProfileId) return;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [servicesRes, linkedRes] = await Promise.all([
          ServiceService.getAllServices(),
          ItemService.getAllPaginated(homeownerProfileId, { limit: 500 }, { signal: controller.signal }),
        ]);

        // API returns { success, data: IService[] }. Fallback to raw array just in case.
        const allServices = (servicesRes?.data as IService[]) ?? (Array.isArray(servicesRes) ? servicesRes : []);
        setAvailableServices(allServices);

        const existingIds = (linkedRes.data ?? [])
          .map((item) => resolveService(item).id)
          .filter((id): id is number => Boolean(id));
        setSelectedServiceIds(existingIds);
      } catch (error: any) {
        if (controller.signal.aborted) return;
        toastify.error(error?.response?.data?.message || "Could not load services");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => controller.abort();
  }, [homeownerProfileId]);

  const handleSave = async () => {
    if (!homeownerProfileId) return;
    setIsProcessing(true);
    try {
      const response = await ItemService.sync(homeownerProfileId, selectedServiceIds);
      console.log("response ", response);
      toastify.success(response?.message || "Services updated");
      if (onSaved) {
        onSaved();
      } else {
        navigate("/homeowner/services");
      }
    } catch (error: any) {
      console.log(error);
      toastify.error(error?.response?.data?.message || "Could not update services");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!homeownerProfileId) {
    return (
      <div className="p-6">
        <PageBreadcrumb pageTitle="Services" />
        <div className="rounded-xl bg-yellow-50 text-yellow-800 p-4 border border-yellow-200">
          We could not determine your homeowner profile. Please sign in again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {shouldShowBreadcrumb && <PageBreadcrumb pageTitle="Manage Services" />}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add or remove services</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select the services that describe what you need. Your profile will be synced when you save.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-ghost"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  navigate(-1);
                }
              }}
              disabled={isProcessing}
            >
              Back
            </button>
            <button
              className="bg-gray-900 text-white rounded-xl px-5 py-2 font-semibold hover:bg-gray-700 disabled:opacity-50"
              onClick={handleSave}
              disabled={isProcessing || isLoading}
            >
              {isProcessing ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="text-sm font-semibold text-gray-800 dark:text-gray-100" htmlFor="services-select">
            Services
          </label>
          {isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              Loading services...
            </div>
          ) : (
            <>
              <select
                id="services-select"
                multiple
                value={selectedServiceIds.map(String)}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
                  setSelectedServiceIds(values);
                }}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[260px] p-3"
              >
                {availableServices.map((svc) => (
                  <option key={svc.id} value={svc.id} className="py-1">
                    {svc.name} {svc.slug ? `(/${svc.slug})` : ""}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Hold Ctrl/Cmd to select multiple options.</span>
                <span>{selectedServiceIds.length} selected</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
