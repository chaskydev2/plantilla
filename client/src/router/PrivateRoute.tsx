import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "@/core/hooks/useAuth";
import type { IPermission } from "@/core/types/IPermission";

const PrivateRoute = () => {
  const location = useLocation();
  const { isAuthenticated, hasAnyPermission } = useAuth();

  const currentPath = location.pathname;

  const routePermissions: Record<string, IPermission[] | null> = {
    // SHARED ROUTES - Accessible by ALL authenticated users
    "/admin": null,
    "/admin/perfil": null,

    // ADMIN ONLY ROUTES - System Administration
    "/admin/usuarios": ["usuario_listar"] as IPermission[],
    "/admin/usuarios/:id": ["usuario_ver"] as IPermission[],
    "/admin/roles": ["rol_listar"] as IPermission[],
    "/admin/permisos": ["permiso_listar"] as IPermission[],
    "/admin/roles/:id/permisos": ["rol_permiso_listar"] as IPermission[],
    "/admin/comunicados": ["comunicado_listar"] as IPermission[],
    "/admin/tipo_eventos": ["tipo_evento_listar"] as IPermission[],
    "/admin/eventos": ["evento_listar"] as IPermission[],
    "/admin/cursos": ["curso_listar"] as IPermission[],
    "/admin/montlypay": null, // TODO: Add pago_listar permission
    "/admin/montlypayreport": null, // TODO: Add pago_reporte_ver permission
    "/admin/profesiones": null, // TODO: Add profesion_listar permission
    "/admin/etiquetas": null, // TODO: Add etiqueta_listar permission
    "/admin/atributes": null, // TODO: Add atributo_listar permission
    "/admin/categories": null, // TODO: Add categoria_listar permission

    // ADMIN ONLY - Website Content Management
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

    // ADMIN ONLY - User Management
    "/admin/trabajadores": null, // TODO: Add trabajador_listar permission
    "/admin/homeowners": null, // TODO: Add propietario_listar permission

    // CONTRACTOR SPECIFIC ROUTES
    "/admin/contractor/perfil": null, // Accessible to contractors
    "/admin/contractor/proyectos": null, // TODO: Add contractor_proyecto_listar permission
    "/admin/contractor/clientes": null, // TODO: Add contractor_cliente_listar permission
    "/admin/contractor/calendario": null, // TODO: Add contractor_calendario_ver permission
    "/admin/contractor/cotizaciones": null, // TODO: Add contractor_cotizacion_listar permission
    "/admin/contractor/trabajos": null, // TODO: Add contractor_trabajo_listar permission
    "/admin/contractor/servicios": null, // TODO: Add contractor_servicio_listar permission

    // CONTRACTOR ROUTES (Alternative structure)
    "/contractor/perfil": null, // Accessible to contractors
    "/contractor/projects": null, // Accessible to contractors  
    "/contractor/customers": null, // Accessible to contractors

    // HOMEOWNER SPECIFIC ROUTES
    "/admin/homeowner/perfil": null, // Accessible to homeowners
    "/admin/homeowner/solicitudes": null, // TODO: Add homeowner_solicitud_listar permission
    "/admin/homeowner/contratistas": null, // TODO: Add homeowner_contratista_listar permission
    "/admin/homeowner/historial": null, // TODO: Add homeowner_historial_ver permission
    "/admin/homeowner/valoraciones": null, // TODO: Add homeowner_valoracion_listar permission
    "/admin/homeowner/pagos": null, // TODO: Add homeowner_pago_listar permission
    "/admin/homeowner/favoritos": null, // TODO: Add homeowner_favorito_listar permission

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