import type { IProfile } from "@/core/types/IProfile";
import { PersonalInformationMetaSkeleton } from "@/components/ui/skeleton/UserMetaSkeleton";
import PersonalInformationForm from "./form/personal-form/PersonalInformationForm";

interface ProfileModalProps {
  user: IProfile | null;
  load: () => Promise<void>;
  isLoading: boolean;
}

export default function UserInfoCard({
  user = null,
  load,
  isLoading = false,
}: ProfileModalProps) {
  const initializeProfile = async () => {
    await load();
  };

  if (isLoading && !user) {
    return <PersonalInformationMetaSkeleton />;
  }

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | null | undefined;
  }) => (
    <div>
      <p className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
        {label}
      </p>
      <p className="text-base font-medium text-gray-900 dark:text-gray-100">
        {value || "No especificado"}
      </p>
    </div>
  );

  return (
    <div className="p-5 shadow-md rounded-2xl lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Información Personal
          </h4>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:gap-x-32">
            <InfoItem label="Carnet de identidad" value={user?.ci} />
            <InfoItem
              label="Fecha de afiliación"
              value={user?.college_affiliation_date}
            />
            <InfoItem label="Número de teléfono" value={user?.phone_number} />
            <InfoItem label="Número de celular" value={user?.mobile_number} />
            <InfoItem label="LinkedIn" value={user?.linkedin_url} />
            <InfoItem
              label="Disponibilidad de viajar"
              value={user?.travel_availability ? "Sí" : "No especificado"}
            />
            <InfoItem
              label="Licencia de conducir"
              value={
                user?.has_driving_license
                  ? user?.driving_license_category || "No especificado"
                  : "No"
              }
            />
            <InfoItem
              label="Resumen profesional"
              value={user?.professional_summary}
            />
          </div>
        </div>

        <PersonalInformationForm initialData={user} load={initializeProfile} />
      </div>
    </div>
  );
}
