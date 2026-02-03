import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, LogIn, UserPlus, Home } from "lucide-react";
import NewLogoUrl from "@/assets/images/LOGO GUD.svg?url";
import NewLogoHoverUrl from "@/assets/images/LOGOGUD.svg?url";
import UserDropdown from "../header/UserDropdown";
import NotificationDropdown from "../header/NotificationDropdown";
import useAuth from "@/core/hooks/useAuth";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";
  const shouldBeTransparent = isHomePage && !scrolled && !isMenuOpen;

  const menuItems = [
    { name: t("navigation.about"), path: "/register-guara/how-it-works" },
    { name: t("navigation.joinAsPro"), path: "/join-as-pro" },
    { name: t("navigation.services"), path: "/services" },
    { name: t("navigation.scamAlerts"), path: "/scam-alerts" },
    { name: t("navigation.priceCheck"), path: "/fair-price-check" },
  ];

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          shouldBeTransparent
            ? "bg-transparent text-white backdrop-blur-sm"
            : "bg-[#ffed00] text-[#1A1B16] shadow-lg"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0 mr-6">
              <Link to="/" className="flex items-center space-x-2 group">
                <span className="relative h-12 w-auto">
                  <img
                    src={NewLogoHoverUrl}
                    alt="GU Logo"
                    className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:opacity-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).onerror = null;
                      e.currentTarget.src = "/vite.svg";
                    }}
                  />
                  <img
                    src={NewLogoUrl}
                    alt="GU Logo"
                    className="absolute inset-0 h-12 w-auto object-contain opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).onerror = null;
                      e.currentTarget.src = "/vite.svg";
                    }}
                  />
                </span>
                <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                  shouldBeTransparent ? "text-white" : "text-[#1A1B16]"
                }`}>
                  GUD
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 flex-grow justify-center">
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.path}
                    className={`
                      px-4 py-2 transition-all duration-300 relative flex items-center font-medium
                      ${shouldBeTransparent 
                        ? "text-white hover:text-yellow-200" 
                        : "text-[#1A1B16] hover:text-[#1A1B16]"
                      }
                      after:content-[''] after:absolute after:bottom-0 after:left-0
                      after:w-full after:h-0.5 after:transition-all after:duration-300 after:transform
                      ${location.pathname === item.path
                        ? `after:scale-x-100 ${shouldBeTransparent ? "after:bg-white" : "after:bg-[#1A1B16]"}`
                        : `after:scale-x-0 ${shouldBeTransparent ? "after:bg-white" : "after:bg-[#1A1B16]"} hover:after:scale-x-100`
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              {/* Language Selector */}
              <LanguageSelector />
              
              {isAuthenticated ? (
                /* Authenticated User Actions */
                <>
                  <NotificationDropdown />
                  <UserDropdown />
                </>
              ) : (
                /* Non-authenticated User Actions */
                <>
                  {/* Register Button - Primary CTA */}
                  <Link
                    to="/formulario_solicitud"
                    className={`
                      px-6 py-3 rounded-lg flex items-center font-bold text-sm
                      transition-all duration-300 transform hover:scale-105
                      shadow-lg hover:shadow-xl border-2 relative overflow-hidden
                      ${shouldBeTransparent 
                        ? "bg-gradient-to-r from-[#1A1B16] to-gray-800 text-white border-white/30 hover:from-black hover:to-[#1A1B16]" 
                        : "bg-gradient-to-r from-[#1A1B16] to-gray-800 text-white border-[#1A1B16] hover:from-black hover:to-[#1A1B16]"
                      }
                      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
                    `}
                  >
                    <UserPlus size={18} className="mr-2" />
                    {t("navigation.register")}
                  </Link>

                  {/* Login Button - Secondary */}
                  <Link
                    to="/login"
                    className={`
                      px-5 py-3 rounded-lg flex items-center font-medium text-sm
                      transition-all duration-200 shadow-md hover:shadow-lg
                      ${shouldBeTransparent 
                        ? "bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20" 
                        : "bg-white text-[#1A1B16] border border-gray-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    <LogIn size={16} className="mr-2" />
                    {t("navigation.login")}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-3">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/formulario_solicitud"
                    className={`p-2.5 rounded-full bg-gradient-to-r from-[#1A1B16] to-gray-800 text-white shadow-lg transition-transform hover:scale-105 ${
                      shouldBeTransparent ? "ring-2 ring-white/30" : ""
                    }`}
                  >
                    <UserPlus size={20} />
                  </Link>
                  <Link
                    to="/login"
                    className={`p-2.5 rounded-full transition-colors ${
                      shouldBeTransparent ? "text-white hover:bg-white/10" : "text-[#1A1B16] hover:bg-black/10"
                    }`}
                  >
                    <LogIn size={20} />
                  </Link>
                </>
              )}
              
              {isAuthenticated && (
                <>
                  <NotificationDropdown />
                  <UserDropdown />
                </>
              )}

              <button
                onClick={toggleMenu}
                className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  shouldBeTransparent 
                    ? "text-white hover:bg-white/10 focus:ring-white" 
                    : "text-[#1A1B16] hover:bg-black/10 focus:ring-[#1A1B16]"
                }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
            <div className="container mx-auto px-4 py-6">
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.path}
                        onClick={toggleMenu}
                        className={`
                          flex-1 px-4 py-3 text-left font-medium transition-colors rounded-lg
                          ${location.pathname === item.path
                            ? "bg-[#ffed00] text-[#1A1B16]"
                            : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        {item.name}
                      </Link>
                    </div>
                  </div>
                ))}
              </nav>

              {/* Mobile Auth Actions */}
              {!isAuthenticated && (
                <div className="mt-6 space-y-3 pt-6 border-t border-gray-200">
                  <Link
                    to="/formulario_solicitud"
                    onClick={toggleMenu}
                    className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-[#1A1B16] to-gray-800 text-white rounded-lg font-bold shadow-lg transition-transform hover:scale-105"
                  >
                    <UserPlus size={20} className="mr-3" />
                    {t("navigation.register")}
                  </Link>
                  
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="flex items-center justify-center w-full px-6 py-3 bg-[#ffed00] text-[#1A1B16] rounded-lg font-medium shadow-md transition-colors hover:bg-[#e0c02f]"
                  >
                    <LogIn size={18} className="mr-3" />
                    {t("navigation.login")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Breadcrumb Navigation */}
      {!isHomePage && !shouldBeTransparent && (
        <div className="pt-20 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center py-4 text-sm">
              <Link
                to="/"
                className="flex items-center text-gray-500 hover:text-[#1A1B16] transition-colors"
              >
                <Home size={16} className="mr-1" />
                Home
              </Link>
              {location.pathname !== "/" && (
                <>
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-[#1A1B16] font-medium">
                    {location.pathname.split('/').filter(Boolean).pop()?.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;