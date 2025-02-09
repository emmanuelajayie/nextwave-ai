
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'cancelled';
export type PaymentType = 'one_time' | 'subscription';
export type BusinessType = 'small' | 'medium' | 'enterprise';
export type SubscriptionStatus = 'inactive' | 'trial' | 'active' | 'expired';

export interface SetupFee {
  business_type: BusinessType;
  amount: number;
  payment_link: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: PricingFeature[];
}

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  payment_type: PaymentType;
  customer: {
    email: string;
    name?: string;
  };
  metadata?: Record<string, any>;
  business_type?: BusinessType;
  plan_id?: string;
}

export interface Payment {
  id: string;
  transaction_ref: string;
  amount: number;
  currency: string;
  payment_type: PaymentType;
  status: PaymentStatus;
  metadata: Record<string, any>;
  business_type?: string;
  plan_id?: string;
  trial_end_date?: string;
  subscription_status?: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}
