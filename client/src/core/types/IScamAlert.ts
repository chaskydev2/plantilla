export type ScamAlertStatus = 'active' | 'resolved' | 'closed';

export interface IScamAlert {
  id: number;
  contractor_id?: number | null;
  homeowner_profile_id?: number | null;
  business_name: string;
  legal_name?: string | null;
  business_owner?: string | null;
  operating_states?: string[] | string | null;
  complaint_location?: string | null;
  amount_in_dispute?: number | null;
  complaints_count?: number | null;
  reason_for_listing: string;
  business_response?: string | null;
  reported_at?: string | null;
  status: ScamAlertStatus;
  created_at?: string | null;
  updated_at?: string | null;
}
