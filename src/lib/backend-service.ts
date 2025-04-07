
import { supabase } from './supabase';
import { toast } from 'sonner';

/**
 * Backend service utility for interacting with Supabase functions
 */
export class BackendService {
  /**
   * Call a Supabase Edge Function
   * 
   * @param functionName - Name of the edge function to call
   * @param payload - Optional payload to send with the request
   * @param options - Additional request options
   * @returns Response data from the function
   */
  static async callFunction<T = any>(
    functionName: string, 
    payload?: any, 
    options: { method?: string; headers?: Record<string, string> } = {}
  ): Promise<T> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        method: options.method || (payload ? 'POST' : 'GET'),
        headers: options.headers || {},
        body: payload,
      });

      if (error) {
        console.error(`Error calling ${functionName}:`, error);
        toast.error(`Error: ${error.message || 'Failed to call service'}`);
        throw error;
      }

      return data as T;
    } catch (err) {
      console.error(`Exception calling ${functionName}:`, err);
      toast.error(`Service error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }

  /**
   * Log system events
   * 
   * @param action - The action being logged
   * @param status - Status of the action ('info', 'success', 'warning', 'error')
   * @param description - Optional description
   * @param metadata - Optional metadata object
   */
  static async log(
    action: string,
    status: 'info' | 'success' | 'warning' | 'error' = 'info',
    description?: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await this.callFunction('system-logger', {
        action,
        status,
        description,
        metadata: {
          ...metadata,
          client_timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      });
    } catch (err) {
      // Silently fail on logging errors to prevent cascading issues
      console.warn('Failed to log event:', err);
    }
  }

  /**
   * Get backend system status
   */
  static async getSystemStatus(): Promise<{
    status: string;
    services: Record<string, string>;
    timestamp: string;
    version: string;
  }> {
    return this.callFunction('api-management', null, {
      method: 'GET',
      headers: { 'X-Endpoint': 'status' }
    });
  }

  /**
   * Manage user profiles
   */
  static async getUserProfile(userId?: string): Promise<any> {
    const endpoint = userId ? `users?id=${userId}` : 'users';
    return this.callFunction('api-management', null, {
      method: 'GET',
      headers: { 'X-Endpoint': endpoint }
    });
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, profileData: any): Promise<any> {
    return this.callFunction('api-management', profileData, {
      method: 'PUT',
      headers: { 'X-Endpoint': `users?id=${userId}` }
    });
  }

  /**
   * Manage workflows
   */
  static async getWorkflows(): Promise<any[]> {
    return this.callFunction('api-management', null, {
      method: 'GET',
      headers: { 'X-Endpoint': 'workflows' }
    });
  }

  static async getWorkflow(id: string): Promise<any> {
    return this.callFunction('api-management', null, {
      method: 'GET',
      headers: { 'X-Endpoint': `workflows?id=${id}` }
    });
  }

  static async createWorkflow(workflowData: any): Promise<any> {
    return this.callFunction('api-management', workflowData, {
      method: 'POST',
      headers: { 'X-Endpoint': 'workflows' }
    });
  }

  static async updateWorkflow(id: string, workflowData: any): Promise<any> {
    return this.callFunction('api-management', workflowData, {
      method: 'PUT',
      headers: { 'X-Endpoint': `workflows?id=${id}` }
    });
  }

  static async deleteWorkflow(id: string): Promise<void> {
    await this.callFunction('api-management', null, {
      method: 'DELETE',
      headers: { 'X-Endpoint': `workflows?id=${id}` }
    });
  }

  /**
   * Process scheduled tasks
   */
  static async triggerScheduledTasks(): Promise<any> {
    return this.callFunction('process-scheduled-tasks');
  }

  /**
   * Health check endpoint
   */
  static async healthCheck(): Promise<{ status: string }> {
    try {
      const status = await this.getSystemStatus();
      return { status: status.status };
    } catch (error) {
      return { status: 'unhealthy' };
    }
  }
}

// Export a singleton instance
export default BackendService;
