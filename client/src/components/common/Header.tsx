import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, ChevronDown, ChevronUp, LogIn, UserPlus, ChevronRight, Home } from "lucide-react";
import NewLogoUrl from "@/assets/images/LOGO GUD.svg?url";
import UserDropdown from "../header/UserDropdown";
import NotificationDropdown from "../header/NotificationDropdown";
import useAuth from "@/core/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";
  const shouldBeTransparent = isHomePage && !scrolled && !isMenuOpen;

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: Array<{ label: string; path: string; icon?: typeof Home; isLast?: boolean }> = [
      { label: 'Home', path: '/', icon: Home }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/[-_]/g, ' ');

      switch(segment.toLowerCase()) {
        case 'services': label = 'Services'; break;
        case 'scam-alerts': label = 'Scam Alerts'; break;
        case 'fair-price-check': label = 'Fair Price Check'; break;
        case 'gu-guarantee': label = 'GU Guarantee'; break;
        case 'register-guara': label = 'Register Guara'; break;
        case 'formulario_solicitud': label = 'Registration Form'; break;
        case 'login': label = 'Login'; break;
        case 'about': label = 'About Us'; break;
        case 'contact': label = 'Contact'; break;
      }

      breadcrumbs.push({ label, path: currentPath, isLast: index === pathSegments.length - 1 });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const menuItems = [
    { name: "Services", path: "/services"},
    { name: "Scam Alerts", path: "/scam-alerts" },
    { name: "Fair Price Check", path: "/fair-price-check" },
    { name: "GU Guarantee", path: "/gu-guarantee" },
    {
      name: "Register Guara",
      submenu: [
        { name: "How it works", path: "/register-guara" },
        { name: "What’s covered", path: "/register-guara" },
      ],
    },
  ];

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          shouldBeTransparent
            ? "bg-transparent text-white"
            : "bg-[#F5D238] text-[#1A1B16] shadow-md"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center py-4 relative">
            {/* Logo */}
            <div className="flex items-center justify-self-start">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src={NewLogoUrl}
                  alt="Logo"
                  className="h-10 w-auto mr-3 object-contain transition-all duration-300"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).onerror = null; e.currentTarget.src = "/vite.svg"; }}
                />
                <span className={`text-lg hidden xs:block font-bold ${shouldBeTransparent ? "text-white" : "text-[#1A1B16]"}`}>GU</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 xl:gap-8 justify-self-center whitespace-nowrap">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center">
                    <Link
                      to={item.submenu ? '#' : item.path}
                      className={`
                        px-4 py-2 transition-all duration-300 relative flex items-center
                        ${shouldBeTransparent ? "text-white hover:text-gray-200" : "text-[#1A1B16] hover:text-[#1A1B16]"}
                        after:content-[''] after:absolute after:bottom-0 after:left-4
                        after:w-[calc(100%-2rem)] after:h-0.5 after:transition-all after:duration-300 after:transform
                        ${location.pathname === item.path || (item.submenu && item.submenu.some(sub => location.pathname === sub.path))
                          ? `after:scale-x-100 ${shouldBeTransparent ? "after:bg-white" : "after:bg-[#1A1B16]"}`
                          : `after:scale-x-0 ${shouldBeTransparent ? "after:bg-white" : "after:bg-[#1A1B16]"} hover:after:scale-x-100`
                        }
                      `}
                    >
                      {item.name}
                      {item.submenu && (
                        <ChevronDown
                          size={16}
                          className={`
                            ml-1 transition-transform duration-300
                            ${hoveredItem === item.name ? "rotate-180" : ""}
                            ${shouldBeTransparent ? "text-white group-hover:text-gray-200" : "text-[#1A1B16] group-hover:text-[#1A1B16]"}
                          `}
                        />
                      )}
                    </Link>
                  </div>

                  {/* Submenu Desktop */}
                  {item.submenu && (
                    <div
                      className={`
                        absolute left-0 mt-2 w-60 origin-top-right
                        rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-10
                        divide-y divide-gray-100 focus:outline-none
                        transition-all duration-300 transform
                        ${hoveredItem === item.name
                          ? "opacity-100 translate-y-0 visible scale-100"
                          : "opacity-0 -translate-y-2 invisible scale-95"
                        }
                      `}
                    >
                      <div className="py-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`
                              block px-5 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-2 my-1
                              ${location.pathname === subItem.path
                                ? "bg-yellow-500 text-white font-semibold"
                                : "text-gray-700 hover:bg-yellow-100 hover:text-yellow-600"
                              }
                            `}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions Desktop */}
            <div className="hidden md:flex items-center justify-self-end gap-3">
              {isAuthenticated ? (
                // Authenticated user: Show notifications and user dropdown
                <>
                  <NotificationDropdown />
                  <UserDropdown />
                </>
              ) : (
                // Not authenticated: Show register and login buttons
                <>
                  <Link
                    to="/formulario_solicitud"
                    className={`
                      px-6 py-3 rounded-lg flex items-center font-bold transition-all duration-300 transform hover:scale-105
                      shadow-md hover:shadow-lg border-2 relative overflow-hidden
                      ${shouldBeTransparent 
                        ? "bg-gradient-to-r from-[#1A1B16] to-gray-800 text-white border-white/20 hover:from-[#1A1B16] hover:to-black" 
                        : "bg-gradient-to-r from-[#1A1B16] to-gray-800 text-white border-[#1A1B16] hover:from-black hover:to-[#1A1B16]"
                      }
                      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
                      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
                    `}
                  >
                    <UserPlus size={18} className="mr-2" />
                    Register
                  </Link>

                  <Link
                    to="/login"
                    className={`
                      px-4 py-2 rounded-md flex items-center transition-colors duration-200
                      ${shouldBeTransparent 
                        ? "bg-[#F5D238] text-[#1A1B16] hover:bg-[#e0c02f]" 
                        : "bg-white text-[#1A1B16] hover:bg-white/90 shadow-sm"
                      }
                    `}
                  >
                    <LogIn size={16} className="mr-2" />
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center justify-self-end">
              {isAuthenticated ? (
                // Authenticated user mobile: Show compact notifications and menu
                <>
                  <div className="mr-3 scale-75">
                    <NotificationDropdown />
                  </div>
                  <button onClick={toggleMenu} className="focus:outline-none">
                    {isMenuOpen ? (
                      <X size={24} className={shouldBeTransparent ? "text-white" : "text-gray-800"} />
                    ) : (
                      <Menu size={24} className={shouldBeTransparent ? "text-white" : "text-gray-800"} />
                    )}
                  </button>
                </>
              ) : (
                // Not authenticated mobile: Show register, login and menu buttons
                <>
                  <Link
                    to="/formulario_solicitud"
                    className={`mr-3 p-2 rounded-full bg-gradient-to-r from-[#1A1B16] to-gray-800 text-white shadow-md ${shouldBeTransparent ? "ring-2 ring-white/20" : ""}`}
                  >
                    <UserPlus size={18} />
                  </Link>
                  <Link
                    to="/login"
                    className={`mr-4 p-2 rounded-full ${shouldBeTransparent ? "text-white" : "text-[#1A1B16]"}`}
                  >
                    <LogIn size={20} />
                  </Link>
                  <button onClick={toggleMenu} className="focus:outline-none">
                    {isMenuOpen ? (
                      <X size={24} className={shouldBeTransparent ? "text-white" : "text-gray-800"} />
                    ) : (
                      <Menu size={24} className={shouldBeTransparent ? "text-white" : "text-gray-800"} />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`
                          flex justify-between w-full px-3 py-2 rounded-md text-base font-medium 
                          transition-colors duration-200
                          ${location.pathname === item.path || (item.submenu && item.submenu.some(sub => location.pathname === sub.path))
                            ? "bg-yellow-500 text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }
                        `}
                      >
                        {item.name}
                        {openSubmenu === item.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openSubmenu === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="pl-4 space-y-1 mt-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              onClick={toggleMenu}
                              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                ${location.pathname === subItem.path ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={toggleMenu}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                        ${location.pathname === item.path ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {isAuthenticated ? (
                // Authenticated mobile: Show user info and logout
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="px-3 py-2 mb-4">
                    <UserDropdown />
                  </div>
                </div>
              ) : (
                // Not authenticated mobile: Show register and login
                <>
                  {/* Mobile Register */}
                  <Link
                    to="/formulario_solicitud"
                    onClick={toggleMenu}
                    className="flex items-center px-3 py-3 rounded-md text-base font-bold transition-all duration-300 transform hover:scale-102 bg-gradient-to-r from-[#1A1B16] to-gray-800 text-white shadow-lg border border-gray-600 mx-2 mb-2"
                  >
                    <UserPlus size={18} className="mr-3" />
                    Register Account
                  </Link>

                  {/* Mobile Login */}
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 bg-yellow-500 text-[#1A1B16] hover:bg-yellow-400"
                  >
                    <LogIn size={16} className="mr-2" />
                    Login
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Breadcrumb Submenu - Enhanced Design */}
      {!isHomePage && (
        <nav 
          className={`fixed w-full z-40 transition-all duration-300 shadow-sm ${
            shouldBeTransparent 
              ? "bg-gradient-to-r from-black/30 via-black/25 to-black/30 backdrop-blur-md border-white/20" 
              : "bg-gradient-to-r from-[#F5D238] via-[#F8D547] to-[#F5D238] border-[#E6C732]"
          } border-b`}
          style={{ top: '77px' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ol className="flex items-center space-x-1 py-3">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center">
                  {index === 0 ? (
                    <Link 
                      to={crumb.path} 
                      className={`
                        flex items-center px-3 py-2 rounded-lg transition-all duration-200 group
                        ${shouldBeTransparent 
                          ? "text-white/90 hover:text-white hover:bg-white/10" 
                          : "text-[#1A1B16]/80 hover:text-[#1A1B16] hover:bg-white/30"
                        }
                      `}
                    >
                      <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      <span className="hidden sm:inline font-medium text-sm">{crumb.label}</span>
                    </Link>
                  ) : (
                    <>
                      <div className="flex items-center mx-1">
                        <ChevronRight 
                          className={`w-4 h-4 ${
                            shouldBeTransparent ? "text-white/60" : "text-[#1A1B16]/60"
                          }`} 
                        />
                      </div>
                      {index === breadcrumbs.length - 1 ? (
                        <span 
                          className={`
                            px-3 py-2 rounded-lg font-semibold text-sm
                            ${shouldBeTransparent 
                              ? "text-white bg-white/15 backdrop-blur-sm" 
                              : "text-[#1A1B16] bg-white/50 shadow-sm"
                            }
                          `}
                        >
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          to={crumb.path}
                          className={`
                            px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                            ${shouldBeTransparent 
                              ? "text-white/80 hover:text-white hover:bg-white/10" 
                              : "text-[#1A1B16]/70 hover:text-[#1A1B16] hover:bg-white/30"
                            }
                          `}
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
