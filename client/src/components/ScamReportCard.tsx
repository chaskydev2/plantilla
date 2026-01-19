import React from 'react';
import { MapPin, Calendar, DollarSign, MessageSquare } from "lucide-react";
import ShareButton from './ShareButton';
import type { IScamAlert, ScamAlertStatus } from '@/core/types/IScamAlert';

interface ScamReportCardProps {
  report: IScamAlert;
  setShowToast: (show: boolean) => void;
}

const statusStyles: Record<ScamAlertStatus, string> = {
  active: 'bg-amber-100 text-amber-700 border border-amber-200',
  resolved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const formatStates = (states?: string[] | string | null) => {
  if (!states || (Array.isArray(states) && states.length === 0)) return 'Not specified';
  return Array.isArray(states) ? states.join(', ') : states;
};

const formatAmount = (value?: number | null) => {
  if (value === null || value === undefined) return 'Not provided';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

const formatComplaints = (value?: number | null) => {
  if (value === null || value === undefined) return 'Not provided';
  return value >= 10 ? `${value}+` : `${value}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not provided' : date.toLocaleDateString();
};

const ScamReportCard: React.FC<ScamReportCardProps> = ({ report, setShowToast }) => {
  return (
    <div className="rounded-2xl border  shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300" style={{ background: 'white', color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)', opacity: 1, transform: 'none' }}>
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#F5D238] mb-2">
              {report.business_name}
            </h2>
            {report.legal_name && (
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Registered as {report.legal_name}</p>
            )}
          </div>
          {report.status && (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusStyles[report.status] ?? 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
              {report.status}
            </span>
          )}
          <ShareButton setShowToast={setShowToast} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeftColumn report={report} />
          <RightColumn report={report} />
        </div>
      </div>

      {/* Footer */}
      <CardFooter />
    </div>
  );
};

// Componentes hijos con tipos
const LeftColumn: React.FC<{ report: IScamAlert }> = ({ report }) => (
  <div className="space-y-4">
    <LocationInfo report={report} />
    <BusinessOwnerInfo report={report} />
    <ReasonInfo report={report} />
  </div>
);

const RightColumn: React.FC<{ report: IScamAlert }> = ({ report }) => (
  <div className="space-y-4">
    <AmountInfo report={report} />
    <ComplaintsInfo report={report} />
    <ResponseInfo report={report} />
    <DateInfo report={report} />
  </div>
);

// Componentes de información específica
const LocationInfo: React.FC<{ report: IScamAlert }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
    <div className="flex items-center gap-1 text-gray-600">
      <MapPin className="h-4 w-4" />
      <span>
        {formatStates(report.operating_states)}
        <span className="text-gray-400 ml-1">
          (complaint location: {report.complaint_location ?? 'Not specified'})
        </span>
      </span>
    </div>
  </div>
);

const BusinessOwnerInfo: React.FC<{ report: IScamAlert }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Business Owner</h3>
    <p className="text-gray-600">{report.business_owner ?? 'Not provided'}</p>
  </div>
);

const ReasonInfo: React.FC<{ report: IScamAlert }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Reason for Listing</h3>
    <ul className="text-gray-600 list-disc list-inside space-y-1">
      <li>{report.reason_for_listing || 'Reason not provided'}</li>
      {report.complaint_location && <li>Filed in {report.complaint_location}</li>}
    </ul>
  </div>
);

const AmountInfo: React.FC<{ report: IScamAlert }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Amount in Dispute</h3>
    <div className="flex items-center gap-2 text-gray-600">
      <DollarSign className="h-4 w-4" />
      <span className="font-semibold">{formatAmount(report.amount_in_dispute)}</span>
    </div>
  </div>
);

const ComplaintsInfo: React.FC<{ report: IScamAlert }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Number of complaints</h3>
    <p className="text-gray-600">{formatComplaints(report.complaints_count)}</p>
  </div>
);

const ResponseInfo: React.FC<{ report: IScamAlert }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Business Response</h3>
    <p className="text-gray-600">{report.business_response ?? 'No response provided yet.'}</p>
  </div>
);

const DateInfo: React.FC<{ report: IScamAlert }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Date of Report</h3>
    <div className="flex items-center gap-2 text-gray-600">
      <Calendar className="h-4 w-4" />
      <span>{formatDate(report.reported_at)}</span>
    </div>
  </div>
);

const CardFooter: React.FC = () => (
  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2 text-gray-500">
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm">No comments yet</span>
      </div>
      <div className="text-sm text-gray-600">
        <span className="text-[#F5D238] hover:text-[#e6c531] font-semibold transition-colors duration-200 cursor-pointer">
          Log in
        </span>
        <span> to read and leave comments</span>
      </div>
    </div>
  </div>
);

export default ScamReportCard;