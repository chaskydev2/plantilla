import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import LogoUrl from "@/assets/images/LOGO GUD.svg?url";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Globe,
  History,
  Contact,
  Shield,
  Key,
  List,
  ChevronDown,
  Star,
  Scale,
  Clipboard,
  FileSignature,
  MessageSquare,
  HelpCircle,
  Image,
  Share2,
  BarChart2,
  Briefcase,
  Tag,
  FolderOpen,
  Home,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useSidebar } from "@/core/context/SidebarContext";
import classNames from "classnames";
import useAuth from "@/core/hooks/useAuth";
import type { IPermission } from "@/core/types/IPermission";

type MenuItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  permissions?: IPermission[];
  subItems?: MenuItem[];
};

type OpenSubmenu = {
  type: "main" | "web";
  index: number;
} | null;

const navItems: MenuItem[] = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    name: "Dashboard",
    path: "/admin",
  },
  // 🏠 HOMEOWNER SPECIFIC ITEMS
  {
    name: "Completed Jobs",
    icon: <CheckCircle className="w-5 h-5" />,
    path: "/admin/completed-jobs",
    // Esta ruta será visible solo para homeowners
  },
  {
    name: "Claims Submitted",
    icon: <AlertTriangle className="w-5 h-5" />,
    path: "/admin/claims-submitted", 
    // Esta ruta será visible solo para homeowners
  },
  {
    name: "Usuarios",
    icon: <Users className="w-5 h-5" />,
    permissions: ["usuario_listar", "rol_listar", "permiso_listar"],
    subItems: [
      {
        name: "Lista de Usuarios",
        path: "/admin/usuarios",
        icon: <List className="w-4 h-4" />,
        permissions: ["usuario_listar"]
      },
      {
        name: "Trabajadores",
        path: "/admin/trabajadores",
        icon: <Users className="w-4 h-4" />,
      //  permissions: ["trabajador_listar"]
      },
      {
        name: "Homeowners",
        path: "/admin/homeowners",
        icon: <Home className="w-4 h-4" />,
        //permissions: ["homeowner_listar"]
      },
      {
        name: "Roles",
        path: "/admin/roles",
        icon: <Shield className="w-4 h-4" />,
        permissions: ["rol_listar"]
      },
      {
        name: "Permisos",
        path: "/admin/permisos",
        icon: <Key className="w-4 h-4" />,
        permissions: ["permiso_listar"]
      }
    ],
  },
  {
    name: "Eventos",
    icon: <Calendar className="w-5 h-5" />,
    permissions: ["tipo_evento_listar"],
    subItems: [
      {
        name: "Tipos de Eventos",
        path: "/admin/tipo_eventos",
        icon: <List className="w-4 h-4" />,
        permissions: ["tipo_evento_listar"]
      },
      {
        name: "Eventos",
        path: "/admin/eventos",
        icon: <Calendar className="w-4 h-4" />,
        permissions: ["evento_listar"]
      },
      {
        name: "Cursos",
        path: "/admin/cursos",
        icon: <BookOpen className="w-4 h-4" />,
        permissions: ["curso_listar"]
      },
    ],
  },
  
  {
    name: "Pagos",
    icon: <BookOpen className="w-5 h-5" />,
    permissions: ["payment_listar"],
    subItems: [
      {
        name: "Lista de pagos",
        path: "/admin/montlypay",
        icon: <List className="w-4 h-4" />,
        permissions: ["payment_listar"]
      },
      {
        name: "Reporte de pagos",
        path: "/admin/montlypayreport",
        icon: <BarChart2 className="w-4 h-4" />,
        permissions: ["payment_listar"]
      },
    ],
  },
  {
    name: "Profesiones",
    icon: <Briefcase className="w-5 h-5" />,
    //permissions: ["profesion_listar", "etiqueta_listar"],
    subItems: [
      {
        name: "Lista de Profesiones",
        path: "/admin/profesiones",
        icon: <Briefcase className="w-4 h-4" />,
      //  permissions: ["profesion_listar"]
      },
      {
        name: "Etiquetas",
        path: "/admin/etiquetas",
        icon: <Tag className="w-4 h-4" />,
      //  permissions: ["etiqueta_listar"]
      },
      {
        name: "Categorías",
        path: "/admin/categories",
        icon: <FolderOpen className="w-4 h-4" />,
      //  permissions: ["categoria_listar"]
      },
    ],
  },
  {
    name: "Atributos",
    icon: <Clipboard className="w-5 h-5" />,
    //permissions: ["atributo_listar"],
    subItems: [
      {
        name: "Lista de Atributos",
        path: "/admin/atributes",
        icon: <Clipboard className="w-4 h-4" />,
      //  permissions: ["atributo_listar"]
      },
    ],
  },
];

const webItems: MenuItem[] = [
  {
    name: "LANDING PAGE",
    icon: <Globe className="w-5 h-5" />,
    permissions: ["historia_listar", "contacto_listar", "principio_listar", "valor_moral_listar", 
      "directiva_listar", "requisito_listar", "acuerdo_listar", "consulta_listar", "pregunta_frecuente_listar", "red_social_listar", 
      "banner_listar", "comunicado_listar"],
    subItems: [
      {
        name: "Historia",
        path: "/admin/historias",
        icon: <History className="w-4 h-4" />,
        permissions: ["historia_listar"]
      },
      {
        name: "Contacto",
        path: "/admin/contactos",
        icon: <Contact className="w-4 h-4" />,
        permissions: ["contacto_listar"]
      },
      {
        name: "Principios",
        path: "/admin/principios",
        icon: <Scale className="w-4 h-4" />,
        permissions: ["principio_listar"]
      },
      {
        name: "Valores Morales",
        path: "/admin/valores_morales",
        icon: <Star className="w-4 h-4" />,
        permissions: ["valor_moral_listar"]
      },
      { 
        name: "Requisitos", 
        path: "/admin/requisitos",
        icon: <Clipboard className="w-4 h-4" />,
        permissions: ["requisito_listar"]
      },
      { 
        name: "Acuerdos", 
        path: "/admin/acuerdos",
        icon: <FileSignature className="w-4 h-4" />,
        permissions: ["acuerdo_listar"] 
      },
      { 
        name: "Consultas", 
        path: "/admin/consultas",
        icon: <MessageSquare className="w-4 h-4" />,
        permissions: ["consulta_listar"] 
      },
      { 
        name: "Preguntas Frecuentes", 
        path: "/admin/preguntas_frecuentes",
        icon: <HelpCircle className="w-4 h-4" />,
        permissions: ["pregunta_frecuente_listar"] 
      },
      { 
        name: "Banner", 
        path: "/admin/banners",
        icon: <Image className="w-4 h-4" />,
        permissions: ["banner_listar"]
      },
      { 
        name: "Redes Sociales", 
        path: "/admin/redes_sociales",
        icon: <Share2 className="w-4 h-4" />,
        permissions: ["red_social_listar"]
      },
      { 
        name: "Comunicados", 
        path: "/admin/comunicados",
        icon: <MessageSquare className="w-4 h-4" />,
        permissions: ["comunicado_listar"]
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { hasAnyPermission, hasRole } = useAuth();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => {
    // Exacta coincidencia para rutas
    if (location.pathname === path) return true;
    
    // Para rutas con parámetros dinámicos como /admin/usuarios/:id
    if (path.includes(':')) {
      const pathPattern = path.replace(/:[^\/]+/g, '[^/]+');
      const regex = new RegExp(`^${pathPattern}$`);
      return regex.test(location.pathname);
    }
    
    return false;
  }, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;

    const checkItems = (items: MenuItem[], type: "main" | "web") => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (subItem.path && isActive(subItem.path)) {
              setOpenSubmenu({ type, index });
              submenuMatched = true;
            }
          });
        }
        // También verificar si la ruta principal coincide
        else if (nav.path && isActive(nav.path)) {
          submenuMatched = true;
        }
      });
    };

    checkItems(navItems, "main");
    checkItems(webItems, "web");

    // Solo cerrar submenus si no hay coincidencias
    if (!submenuMatched) {
      // Mantener abierto el submenu si estamos en una ruta relacionada
      const currentPath = location.pathname;
      let shouldKeepOpen = false;
      
      // Verificar si estamos en una ruta que debería mantener un submenu abierto
      if (currentPath.startsWith('/admin/usuarios') || 
          currentPath.startsWith('/admin/roles') || 
          currentPath.startsWith('/admin/permisos') ||
          currentPath.startsWith('/admin/trabajadores') ||
          currentPath.startsWith('/admin/homeowners')) {
        setOpenSubmenu({ type: "main", index: 2 }); // Index del submenu "Usuarios"
        shouldKeepOpen = true;
      } else if (currentPath.startsWith('/admin/tipo_eventos') || 
                 currentPath.startsWith('/admin/eventos') ||
                 currentPath.startsWith('/admin/cursos')) {
        setOpenSubmenu({ type: "main", index: 3 }); // Index del submenu "Eventos"
        shouldKeepOpen = true;
      } else if (currentPath.startsWith('/admin/montlypay')) {
        setOpenSubmenu({ type: "main", index: 4 }); // Index del submenu "Pagos"
        shouldKeepOpen = true;
      } else if (currentPath.startsWith('/admin/profesiones') || 
                 currentPath.startsWith('/admin/etiquetas') ||
                 currentPath.startsWith('/admin/categories')) {
        setOpenSubmenu({ type: "main", index: 5 }); // Index del submenu "Profesiones"
        shouldKeepOpen = true;
      } else if (currentPath.startsWith('/admin/historias') || 
                 currentPath.startsWith('/admin/contactos') ||
                 currentPath.startsWith('/admin/principios') ||
                 currentPath.startsWith('/admin/valores_morales') ||
                 currentPath.startsWith('/admin/requisitos') ||
                 currentPath.startsWith('/admin/acuerdos') ||
                 currentPath.startsWith('/admin/consultas') ||
                 currentPath.startsWith('/admin/preguntas_frecuentes') ||
                 currentPath.startsWith('/admin/banners') ||
                 currentPath.startsWith('/admin/redes_sociales') ||
                 currentPath.startsWith('/admin/comunicados')) {
        setOpenSubmenu({ type: "web", index: 0 }); // Index del submenu "LANDING PAGE"
        shouldKeepOpen = true;
      }
      
      if (!shouldKeepOpen) {
        setOpenSubmenu(null);
      }
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const ref = subMenuRefs.current[key];
      if (ref) {
        setSubMenuHeight(prev => ({
          ...prev,
          [key]: ref.scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter(item => {
        // ✅ Dashboard siempre visible para todos los usuarios autenticados
        if (item.name === "Dashboard") return true;
        
        // 🏠 Elementos específicos para homeowners
        if (item.name === "Completed Jobs" || item.name === "Claims Submitted") {
          return hasRole("homeowner");
        }
        
        // � El resto de rutas solo para usuarios con rol de admin
        if (!hasRole("admin")) return false;
        
        // ✅ Si es admin, aplicar filtro de permisos normal
        return !item.permissions || hasAnyPermission(item.permissions);
      })
      .map(item => ({
        ...item,
        subItems: item.subItems ? filterMenuItems(item.subItems) : undefined
      }))
      .filter(item => item.path || (item.subItems && item.subItems.length > 0));
  };

  // 🔐 RESTRICCIÓN DE ACCESO POR ROLES:
  // - Dashboard: Visible para todos los usuarios autenticados
  // - Completed Jobs & Claims Submitted: Solo para homeowners
  // - Resto de rutas: Solo para admins (con filtros de permisos)
  const filteredNavItems = filterMenuItems(navItems);
  const filteredWebItems = filterMenuItems(webItems);

  const handleSubmenuToggle = (index: number, menuType: "main" | "web") => {
    setOpenSubmenu(prev =>
      prev?.type === menuType && prev.index === index ? null : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: MenuItem[], menuType: "main" | "web") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const isSubmenuOpen = openSubmenu?.type === menuType && openSubmenu.index === index;
        const menuKey = `${menuType}-${index}`;

        return (
          <li key={`${nav.name}-${index}`}>
            {nav.subItems ? (
              <>
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={classNames("menu-item group cursor-pointer", {
                    "menu-item-active": isSubmenuOpen,
                    "menu-item-inactive": !isSubmenuOpen,
                    "lg:justify-center": !isExpanded && !isHovered,
                    "lg:justify-start": isExpanded || isHovered
                  })}
                >
                  <span className={classNames("menu-item-icon-size", {
                    "menu-item-icon-active": isSubmenuOpen,
                    "menu-item-icon-inactive": !isSubmenuOpen
                  })}>
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <>
                      <span className="menu-item-text">{nav.name}</span>
                      <ChevronDown className={classNames(
                        "ml-auto w-5 h-5 transition-transform duration-200",
                        { "rotate-180 text-gray-100": isSubmenuOpen }
                      )} />
                    </>
                  )}
                </button>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <div
                    ref={el => { subMenuRefs.current[menuKey] = el; }}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height: isSubmenuOpen ? `${subMenuHeight[menuKey] || 0}px` : "0px",
                    }}
                  >
                    <ul className="mt-2 space-y-1 ml-9">
                      {nav.subItems.map((subItem, subIndex) => (
                        <li key={`${subItem.name}-${subIndex}`}>
                          <Link
                            to={subItem.path || "#"}
                            className={classNames("flex items-center menu-dropdown-item", {
                              "menu-dropdown-item-active": subItem.path ? isActive(subItem.path) : false,
                              "menu-dropdown-item-inactive": subItem.path ? !isActive(subItem.path) : true
                            })}
                          >
                            {subItem.icon}
                            <span className="flex-1">{subItem.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={classNames("menu-item group", {
                    "menu-item-active": isActive(nav.path),
                    "menu-item-inactive": !isActive(nav.path)
                  })}
                >
                  <span className={classNames("menu-item-icon-size", {
                    "menu-item-icon-active": isActive(nav.path),
                    "menu-item-icon-inactive": !isActive(nav.path)
                  })}>
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={classNames(
        "fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200",
        {
          "w-[290px]": isExpanded || isMobileOpen || isHovered,
          "w-[90px]": !isExpanded && !isHovered,
          "translate-x-0": isMobileOpen,
          "-translate-x-full": !isMobileOpen,
          "lg:translate-x-0": true
        }
      )}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={classNames("py-8 flex", {
        "lg:justify-center": !isExpanded && !isHovered,
        "justify-start": isExpanded || isHovered
      })}>
        <Link to="/" className="flex items-center gap-2 text-gray-400">
          {isExpanded || isHovered || isMobileOpen ? (
            "GU"
          ) : (
            <img src={LogoUrl} alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {filteredNavItems.length > 0 && (
              <div>
                <h2 className={classNames(
                  "mb-4 text-xs uppercase flex leading-[20px] text-gray-400",
                  {
                    "lg:justify-center": !isExpanded && !isHovered,
                    "justify-start": isExpanded || isHovered
                  }
                )}>
                  {isExpanded || isHovered || isMobileOpen ? "Menu" : <ChevronDown className="size-6" />}
                </h2>
                {renderMenuItems(filteredNavItems, "main")}
              </div>
            )}

            {filteredWebItems.length > 0 && (
              <div>
                <h2 className={classNames(
                  "mb-4 text-xs uppercase flex leading-[20px] text-gray-400",
                  {
                    "lg:justify-center": !isExpanded && !isHovered,
                    "justify-start": isExpanded || isHovered
                  }
                )}>
                  {isExpanded || isHovered || isMobileOpen ? "Web" : <ChevronDown className="size-6" />}
                </h2>
                {renderMenuItems(filteredWebItems, "web")}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;