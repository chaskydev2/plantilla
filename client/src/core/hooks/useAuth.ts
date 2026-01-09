import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { IPermission } from '@/core/types/IPermission';
import variables from '@/core/config/variables';

const useAuth = () => {
  const { user, isAuthenticated, permissions, roles }  = useSelector((state: RootState) => state.auth);

  // ===== ROLE METHODS =====
  
  /**
   * Verifica si el usuario tiene un rol específico
   * @param role - Nombre del rol a verificar
   * @returns boolean
   */
  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   * @param roleList - Array de roles a verificar
   * @returns boolean
   */
  const hasAnyRole = (roleList: string[]): boolean => {
    return roleList.some(role => roles.includes(role));
  };

  /**
   * Verifica si el usuario tiene todos los roles especificados
   * @param roleList - Array de roles a verificar
   * @returns boolean
   */
  const hasAllRoles = (roleList: string[]): boolean => {
    return roleList.every(role => roles.includes(role));
  };

  /**
   * Verifica si el usuario es administrador
   * @returns boolean
   */
  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  /**
   * Verifica si el usuario es manager
   * @returns boolean
   */
  const isManager = (): boolean => {
    return hasRole('manager');
  };

  /**
   * Verifica si el usuario es editor
   * @returns boolean
   */
  const isEditor = (): boolean => {
    return hasRole('editor');
  };

  // ===== PERMISSION METHODS =====

  /**
   * Verifica si el usuario tiene un permiso específico por nombre
   * @param permissionName - Nombre del permiso a verificar
   * @returns boolean
   */
  const hasPermissionByName = (permissionName: string): boolean => {
    return permissions.includes(permissionName as IPermission);
  };

  const hasPermission = (permission: IPermission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (list: IPermission[]): boolean => {
    return permissions.some(p => list.includes(p));
  };

  /**
   * Verifica si el usuario tiene alguno de los permisos especificados por nombre
   * @param permissionNames - Array de nombres de permisos a verificar
   * @returns boolean
   */
  const hasAnyPermissionByName = (permissionNames: string[]): boolean => {
    return permissionNames.some(permissionName => 
      permissions.includes(permissionName as IPermission)
    );
  };

  const hasAllPermissions = (list: IPermission[]): boolean => {
    return permissions.every(p => list.includes(p));
  };

  /**
   * Verifica si el usuario tiene todos los permisos especificados por nombre
   * @param permissionNames - Array de nombres de permisos a verificar
   * @returns boolean
   */
  const hasAllPermissionsByName = (permissionNames: string[]): boolean => {
    return permissionNames.every(permissionName => 
      permissions.includes(permissionName as IPermission)
    );
  };

  // ===== STORAGE METHODS =====

  /**
   * Obtiene los roles del usuario desde localStorage
   * @returns string[]
   */
  const getRolesFromStorage = (): string[] => {
    try {
      const storedRoles = localStorage.getItem(variables.session.userRoles);
      return storedRoles ? JSON.parse(storedRoles) : [];
    } catch {
      return [];
    }
  };

  /**
   * Obtiene los permisos del usuario desde localStorage
   * @returns any[]
   */
  const getPermissionsFromStorage = (): any[] => {
    try {
      const storedPermissions = localStorage.getItem(variables.session.userPermissions);
      return storedPermissions ? JSON.parse(storedPermissions) : [];
    } catch {
      return [];
    }
  };

  return {
    // Estado básico
    user,
    isAuthenticated,
    permissions: permissions as IPermission[],
    roles,

    // Métodos de roles
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isManager,
    isEditor,

    // Métodos de permisos (existentes)
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Métodos de permisos por nombre (nuevos)
    hasPermissionByName,
    hasAnyPermissionByName,
    hasAllPermissionsByName,

    // Métodos de storage
    getRolesFromStorage,
    getPermissionsFromStorage,
  };
};

export default useAuth;