import useAuth from "@/core/hooks/useAuth";
import type { IPermission } from "@/core/types/IPermission";

interface WithPermissionProps {
  children: React.ReactNode;
  permissions: IPermission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

const WithPermission = ({
  children,
  permissions,
  requireAll = false,
  fallback = null,
}: WithPermissionProps) => {
  const { hasAnyPermission, hasAllPermissions } = useAuth();

  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
  const hasAccess = requireAll
    ? hasAllPermissions(permissionsArray)
    : hasAnyPermission(permissionsArray);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default WithPermission;