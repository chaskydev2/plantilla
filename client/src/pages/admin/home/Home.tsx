import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import useAuth from "@/core/hooks/useAuth";
import { useTranslation } from "react-i18next";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ContractorDashboard from "@/components/dashboard/ContractorDashboard";
import UnderConstruction from "@/components/common/UnderConstruction";

/**
 * Dashboard Component
 * Main dashboard page that renders different views based on user role
 */
export default function Dashboard() {
  const { hasRole, user } = useAuth();
  const { t } = useTranslation();

  return (
    <div>
      <PageBreadcrumb pageTitle={t("admin.dashboard.title")} />
      
      {/* 🔐 RESTRICCIÓN: Dashboard basado en roles de usuario */}
      {hasRole('admin') ? (
        <AdminDashboard />
      ) : hasRole('contractor') ? (
        <ContractorDashboard user={user!} />
      ) : (
        <UnderConstruction />
      )}
    </div>
  );
}