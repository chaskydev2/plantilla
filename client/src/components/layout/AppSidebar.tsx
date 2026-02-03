  import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import  Logo from "@/assets/images/LOGO GUD.svg?url";

import {
  LayoutDashboard,
  Users,
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
  PlayCircle,
  BarChart2,
  Briefcase,
  Tag,
  Wrench,
  UserPlus,
  Bell,
  FileText
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

const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { hasAnyPermission, hasRole, user } = useAuth();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Contractor-only menu
  const contractorItems: MenuItem[] = [
      // Homeowner-only menu
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: t("contractor.sidebar.dashboard", "Dashboard"),
      path: "/admin",
    },
    {
      name: t("contractor.sidebar.profile", "My Profile"),
      icon: <Clipboard className="w-5 h-5" />,
      path: "/admin/perfil",
    },
    {
      name: t("contractor.sidebar.documents", "Documents"),
      icon: <Clipboard className="w-5 h-5" />,
      path: "/contractor/documents",
    },
    {
      name: t("contractor.sidebar.jobs", "Jobs"),
      icon: <Briefcase className="w-5 h-5" />,
      path: "/contractor/jobs",
    },
    {
      name: t("contractor.sidebar.tags", "Tags"),
      icon: <Tag className="w-5 h-5 text-amber-400" />,
      path: "/contractor/tags",
    },
    {
      name: t("contractor.sidebar.team", "Team"),
      icon: <UserPlus className="w-5 h-5" />,
      path: "/contractor/team",
    },
    {
      name: t("contractor.sidebar.teamUser", "Team User"),
      icon: <Users className="w-5 h-5" />,
      path: "/contractor/team-user",
    },
    {
      name: t("contractor.sidebar.payments", "Payments"),
      icon: <BarChart2 className="w-5 h-5" />,
      path: "/contractor/payments",
    },
    {
      name: t("homeowner.sidebar.chats", "Chats"),
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      path: "/contractor/chats",
    }
  ];


  const homeownerItems: MenuItem[] = [
        {
          icon: <LayoutDashboard className="w-5 h-5" />,
          name: t("homeowner.sidebar.dashboard", "Dashboard"),
          path: "/admin",
        },
        {
          name: t("homeowner.sidebar.profile", "My Profile"),
          icon: <Users className="w-5 h-5" />,
          path: "/homeowner/perfil",
        },
         {
          name: t("homeowner.sidebar.services", "Services"),
          icon: <Wrench className="w-5 h-5" />,
          path: "/homeowner/services",
        },
        {
          name: t("homeowner.sidebar.documents", "Documents"),
          icon: <Clipboard className="w-5 h-5" />,
          path: "/homeowner/documents",
        },
        {
          name: t("homeowner.sidebar.claims", "Claims"),
          icon: <Clipboard className="w-5 h-5" />,
          path: "/homeowner/claims",
        },
        {
          name: t("homeowner.sidebar.postJob", "Post Job"),
          icon: <Tag className="w-5 h-5 text-amber-400" />,
          path: "/homeowner/post-job",
        },
          {
            name: t("homeowner.sidebar.chats", "Chats"),
            icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
            path: "/homeowner/chats",
          },
          {
            name: t("homeowner.sidebar.notifications", "Notifications"),
            icon: <Bell className="w-5 h-5 text-amber-500" />,
            path: "/homeowner/notifications",
          }
    ];

  const navItems: MenuItem[] = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: t("admin.sidebar.dashboard"),
      path: "/admin",
    },
    {
      name: t("admin.sidebar.users"),
      icon: <Users className="w-5 h-5" />,
      permissions: ["usuario_listar", "rol_listar", "permiso_listar"],
      subItems: [
        {
          name: t("admin.sidebar.usersList"),
          path: "/admin/usuarios",
          icon: <List className="w-4 h-4" />,
          permissions: ["usuario_listar"]
        },
        {
          name: t("admin.sidebar.roles"),
          path: "/admin/roles",
          icon: <Shield className="w-4 h-4" />,
          permissions: ["rol_listar"]
        },
        {
          name: t("admin.sidebar.permissions"),
          path: "/admin/permisos",
          icon: <Key className="w-4 h-4" />,
          permissions: ["permiso_listar"]
        }
      ],
    },
    // {
    //   name: t("admin.sidebar.events"),
    //   icon: <Calendar className="w-5 h-5" />,
    //   permissions: ["tipo_evento_listar"],
    //   subItems: [
    //     {
    //       name: t("admin.sidebar.eventTypes"),
    //       path: "/admin/tipo_eventos",
    //       icon: <List className="w-4 h-4" />,
    //       permissions: ["tipo_evento_listar"]
    //     },
    //     {
    //       name: t("admin.sidebar.eventsList"),
    //       path: "/admin/eventos",
    //       icon: <Calendar className="w-4 h-4" />,
    //       permissions: ["evento_listar"]
    //     },
    //   ],
    // },
    {
      name: t("admin.sidebar.payments"),
      icon: <BookOpen className="w-5 h-5" />,
      permissions: ["payment_listar"],
      subItems: [
        {
          name: t("admin.sidebar.paymentsList"),
          path: "/admin/montlypay",
          icon: <List className="w-4 h-4" />,
          permissions: ["payment_listar"]
        },
        {
          name: t("admin.sidebar.paymentsReport"),
          path: "/admin/montlypayreport",
          icon: <BarChart2 className="w-4 h-4" />,
          permissions: ["payment_listar"]
        },
      ],
    },
    {
      name: t("admin.sidebar.professions"),
      icon: <Star className="w-5 h-5 text-yellow-400" />,
      //permissions: ["profesion_listar", "etiqueta_listar"],
      subItems: [
        {
          name: t("admin.sidebar.professionsList"),
          path: "/admin/profesiones",
          icon: <Star className="w-4 h-4 text-yellow-400" />, 
        //  permissions: ["profesion_listar"]
        },
        {
          name: t("admin.sidebar.tags"),
          path: "/admin/etiquetas",
          icon: <Tag className="w-4 h-4" />,
        //  permissions: ["etiqueta_listar"]
        },
        {
          name: t("admin.sidebar.services", "Services"),
          path: "/admin/services",
          icon: <Wrench className="w-4 h-4" />,
        //  permissions: ["etiqueta_listar"]
        },
      ],
    },
    {
      name: t("admin.sidebar.jobApplicationsSection"),
      icon: <Clipboard className="w-5 h-5" />,
      // Puedes agregar permisos si lo necesitas
      subItems: [
        {
          name: t("admin.sidebar.jobContracts","Jobs of Contractors"),
          path: "/admin/job",
          icon: <Clipboard className="w-4 h-4" />,
        },
        {
          name: t("contractor.sidebar.postJob", "Post Job"),
          icon: <Users className="w-5 h-5" />,
          path: "/admin/post-job",
        }
      ],
    },
     {
      name: t("admin.sidebar.claimsSection","Scam Alerts"),
      icon: <Clipboard className="w-5 h-5" />,
        path: "/admin/claim",
      // Puedes agregar permisos si lo necesitas
    },
      {
      name: t("admin.sidebar.requirements"),
      icon: <Briefcase className="w-5 h-5" />,
      //permissions: ["profesion_listar"],
      subItems: [
        {
          name: t("admin.sidebar.documentsrequirements"),
          path: "/admin/atributes",
          icon: <Clipboard className="w-4 h-4 text-blue-500" />,
        //  permissions: ["profesion_listar"]
        },
        {
          name: t("admin.sidebar.documentscontractors"),
          path: "/admin/atribute_contractor",
          icon: <Users className="w-4 h-4 text-emerald-500" />,
        //  permissions: ["profesion_listar"]
        },
        {
          name: t("admin.sidebar.documentshomeowners","Documents Homeowners"),
          path: "/admin/attribute_homeowner",
          icon: <Clipboard className="w-4 h-4 text-blue-500" />,
        //  permissions: ["profesion_listar"]
        },
      ],
    },
  ];

  const webItems: MenuItem[] = [
    {
      name: t("admin.sidebar.landingPage"),
      icon: <Globe className="w-5 h-5" />,
      permissions: ["historia_listar", "contacto_listar", "principio_listar", "valor_moral_listar", 
        "directiva_listar", "requisito_listar", "acuerdo_listar", "consulta_listar", "pregunta_frecuente_listar", "red_social_listar", 
        "banner_listar", "red_social_listar"],
      subItems: [
        {
          name: t("admin.sidebar.history"),
          path: "/admin/historias",
          icon: <History className="w-4 h-4" />,
          permissions: ["historia_listar"]
        },
        {
          name: t("admin.sidebar.contact"),
          path: "/admin/contactos",
          icon: <Contact className="w-4 h-4" />,
          permissions: ["contacto_listar"]
        },
        {
          name: t("admin.sidebar.principles"),
          path: "/admin/principios",
          icon: <Scale className="w-4 h-4" />,
          permissions: ["principio_listar"]
        },
        {
          name: t("admin.sidebar.moralValues"),
          path: "/admin/valores_morales",
          icon: <Star className="w-4 h-4" />,
          permissions: ["valor_moral_listar"]
        },
        { 
          name: t("admin.sidebar.requirementsWeb"), 
          path: "/admin/requisitos",
          icon: <Clipboard className="w-4 h-4" />,
          permissions: ["requisito_listar"]
        },
        { 
          name: t("admin.sidebar.agreements"), 
          path: "/admin/acuerdos",
          icon: <FileSignature className="w-4 h-4" />,
          permissions: ["acuerdo_listar"] 
        },
        { 
          name: t("admin.sidebar.consultations"), 
          path: "/admin/consultas",
          icon: <MessageSquare className="w-4 h-4" />,
          permissions: ["consulta_listar"] 
        },
        { 
          name: t("admin.sidebar.faq"), 
          path: "/admin/preguntas_frecuentes",
          icon: <HelpCircle className="w-4 h-4" />,
          permissions: ["pregunta_frecuente_listar"] 
        },
        { 
          name: t("admin.sidebar.banner"), 
          path: "/admin/banners",
          icon: <Image className="w-4 h-4" />,
          permissions: ["banner_listar"]
        },
        { 
          name: t("admin.sidebar.youtubeVideos", "YouTube Videos"), 
          path: "/admin/youtube-videos",
          icon: <PlayCircle className="w-4 h-4" />,
        },
        { 
          name: t("admin.sidebar.principalText", "Texto Principal"), 
          path: "/admin/textblock",
          icon: <FileText className="w-4 h-4" />,
          permissions: ["red_social_listar"]
        },
        { 
          name: t("admin.sidebar.youtubeVideos", "Videos de YouTube"), 
          path: "/admin/youtube-videos",
          icon: <PlayCircle className="w-4 h-4" />,
          permissions: ["red_social_listar"]
        },
        { 
          name: t("admin.sidebar.socialNetworks"), 
          path: "/admin/redes_sociales",
          icon: <Share2 className="w-4 h-4" />,
          permissions: ["red_social_listar"]
        },

      ],
    },
  ];

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

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
          })
        }
        // Also check whether the main route matches
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
      
      // Check if the current path should keep a submenu open
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
        
        // 🏠 Homeowner-specific items
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


  // 🔐 ACCESS RESTRICTION BY ROLES:
  // - Contractor: exclusive menu
  // - Dashboard: Visible para todos los usuarios autenticados
  // - Completed Jobs & Claims Submitted: Solo para homeowners
  // - Resto de rutas: Solo para admins (con filtros de permisos)
  const filteredNavItems = filterMenuItems(navItems);
  const filteredWebItems = filterMenuItems(webItems);

  // Hide the contractor menu if verification is false for contractor users
  const showContractorMenu = user && user.role_name === "contractor" && (user as any).verification === true;
  const filteredContractorItems = showContractorMenu ? contractorItems : [];

  // Homeowner menu: only show if homeowner and verification === true
  const showHomeownerMenu = user && user.role_name === "homeowner" && (user as any).verification === true;
  const filteredHomeownerItems = showHomeownerMenu ? homeownerItems : [];

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
            "GUD"
          ) : (
            <img src={Logo} alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Contractor or Homeowner menu */}
            {hasRole("contractor") ? (
              showContractorMenu ? (
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
                  {renderMenuItems(filteredContractorItems, "main")}
                </div>
              ) : (
                <div className="text-center text-gray-400 mt-8">
                  {t("contractor.sidebar.verified_message", "Your account is already verified. You do not have access to this menu.")}
                </div>
              )
            ) : hasRole("homeowner") ? (
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
                {renderMenuItems(filteredHomeownerItems, "main")}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;