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
import HomePage from "@/pages/WebPage/HomePage";
import ContactPage from "@/pages/WebPage/ContactPage";
import PrivateRoute from "./PrivateRoute";
import GuestRoute from "./GuestRoute";

import HomeAdmin from "@/pages/admin/home/Home";
import UserPage from "@/pages/admin/users/Main";
import UserShowPage from "@/pages/admin/users/Show";
import RolPage from "@/pages/admin/roles/Main";
import RolPermissionPage from "@/pages/admin/roles/permissions/Main";
import PermissionPage from "@/pages/admin/permissions/Main";
import AnnouncementPage from "@/pages/admin/announcements/Main";
import CoursePage from "@/pages/admin/courses/Main";
import PaymentPage from "@/pages/admin/monthlypay/Main";
import PaymentReport from "@/pages/admin/monthlypay/Report";
import HistoryAdminPage from "@/pages/admin/histories/Main";
import ContactAdminPage from "@/pages/admin/contacts/Main";
import BeginningPage from "@/pages/admin/beginnings/Main";
import MoralValuePage from "@/pages/admin/moral-values/Main";
import RequirementAdminPage from "@/pages/admin/requirements/Main";
import AgreementAdminPage from "@/pages/admin/agreements/Main";
import NewsletterPage from "@/pages/admin/newsletters/Main";
import FaqPage from "@/pages/admin/faqs/Main";
import BannerPage from "@/pages/admin/banners/Main";
import SocialNetworkPage from "@/pages/admin/social-networks/Main";
import ProfessionPage from "@/pages/admin/professions/Main";
import TagPage from "@/pages/admin/tags/Main";
import ContractorPage from "@/pages/admin/contractors/Main";

import AtributesPage from "@/pages/admin/attributes/Main";
import CategoryPage from "@/pages/admin/categories/Main";


import Requisitospage from "@/pages/WebPage/RequirementsPage";
import Renovationpage from "@/pages/WebPage/RenovationPage";
import Certificacionespage from "@/pages/WebPage/CertificationsPage";
import Formulariopage from "@/pages/WebPage/FormPage";
import AffiliatesPage from "@/pages/WebPage/AffiliatesPage";
import FindProPage from "@/pages/WebPage/FindPro/FindProPage";
import UserProfiles from "@/pages/admin/UserProfiles";


import ScamAlerts from "@/pages/WebPage/ScamAlerts";
import FairPriceCheck from "@/pages/WebPage/FairPriceCheck";
import GuGuarantee from "@/pages/WebPage/GuGuarantee";
import RegisterGuara from "@/pages/WebPage/RegisterGuara";
import RegisterGuaraHowItWorks from "@/pages/WebPage/RegisterGuara/HowItWorks";
import RegisterGuaraWhatCover from "@/pages/WebPage/RegisterGuara/WhatCover";

import HomeownerPage from "@/pages/admin/homeowners/Main";
import JobApplicationPage from "@/pages/admin/job-applications/main";
import JobContractsPage from "@/pages/admin/job-contracts/main";
import JobPostsPage from "@/pages/admin/job-posts/main";

import JobPage from "@/pages/admin/jobs/Main";

import JobPageContrator from "@/pages/contractor/jobs/Main";

import AttributeContractorList from "@/pages/admin/attribute-contractor/main";
import AttributeContractor from "@/pages/contractor/documents/Main";

import TagsContrator from "@/pages/contractor/tags/Main";

import Team from "@/pages/contractor/team/Main";

import ServicePage from "@/pages/admin/services/Main";

import TeamUser from "@/pages/contractor/team-user/Main";

import AttributeHomeownerList from "@/pages/admin/attribute-homeowner/main";
import HomeownerDocumentsList from "@/pages/homeownner/documents/Main";

import PostJob from "@/pages/homeownner/PostJob/Main";

import PostJobAdmin from "@/pages/admin/PostJob/Main";

import JobAdmin from "@/pages/admin/jobs/Main";

import Services from "@/pages/WebPage/Services";
import JoinAsPro from "@/pages/WebPage/JoinAsPro";

import LoaderScreen from "@/components/common/LoaderScreen";
import { ToastContainer } from "react-toastify";

import ContractorProfilePage from "@/pages/WebPage/FindPro/ContractorProfilePage";

import HomeownerServiceList from "@/pages/homeownner/service/Main";
import HomeownerServiceForm from "@/pages/homeownner/service/Form";

import HomeClaimsList from "@/pages/homeownner/claims/Main";

import ContractorChats from "@/pages/contractor/chatst/Main"; 
import ContractorNotifications from "@/pages/contractor/notifications/Main";

import HomeownerChats from "@/pages/homeownner/chatst/Main";
import HomeownerNotifications from "@/pages/homeownner/notifications/Main";

import TextBlockMain  from "@/pages/admin/textblock/Main";
import ClaimAdmin from "@/pages/admin/claim/Main";
import YouTubeVideosMain from "@/pages/admin/youtube-videos/Main";

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
            <Route path="/findpro" element={<FindProPage />} />
            <Route path="/findpro/contractor/:id" element={<ContractorProfilePage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/requisitos" element={<Requisitospage />} />
            <Route path="/renovacion_datos" element={<Renovationpage />} />
            <Route path="/afiliados" element={<AffiliatesPage />} />
            <Route path="/certificacion_trabajo" element={<Certificacionespage />} />
            <Route path="/formulario_solicitud" element={<Formulariopage />} />
            <Route path="/scam-alerts" element={<ScamAlerts />} />
            <Route path="/fair-price-check" element={<FairPriceCheck />} />
            <Route path="/gu-guarantee" element={<GuGuarantee />} />
            <Route path="/register-guara" element={<RegisterGuara />} />
            <Route path="/register-guara/how-it-works" element={<RegisterGuaraHowItWorks />} />
            <Route path="/register-guara/what-cover" element={<RegisterGuaraWhatCover />} />
            <Route path="/join-as-pro" element={<JoinAsPro />} />
            <Route path="/services" element={<Services />} />
            <Route path="/loader" element={<LoaderScreen />} />

          </Route>

          {/* Dashboard Layout - Organized by User Roles */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayoutAdmin />}>
              
              {/* SHARED ROUTES - Accessible by ALL authenticated users */}
              <Route path="/admin" element={<HomeAdmin />} />
              <Route path="/admin/perfil" element={<UserProfiles />} />

              {/* ADMIN ONLY ROUTES - System Administration */}
              <Route path="/admin/usuarios" element={<UserPage />} />
              <Route path="/admin/usuarios/:id" element={<UserShowPage />} />
              <Route path="/admin/roles" element={<RolPage />} />
              <Route path="/admin/roles/:id/permisos" element={<RolPermissionPage />} />
              <Route path="/admin/permisos" element={<PermissionPage />} />
              <Route path="/admin/comunicados" element={<AnnouncementPage />} />
              <Route path="/admin/cursos" element={<CoursePage />} />
              <Route path="/admin/montlypay" element={<PaymentPage />} />
              <Route path="/admin/montlypayreport" element={<PaymentReport />} />
              <Route path="/admin/profesiones" element={<ProfessionPage />} />
              <Route path="/admin/etiquetas" element={<TagPage />} />
              <Route path="/admin/atributes" element={<AtributesPage />} />
              <Route path="/admin/categories" element={<CategoryPage />} />
              
              {/* ADMIN ONLY - Website Content Management */}
              <Route path="/admin/historias" element={<HistoryAdminPage />} />
              <Route path="/admin/contactos" element={<ContactAdminPage />} />
              <Route path="/admin/principios" element={<BeginningPage />} />
              <Route path="/admin/valores_morales" element={<MoralValuePage />} />
              <Route path="/admin/requisitos" element={<RequirementAdminPage />} />
              <Route path="/admin/acuerdos" element={<AgreementAdminPage />} />
              <Route path="/admin/consultas" element={<NewsletterPage />} />
              <Route path="/admin/preguntas_frecuentes" element={<FaqPage />} />
              <Route path="/admin/banners" element={<BannerPage />} />
              <Route path="/admin/redes_sociales" element={<SocialNetworkPage />} />

              <Route path="/admin/redes_sociales" element={<SocialNetworkPage />} />
              {/* ADMIN ONLY - User Management */}
              <Route path="/admin/trabajadores" element={<ContractorPage />} />
              <Route path="/admin/homeowners" element={<HomeownerPage />} />
             
              <Route path="/admin/job-applications" element={<JobApplicationPage />} />
              
              <Route path="/admin/job-contracts" element={<JobContractsPage/>} />

              <Route path="/admin/job-post" element={<JobPostsPage/>} />

              
              <Route path="/admin/job-post" element={<JobPostsPage/>} />


              <Route path="/admin/atribute_contractor" element={<AttributeContractorList />} />

              <Route path="/admin/attribute_homeowner" element={<AttributeHomeownerList />} />

              <Route path="/admin/jobs" element={<JobPage/>} />

              <Route path="/admin/services" element={<ServicePage />} />


             
              <Route path="/admin/post-job" element={<PostJobAdmin/>} />
              
              <Route path="/admin/job" element={<JobAdmin/>} />

              <Route path="/admin/claim" element={<ClaimAdmin/>} />

              <Route path="/admin/textblock" element={<TextBlockMain/>} />
              <Route path="/admin/youtube-videos" element={<YouTubeVideosMain/>} />
           

              {/* CONTRACTOR SPECIFIC ROUTES */}
              <Route path="/contractor/perfil" element={<UserProfiles />} />
              
              <Route path="/contractor/projects" element={<UserProfiles />} />
              
              <Route path="/contractor/customers" element={<UserProfiles />} />

              <Route path="/contractor/customers" element={<UserProfiles />} />
              
              <Route path="/contractor/documents" element={<AttributeContractor />} />
                            
              <Route path="/contractor/jobs" element={<JobPageContrator/>} />

              <Route path="/contractor/tags" element={<TagsContrator/>} />
              
              <Route path="/contractor/team" element={<Team/>} />
              
              <Route path="/contractor/team-user" element={<TeamUser/>} />
              
              <Route path="/contractor/chats" element={<ContractorChats/>} />
              
              <Route path="/contractor/notifications" element={<ContractorNotifications />} />

              {/* HOMEOWNER SPECIFIC ROUTES */}
              <Route path="/homeowner/post-job" element={<PostJob/>} />
              <Route path="/homeowner/jobs" element={<JobPage/>} />
              {/* Homeowner claims list */}
              <Route path="/homeowner/claims" element={<HomeClaimsList/>} />
              <Route path="/homeowner/documents" element={<HomeownerDocumentsList/>} />
              <Route path="/homeowner/payments" element={<PaymentPage/>} />
              <Route path="/homeowner/perfil" element={<UserProfiles/>} />
              <Route path="/homeowner/services/form" element={<HomeownerServiceForm/>} />
              <Route path="/homeowner/services" element={<HomeownerServiceList/>} />

              <Route path="/homeowner/chats" element={<HomeownerChats />} />
               <Route path="/homeowner/notifications" element={<HomeownerNotifications />} />

              <Route path="/admin/job" element={<JobAdmin/>} />

              {/* Note: Add contractor-specific routes here when components are created */}
              {/* <Route path="/admin/contractor/proyectos" element={<ContractorProjectsPage />} /> */}
              {/* <Route path="/admin/contractor/clientes" element={<ContractorClientsPage />} /> */}
              {/* <Route path="/admin/contractor/calendario" element={<ContractorCalendarPage />} /> */}
              {/* <Route path="/admin/contractor/cotizaciones" element={<ContractorQuotesPage />} /> */}
              {/* <Route path="/admin/contractor/trabajos" element={<ContractorJobsPage />} /> */}
              {/* <Route path="/admin/contractor/servicios" element={<ContractorServicesPage />} /> */}

              {/* HOMEOWNER SPECIFIC ROUTES */}
              {/* Note: Add homeowner-specific routes here when components are created */}
              {/* <Route path="/admin/homeowner/perfil" element={<HomeownerProfile />} /> */}
              {/* <Route path="/admin/homeowner/solicitudes" element={<HomeownerRequestsPage />} /> */}
              {/* <Route path="/admin/homeowner/contratistas" element={<HomeownerContractorsPage />} /> */}
              {/* <Route path="/admin/homeowner/historial" element={<HomeownerJobHistoryPage />} /> */}
              {/* <Route path="/admin/homeowner/valoraciones" element={<HomeownerReviewsPage />} /> */}
              {/* <Route path="/admin/homeowner/pagos" element={<HomeownerPaymentsPage />} /> */}
              {/* <Route path="/admin/homeowner/favoritos" element={<HomeownerFavoritesPage />} /> */}
              

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
