import React from 'react';
import { MapPin, Calendar, DollarSign, MessageSquare } from "lucide-react";
import ShareButton from './ShareButton';

// Tipos
interface ScamReport {
  id: number;
  companyName: string;
  locations: string[];
  complaintLocation: string;
  businessOwner: string;
  reason: string;
  additionalInfo: string;
  amountInDispute: string;
  numberOfComplaints: string;
  businessResponse: string;
  dateOfReport: string;
}

interface ScamReportCardProps {
  report: ScamReport;
  setShowToast: (show: boolean) => void;
}

const ScamReportCard: React.FC<ScamReportCardProps> = ({ report, setShowToast }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#F5D238] mb-2">
              {report.companyName}
            </h2>
          </div>
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
const LeftColumn: React.FC<{ report: ScamReport }> = ({ report }) => (
  <div className="space-y-4">
    <LocationInfo report={report} />
    <BusinessOwnerInfo report={report} />
    <ReasonInfo report={report} />
  </div>
);

const RightColumn: React.FC<{ report: ScamReport }> = ({ report }) => (
  <div className="space-y-4">
    <AmountInfo report={report} />
    <ComplaintsInfo report={report} />
    <ResponseInfo report={report} />
    <DateInfo report={report} />
  </div>
);

// Componentes de información específica
const LocationInfo: React.FC<{ report: ScamReport }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
    <div className="flex items-center gap-1 text-gray-600">
      <MapPin className="h-4 w-4" />
      <span>
        {report.locations.join(", ")} 
        <span className="text-gray-400 ml-1">
          (complaint location: {report.complaintLocation})
        </span>
      </span>
    </div>
  </div>
);

const BusinessOwnerInfo: React.FC<{ report: ScamReport }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Business Owner</h3>
    <p className="text-gray-600">{report.businessOwner}</p>
  </div>
);

const ReasonInfo: React.FC<{ report: ScamReport }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Reason for Listing</h3>
    <ul className="text-gray-600 list-disc list-inside space-y-1">
      <li>{report.reason}</li>
      <li>{report.additionalInfo}</li>
    </ul>
  </div>
);

const AmountInfo: React.FC<{ report: ScamReport }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Amount in Dispute</h3>
    <div className="flex items-center gap-2 text-gray-600">
      <DollarSign className="h-4 w-4" />
      <span className="font-semibold">{report.amountInDispute}</span>
    </div>
  </div>
);

const ComplaintsInfo: React.FC<{ report: ScamReport }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Number of complaints</h3>
    <p className="text-gray-600">{report.numberOfComplaints}</p>
  </div>
);

const ResponseInfo: React.FC<{ report: ScamReport }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Business Response</h3>
    <p className="text-gray-600">{report.businessResponse}</p>
  </div>
);

const DateInfo: React.FC<{ report: ScamReport }> = ({ report }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-2">Date of Report</h3>
    <div className="flex items-center gap-2 text-gray-600">
      <Calendar className="h-4 w-4" />
      <span>{report.dateOfReport}</span>
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