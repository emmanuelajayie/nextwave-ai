
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'cancelled';
export type PaymentType = 'one_time' | 'subscription';

export interface PaymentDetails {
  amount: number;
  currency: string;
  payment_type: PaymentType;
  customer: {
    email: string;
    name?: string;
  };
  metadata?: Record<string, any>;
}

export interface Payment {
  id: string;
  transaction_ref: string;
  amount: number;
  currency: string;
  payment_type: PaymentType;
  status: PaymentStatus;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}
