
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

// User setup progress type
export interface UserSetupProgress {
  id: string;
  user_id: string;
  completed_steps: string[];
  updated_at: string;
}
