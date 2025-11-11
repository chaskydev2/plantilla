import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import useAuth from "@/core/hooks/useAuth";
import { useTranslation } from "react-i18next";
import UnderConstruction from "@/components/common/UnderConstruction";
import { lazy, Suspense, useMemo } from "react";

// Lazy-load the heavier dashboard views to improve initial load time
const AdminDashboard = lazy(() => import("@/components/dashboard/AdminDashboard"));
const ContractorDashboard = lazy(() => import("@/components/dashboard/ContractorDashboard"));

/**
 * Dashboard Component
 * Main dashboard page that renders different views based on user role
 */
// Small spinner used as a Suspense fallback
function Spinner() {
  return (
    <div role="status" aria-live="polite" className="py-12 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Minimal Error Boundary to avoid crashing the app when lazy components fail
class ErrorBoundary extends ({} as any) {
  // Using a minimal class because React typings can be heavy in this file
  constructor(props: any) {
    // @ts-ignore
    super(props);
    // @ts-ignore
    this.state = { hasError: false };
  }
  // @ts-ignore
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  // @ts-ignore
  componentDidCatch(error: any, info: any) {
    // You can hook a logging service here
    // console.error('Dashboard lazy load error', error, info);
  }
  // @ts-ignore
  render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-700 rounded">
          <strong>Something went wrong loading this section.</strong>
        </div>
      );
    }
    // @ts-ignore
    return this.props.children;
  }
}

export default function Dashboard(): JSX.Element {
  const { hasRole, user } = useAuth();
  const { t } = useTranslation();

  // Decide which view to render based on roles. useMemo prevents
  // unnecessary re-evaluations when unrelated props change.
  const roleView = useMemo(() => {
    if (typeof hasRole === "function" && hasRole("admin")) {
      return <AdminDashboard />;
    }
    if (typeof hasRole === "function" && hasRole("contractor")) {
      // Pass user object (may be undefined) and let the child handle it
      return <ContractorDashboard user={user} />;
    }
    return <UnderConstruction />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRole, user]);

  return (
    <div>
      <PageBreadcrumb pageTitle={t("admin.dashboard.title") ?? "Dashboard"} />

      {/* Show a lightweight greeting when user is available */}
      {user && (
        <div className="mb-4 text-sm text-slate-600">{t("admin.dashboard.welcome", { name: user.name || user.email || "" })}</div>
      )}

      {/* Render the role-specific dashboard inside Suspense + ErrorBoundary */}
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          {roleView}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}