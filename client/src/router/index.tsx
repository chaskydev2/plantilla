import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import variables from "@/core/config/variables";
import { useDispatch } from "react-redux";
import { getMe } from "@/core/reducer/auth.reducer";
import type { AppDispatch } from "@/store";

import AppLayoutAdmin from "@/components/layout/AppLayoutAdmin";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import AppLayoutWeb from "@/components/layout/AppLayoutWeb";

import SignIn from "@/pages/AuthPages/SignIn";
import NotFound from "@/pages/OtherPage/NotFound";
import Unauthorized from "@/pages/OtherPage/Unauthorized";

// Web (público)
import HomePage from "@/pages/WebPage/HomePage";
import ContactPage from "@/pages/WebPage/ContactPage";
// 🧹 Eliminado: EventsPage
// 🧹 Eliminado: CoursesPage (público)
// 🧹 Eliminado: CertificationsPage (público)
import Historypage from "@/pages/WebPage/Historypage";
import Directivapage from "@/pages/WebPage/DirectivePage";
import Requisitospage from "@/pages/WebPage/RequirementsPage";
import Estatutospage from "@/pages/WebPage/StatutesPage";
import Visionpage from "@/pages/WebPage/Visionpage";
import Conveniospage from "@/pages/WebPage/AgreementsPage";
import Renovationpage from "@/pages/WebPage/RenovationPage";
import Visadopage from "@/pages/WebPage/Visadopage";
import Formulariopage from "@/pages/WebPage/FormPage";
import AffiliatesPage from "@/pages/WebPage/AffiliatesPage";

import PrivateRoute from "./PrivateRoute";
import GuestRoute from "./GuestRoute";

// Admin
import HomeAdmin from "@/pages/admin/home/Home";
import UserPage from "@/pages/admin/users/Main";
import UserShowPage from "@/pages/admin/users/Show";
import RolPage from "@/pages/admin/roles/Main";
import RolPermissionPage from "@/pages/admin/roles/permissions/Main";
import PermissionPage from "@/pages/admin/permissions/Main";
// 🧹 Eliminados (admin):
// import AnnouncementPage from "@/pages/admin/announcements/Main";
// import EventTypePage from "@/pages/admin/event-types/Main";
// import EventPage from "@/pages/admin/events/Main";
// import CoursePage from "@/pages/admin/courses/Main";
// import PaymentPage from "@/pages/admin/monthlypay/Main";
// import PaymentReport from "@/pages/admin/monthlypay/Report";

import HistoryAdminPage from "@/pages/admin/histories/Main";
import ContactAdminPage from "@/pages/admin/contacts/Main";
import BeginningPage from "@/pages/admin/beginnings/Main";
import MoralValuePage from "@/pages/admin/moral-values/Main";
import DirectivityAdminPage from "@/pages/admin/directivities/Main";
import RequirementAdminPage from "@/pages/admin/requirements/Main";
import AgreementAdminPage from "@/pages/admin/agreements/Main";
import NewsletterPage from "@/pages/admin/newsletters/Main";
import FaqPage from "@/pages/admin/faqs/Main";
import BannerPage from "@/pages/admin/banners/Main";
import SocialNetworkPage from "@/pages/admin/social-networks/Main";

import UserProfiles from "@/pages/admin/UserProfiles";

import LoaderScreen from "@/components/common/LoaderScreen";
import { ToastContainer } from "react-toastify";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(variables.session.tokenName);
    if (token) {
      dispatch(getMe()).finally(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, [dispatch]);

  if (checkingAuth) {
    return <LoaderScreen />;
  }

  return (
    <>
      <Router>
        <ToastContainer />
        <ScrollToTop />
        <Routes>
          {/* Web Layout */}
          <Route element={<AppLayoutWeb />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/contacto" element={<ContactPage />} />
            {/* 🧹 Eliminadas rutas públicas: /cursos, /events, /certificacion_trabajo */}
            <Route path="/historia" element={<Historypage />} />
            <Route path="/mision" element={<Visionpage />} />
            <Route path="/convenios" element={<Conveniospage />} />
            <Route path="/directiva" element={<Directivapage />} />
            <Route path="/estatutos" element={<Estatutospage />} />
            <Route path="/requisitos" element={<Requisitospage />} />
            <Route path="/renovacion_datos" element={<Renovationpage />} />
            <Route path="/visado_planos" element={<Visadopage />} />
            <Route path="/afiliados" element={<AffiliatesPage />} />
            <Route path="/formulario_solicitud" element={<Formulariopage />} />
          </Route>

          {/* Dashboard Layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayoutAdmin />}>
              <Route path="/admin" element={<HomeAdmin />} />
              <Route path="/admin/perfil" element={<UserProfiles />} />

              {/* Usuarios / Roles / Permisos (se mantienen) */}
              <Route path="/admin/usuarios" element={<UserPage />} />
              <Route path="/admin/usuarios/:id" element={<UserShowPage />} />
              <Route path="/admin/roles" element={<RolPage />} />
              <Route path="/admin/roles/:id/permisos" element={<RolPermissionPage />} />
              <Route path="/admin/permisos" element={<PermissionPage />} />

              {/* 🧹 Eliminadas rutas admin:
                  /admin/comunicados
                  /admin/tipo_eventos
                  /admin/eventos
                  /admin/cursos
                  /admin/montlypay
                  /admin/montlypayreport
              */}

              {/* Web (admin) que sí permanece */}
              <Route path="/admin/historias" element={<HistoryAdminPage />} />
              <Route path="/admin/contactos" element={<ContactAdminPage />} />
              <Route path="/admin/principios" element={<BeginningPage />} />
              <Route path="/admin/valores_morales" element={<MoralValuePage />} />
              <Route path="/admin/directiva" element={<DirectivityAdminPage />} />
              <Route path="/admin/requisitos" element={<RequirementAdminPage />} />
              <Route path="/admin/acuerdos" element={<AgreementAdminPage />} />
              <Route path="/admin/consultas" element={<NewsletterPage />} />
              <Route path="/admin/preguntas_frecuentes" element={<FaqPage />} />
              <Route path="/admin/banners" element={<BannerPage />} />
              <Route path="/admin/redes_sociales" element={<SocialNetworkPage />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<SignIn />} />
          </Route>

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
