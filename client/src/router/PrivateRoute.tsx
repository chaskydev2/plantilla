import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "@/core/hooks/useAuth";
import type { IPermission } from "@/core/types/IPermission";

const PrivateRoute = () => {
  const location = useLocation();
  const { isAuthenticated, hasAnyPermission } = useAuth();

  const currentPath = location.pathname;

  const routePermissions: Record<string, IPermission[] | null> = {
    "/admin": null,
    "/admin/perfil": null,
    "/admin/usuarios": ["usuario_listar"] as IPermission[],
    "/admin/usuarios/:id": ["usuario_ver"] as IPermission[],
    "/admin/roles": ["rol_listar"] as IPermission[],
    "/admin/permisos": ["permiso_listar"] as IPermission[],
    "/admin/roles/:id/permisos": ["rol_permiso_listar"] as IPermission[],
    "/admin/comunicados": ["comunicado_listar"] as IPermission[],
    "/admin/tipo_eventos": ["tipo_evento_listar"] as IPermission[],
    "/admin/eventos": ["evento_listar"] as IPermission[],
    "/admin/cursos": ["curso_listar"] as IPermission[],
    "/admin/historias": ["historia_listar"] as IPermission[],
    "/admin/contactos": ["contacto_listar"] as IPermission[],
    "/admin/principios": ["principio_listar"] as IPermission[],
    "/admin/valores_morales": ["valor_moral_listar"] as IPermission[],
    "/admin/directiva": ["directiva_listar"] as IPermission[],
    "/admin/requisitos": ["requisito_listar"] as IPermission[],
    "/admin/acuerdos": ["acuerdo_listar"] as IPermission[],
    "/admin/consultas": ["consulta_listar"] as IPermission[],
    "/admin/preguntas_frecuentes": ["pregunta_frecuente_listar"] as IPermission[],
    "/admin/banners": ["banner_listar"] as IPermission[],
    "/admin/redes_sociales": ["red_social_listar"] as IPermission[],
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let requiredPermissions: IPermission[] | null = null;

  if (routePermissions[currentPath] !== undefined) {
    requiredPermissions = routePermissions[currentPath];
  } else {
    for (const route in routePermissions) {
      if (route.includes(':') && currentPath.startsWith(route.split(':')[0])) {
        requiredPermissions = routePermissions[route];
        break;
      }
    }
  }

  if (requiredPermissions === null) {
    return <Outlet />;
  }

  if (requiredPermissions.length === 0 || hasAnyPermission(requiredPermissions)) {
    return <Outlet />;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;