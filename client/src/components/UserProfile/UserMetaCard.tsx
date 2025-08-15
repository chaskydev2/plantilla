import { getInitials } from "@/core/utils/functionsHelper";
import AuthFormModal from "./form/auth-form/AuthForm";
import type { IProfile } from "@/core/types/IProfile";
import { UserMetaSkeleton } from "@/components/ui/skeleton";

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

  const initializeProfile = async () => {
    await load();
  };

  if (isLoading && !user) {
    return <UserMetaSkeleton />;
  }

  return (
    <div className="p-6 shadow-md rounded-2xl
      bg-white dark:bg-transparent dark:shadow-lg lg:p-8 transition-colors duration-300">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hiddenrounded-full shadow-sm dark:shadow-md">
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-20 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold">{getInitials(user?.name)}</span>
              </div>
            </div>
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-gray-100 xl:text-left">
              {user?.name}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.role_name || "Rol no asignado"}
              </p>
            </div>
          </div>
          {user?.edit_profile ? (
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <div
                role="alert"
                className="alert alert-success dark:bg-success-900 dark:text-success-200 dark:border-success-600"
              >
                <span>Autorizado por el admin</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <div
                role="alert"
                className="alert alert-warning dark:bg-warning-900 dark:text-warning-200 dark:border-warning-600"
              >
                <span>Falta confirmación del admin</span>
              </div>
            </div>
          )}
        </div>
        <AuthFormModal initialData={user} load={initializeProfile} />
      </div>
    </div>
  );
}
