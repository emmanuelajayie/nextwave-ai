
// This file extends the generated Supabase types with additional types used in the application
// Note: Do not modify the generated types.ts file directly

import { Database } from './types';

// Extend the base types with additional types or interfaces
export interface SyncLog {
  id: string;
  crm_integration_id: string;
  status: 'in_progress' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  records_processed?: number;
  error_message?: string;
}

// Add strongly typed selects for common queries
export type CRMIntegrationWithSyncLogs = 
  Database['public']['Tables']['crm_integrations']['Row'] & {
    sync_logs: SyncLog[];
  };

// Add validation types
export interface CRMContactRecord {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  created?: string;
  source: string;
}
