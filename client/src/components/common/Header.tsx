import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, ChevronDown, ChevronUp, LogIn, BadgeCheck } from "lucide-react";
import NewLogoUrl from "@/assets/images/LOGO GUD.svg?url";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";
  const shouldBeTransparent = isHomePage && !scrolled && !isMenuOpen;

  const menuItems = [
    {
      name: "Services",
      submenu: [
        { name: "Roofing", path: "#" },
        { name: "Siding", path: "#" },
        { name: "Windows", path: "#" },
      ],
    },
    { name: "Scam alerts", path: "#" },
    { name: "Fair price check", path: "#" },
    {
      name: "Directorii Guarantee",
      submenu: [
        { name: "How it works", path: "#" },
        { name: "What’s covered", path: "#" },
      ],
    },
    { name: "Register Guarantee", path: "#", icon: <BadgeCheck className="w-4 h-4 mr-2" /> },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        shouldBeTransparent
          ? "bg-transparent text-white"
          : "bg-[#F5D238] text-[#1A1B16] shadow-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center py-4 relative">
          <div className="flex items-center justify-self-start">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={NewLogoUrl}
                alt="Logo"
                className="h-10 w-auto mr-3 object-contain transition-all duration-300"
                onError={(e) => { (e.currentTarget as HTMLImageElement).onerror = null; e.currentTarget.src = "/vite.svg"; }}
              />
              <span className={`text-lg hidden xs:block font-bold ${shouldBeTransparent ? "text-white" : "text-[#1A1B16]"}`}>
              GU
              </span>
            </Link>
          </div>

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
                      after:w-[calc(100%-2rem)] after:h-0.5
                      after:transition-all after:duration-300 after:transform
                      ${location.pathname === item.path || (item.submenu && item.submenu.some(sub => location.pathname === sub.path))
                        ? `after:scale-x-100 ${shouldBeTransparent ? "after:bg-white" : "after:bg-[#1A1B16]"}`
                        : `after:scale-x-0 ${shouldBeTransparent ? "after:bg-white" : "after:bg-[#1A1B16]"} hover:after:scale-x-100`
                      }
                    `}
                  >
                    {('icon' in item && (item as any).icon) ? <span className="mr-1 -ml-1">{(item as any).icon}</span> : null}
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

                {item.submenu && (
                  <div
                    className={`
                      absolute left-0 mt-2 w-56 origin-top-right
                      rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5
                      divide-y divide-gray-100 focus:outline-none
                      transition-all duration-300 transform
                      ${hoveredItem === item.name
                        ? "opacity-100 translate-y-0 visible scale-100"
                        : "opacity-0 -translate-y-2 invisible scale-95"
                      }
                    `}
                  >
                    <div className="py-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`
                            block px-4 py-2.5 text-sm transition-all duration-200
                            ${location.pathname === subItem.path
                              ? "bg-primary text-white font-bold"
                              : "text-gray-700 hover:bg-gray-50 hover:text-primary hover:pl-5 hover:font-medium"
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

          {/* Right actions (desktop) */}
          <div className="hidden md:flex items-center justify-self-end">
            <Link
              to="/login"
              className={`
                ml-4 px-4 py-2 rounded-md flex items-center
                transition-colors duration-200
                ${shouldBeTransparent 
                  ? "bg-[#F5D238] text-[#1A1B16] hover:bg-[#e0c02f]" 
                  : "bg-white text-[#1A1B16] hover:bg-white/90 shadow-sm"
                }
              `}
            >
              <LogIn size={16} className="mr-2" />
              Ingresar
            </Link>
          </div>

          <div className="md:hidden flex items-center justify-self-end">
            <Link
              to="/login"
              className={`mr-4 p-2 rounded-full ${shouldBeTransparent ? "text-white" : "text-[#1A1B16]"}`}
            >
              <LogIn size={20} />
            </Link>
            <button
              onClick={toggleMenu}
              className="focus:outline-none"
            >
              {isMenuOpen ? (
                <X
                  size={24}
                  className={shouldBeTransparent ? "text-white" : "text-gray-800"}
                />
              ) : (
                <Menu
                  size={24}
                  className={shouldBeTransparent ? "text-white" : "text-gray-800"}
                />
              )}
            </button>
          </div>
        </div>
      </div>

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
                        ${
                          location.pathname === item.path ||
                          (item.submenu && item.submenu.some(sub => location.pathname === sub.path))
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }
                      `}
                    >
                      {item.name}
                      {openSubmenu === item.name ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    <div
                      className={`
                        overflow-hidden transition-all duration-300
                        ${openSubmenu === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                      `}
                    >
                      <div className="pl-4 space-y-1 mt-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            onClick={toggleMenu}
                            className={`
                              block px-3 py-2 rounded-md text-sm font-medium 
                              transition-colors duration-200
                              ${
                                location.pathname === subItem.path
                                  ? "bg-primary text-white"
                                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              }
                            `}
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
                    className={`
                      block px-3 py-2 rounded-md text-base font-medium 
                      transition-colors duration-200
                      ${
                        location.pathname === item.path
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            <Link
              to="/login"
              onClick={toggleMenu}
              className={`
                flex items-center px-3 py-2 rounded-md text-base font-medium 
                transition-colors duration-200 bg-primary text-white
                hover:bg-primary-dark
              `}
            >
              <LogIn size={16} className="mr-2" />
              Ingresar al sistema
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;