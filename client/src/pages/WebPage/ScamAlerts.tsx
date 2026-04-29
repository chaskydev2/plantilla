import React, { useCallback, useEffect, useState } from 'react';

import ShareToast from '@/components/ShareToast';
import ScamReportCard from '@/components/ScamReportCard';
import { ScamAlertService } from '@/core/services/homeowner/scamAlert.service';
import type { IScamAlert } from '@/core/types/IScamAlert';
// Tipos
interface ScamReportsListProps {
  scamReports: IScamAlert[];
  setShowToast: (show: boolean) => void;
}

const ScamAlerts: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [scamReports, setScamReports] = useState<IScamAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScamAlerts = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ScamAlertService.getAllPublic({ signal });
      setScamReports(response?.data ?? []);
    } catch (err: unknown) {
      const errorInfo = err as { code?: string; message?: string; name?: string };
      if (errorInfo?.code === 'ERR_CANCELED' || errorInfo?.name === 'CanceledError') {
        return;
      }
      setError(errorInfo?.message || 'Unable to load scam alerts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchScamAlerts(controller.signal);
    return () => controller.abort();
  }, [fetchScamAlerts]);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <ShareToast showToast={showToast} setShowToast={setShowToast} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb />

        {loading ? (
          <StateMessage message="Loading scam alerts..." />
        ) : error ? (
          <StateMessage message={error} variant="error" onRetry={() => fetchScamAlerts()} />
        ) : scamReports.length === 0 ? (
          <StateMessage message="No scam alerts have been published yet." />
        ) : (
          <ScamReportsList scamReports={scamReports} setShowToast={setShowToast} />
        )}

        <LoadMoreButton onReload={() => fetchScamAlerts()} loading={loading} />
      </div>
    </div>
  );
};

// Subcomponentes
const Breadcrumb: React.FC = () => (
  <div className="max-w-4xl mx-auto mb-6">
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
      
    </nav>
    <h2 className="text-2xl font-bold text-gray-900">Scam alerts</h2>
  </div>
);


const ScamReportsList: React.FC<ScamReportsListProps> = ({ scamReports, setShowToast }) => (
  <div className="grid gap-6 max-w-4xl mx-auto">
    {scamReports.map((report) => (
      <ScamReportCard 
        key={report.id} 
        report={report} 
        setShowToast={setShowToast} 
      />
    ))}
  </div>
);

const LoadMoreButton: React.FC<{ onReload: () => void; loading: boolean }> = ({ onReload, loading }) => (
  <div className="text-center mt-12">
    <button
      onClick={onReload}
      disabled={loading}
      className="bg-[#1A1B16] hover:bg-[#2A2B26] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
    >
      {loading ? 'Refreshing...' : 'Refresh Alerts'}
    </button>
  </div>
);

const StateMessage: React.FC<{ message: string; variant?: 'default' | 'error'; onRetry?: () => void }> = ({ message, variant = 'default', onRetry }) => (
  <div
    className={`max-w-4xl mx-auto mt-10 rounded-2xl border px-6 py-8 text-center ${
      variant === 'error'
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-gray-200 bg-white text-gray-600'
    }`}
  >
    <p className="font-semibold">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center justify-center rounded-full border border-[#1A1B16] px-4 py-2 text-sm font-semibold text-[#1A1B16] transition hover:bg-[#1A1B16] hover:text-white"
      >
        Try Again
      </button>
    )}
  </div>
);

export default ScamAlerts;