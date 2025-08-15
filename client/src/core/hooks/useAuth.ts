import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { IPermission } from '@/core/types/IPermission';

const useAuth = () => {
  const { user, isAuthenticated, permissions }  = useSelector((state: RootState) => state.auth);

  const hasPermission = (permission: IPermission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (list: IPermission[]): boolean => {
    return permissions.some(p => list.includes(p));
  };

  const hasAllPermissions = (list: IPermission[]): boolean => {
    return permissions.every(p => list.includes(p));
  };

  return {
    user,
    isAuthenticated,
    permissions: permissions as IPermission[],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};

export default useAuth;