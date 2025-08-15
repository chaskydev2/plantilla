export interface IPaymentCreateRequest {
  payment_type: string;
  amount: number;
  date?: string; 
  observation?: string;
  payment_method: string;
  user_ids: string[];
}

export interface IPaymentUpdateRequest {
  id: string;
  payment_type: string;
  amount: number;
  date?: string;
  observation?: string;
  payment_method: string;
  user_id: string;
}

export interface IPaymentResponse {
  id: string;
  payment_type: string;
  amount: number;
  payment_month: string | "";
  payment_year: string | "";
  observation: string | "";
  payment_method: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface IUserForPayment {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  name: string;
}