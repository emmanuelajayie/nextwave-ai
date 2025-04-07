import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface SystemLog {
  id: string;
  action: string;
  status: string;
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

interface UseSystemLogsOptions {
  limit?: number;
  filter?: {
    action?: string;
    status?: string;
  };
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useSystemLogs(options: UseSystemLogsOptions = {}) {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const { limit = 20, filter = {}, autoRefresh = true, refreshInterval = 60000 } = options;

  // Function to fetch logs
  const fetchLogs = async (): Promise<SystemLog[]> => {
    let query = supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // Apply filters if provided
    if (filter.action) {
      query = query.eq('action', filter.action);
    }
    
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
    
    return data as SystemLog[];
  };

  // Use React Query for data fetching with auto-refresh
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['systemLogs', limit, filter.action, filter.status],
    queryFn: fetchLogs,
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  useEffect(() => {
    if (data) {
      setLogs(data);
    }
  }, [data]);

  // Set up realtime subscription
  useEffect(() => {
    // Skip if not auto-refreshing
    if (!autoRefresh) return;

    const channel = supabase
      .channel('system_logs_changes')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_logs',
        }, 
        (payload) => {
          // Add new log to the top of the list
          setLogs(prevLogs => {
            const newLog = payload.new as SystemLog;
            // Prevent duplicates
            if (prevLogs.some(log => log.id === newLog.id)) {
              return prevLogs;
            }
            // Add to top and keep within limit
            return [newLog, ...prevLogs].slice(0, limit);
          });
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [autoRefresh, limit]);

  // Create a log entry
  const createLog = async (action: string, status: string = 'info', description?: string, metadata?: Record<string, any>) => {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .insert({
          action,
          status,
          description,
          metadata: metadata || {}
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating log:', error);
      throw error;
    }
  };

  return {
    logs,
    isLoading,
    error,
    refetch,
    createLog
  };
}
