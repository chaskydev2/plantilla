import React, { useState } from 'react';
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

import ShareToast from '@/components/ShareToast';
import { scamReports } from '@/data/scamReportsData';
import ScamReportCard from '@/components/ScamReportCard';
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

interface ScamReportsListProps {
  scamReports: ScamReport[];
  setShowToast: (show: boolean) => void;
}

const ScamAlerts: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <ShareToast showToast={showToast} setShowToast={setShowToast} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb />
        
        <ScamReportsList scamReports={scamReports} setShowToast={setShowToast} />
        
        <LoadMoreButton />
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

const LoadMoreButton: React.FC = () => (
  <div className="text-center mt-12">
    <button className="bg-[#1A1B16] hover:bg-[#2A2B26] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300">
      Load More Alerts
    </button>
  </div>
);

export default ScamAlerts;