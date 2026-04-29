import React from 'react';
import useAuth from '../../core/hooks/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean; // Si es true, requiere TODOS los roles/permisos. Si es false, requiere AL MENOS UNO
  fallback?: React.ReactNode;
}

/**
 * Componente de protección basado en roles y permisos
 * 
 * @param children - Contenido a renderizar si el usuario tiene acceso
 * @param roles - Array de roles requeridos
 * @param permissions - Array de permisos requeridos
 * @param requireAll - Si requiere todos los roles/permisos (true) o al menos uno (false)
 * @param fallback - Componente a renderizar si no tiene acceso
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
  fallback = null,
}) => {
  const {
    isAuthenticated,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermissionByName,
    hasAllPermissionsByName,
  } = useAuth();

  // Si no está autenticado, no mostrar nada
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  let hasRoleAccess = true;
  let hasPermissionAccess = true;

  // Verificar roles si se proporcionan
  if (roles.length > 0) {
    hasRoleAccess = requireAll ? hasAllRoles(roles) : hasAnyRole(roles);
  }

  // Verificar permisos si se proporcionan
  if (permissions.length > 0) {
    hasPermissionAccess = requireAll ? hasAllPermissionsByName(permissions) : hasAnyPermissionByName(permissions);
  }

  // Si el usuario tiene acceso tanto por roles como por permisos
  if (hasRoleAccess && hasPermissionAccess) {
    return <>{children}</>;
  }

  // Si no tiene acceso, mostrar fallback
  return <>{fallback}</>;
};

export default RoleGuard;