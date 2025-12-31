import { getInitials } from "@/core/utils/functionsHelper";
import AuthFormModal from "./form/auth-form/AuthForm";
import type { IProfile } from "@/core/types/IProfile";
import { UserMetaSkeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import ContractorLocationForm from "./form/contrator-location-form/ContractorLocationForm";
import type { ContractorLocationFormData } from "./form/contrator-location-form/ContractorLocationForm";

interface ProfileModalProps {
  user: IProfile | null;
  load: () => Promise<void>;
  isLoading: boolean;
}

export default function UserMetaCard({
  user = null,
  load,
  isLoading = false,
}: ProfileModalProps) {
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const initializeProfile = async () => {
    await load();
  };

  if (isLoading && !user) {
    return <UserMetaSkeleton />;
  }

  // Adapt user to ContractorLocationFormData
  const getContractorLocationFormData = (): ContractorLocationFormData => {
    return {
      user_id: user?.id,
      // Only map fields that exist in IProfile
      mobile_number: user?.mobile_number,
      phone_number: user?.phone_number ?? undefined,
      has_driving_license: user?.has_driving_license,
      driving_license_category: user?.driving_license_category ?? undefined,
      linkedin_url: user?.linkedin_url ?? undefined,
      portfolio_url: user?.portfolio_url ?? undefined,
      // The rest are left undefined (or you can map from another source if available)
    };
  };

  const handleLocationSave = () => {
    // Aquí puedes hacer la petición para guardar los datos
    setLocationModalOpen(false);
    // Opcional: recargar perfil
    load();
  };

  return (
    <div className="p-6 shadow-md rounded-2xl
      bg-white dark:bg-transparent dark:shadow-lg lg:p-8 transition-colors duration-300">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row xl:justify-between">
          {/* Avatar y datos */}
          <div className="flex flex-col items-center gap-3 xl:flex-row xl:gap-6">
            <div className="w-20 h-20 overflow-hidden rounded-full shadow-sm dark:shadow-md flex-shrink-0">
              <div className="avatar avatar-placeholder">
                <div className="bg-neutral text-neutral-content w-20 h-20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold">{getInitials(user?.name)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center xl:items-start">
              <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-100 text-center xl:text-left">
                {user?.name}
              </h4>
              <div className="flex flex-col items-center xl:items-start gap-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.role_name || "Rol no asignado"}</p>
              </div>
            </div>
          </div>
          {/* Alert y botón centrados y alineados */}
          <div className="flex flex-col items-center gap-2 xl:items-end xl:justify-center">
            {user?.edit_profile ? (
              <div
                role="alert"
                className="alert alert-success dark:bg-success-900 dark:text-success-200 dark:border-success-600 px-3 py-1 text-sm text-center"
              >
                <span>Autorizado por el admin</span>
              </div>
            ) : (
              <div
                role="alert"
                className="alert alert-warning dark:bg-warning-900 dark:text-warning-200 dark:border-warning-600 px-3 py-1 text-sm text-center"
              >
                <span>Falta confirmación del admin</span>
              </div>
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline-primary w-full xl:w-auto"
              onClick={() => setLocationModalOpen(true)}
            >
              Editar información de localización
            </button>
          </div>
        </div>
        <AuthFormModal initialData={user} load={initializeProfile} />
      </div>
      <ContractorLocationForm
        open={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        initialData={getContractorLocationFormData()}
        onSave={handleLocationSave}
      />
    </div>
  );
}
