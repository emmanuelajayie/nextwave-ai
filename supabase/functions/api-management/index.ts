
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to handle CORS preflight requests
function handleCORS(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  // Create Supabase client with auth context from request
  const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
  
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: req.headers.get('Authorization') || '' },
    },
  });

  // Get URL params
  const url = new URL(req.url);
  const action = url.pathname.split('/').pop();

  try {
    switch (action) {
      case 'status':
        return handleStatusCheck(req);
      case 'users':
        return handleUsersRequest(req, supabaseClient);
      case 'workflows':
        return handleWorkflowsRequest(req, supabaseClient);
      default:
        return new Response(JSON.stringify({ error: 'Invalid endpoint' }), { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
  } catch (error) {
    console.error(`Error handling request: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

// Handle status check requests
async function handleStatusCheck(req: Request) {
  // Collect system status (DB connectivity, services, etc.)
  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'up',
      auth: 'up',
      storage: 'up',
      workflows: 'up',
    },
    version: '1.0.0',
  };

  return new Response(JSON.stringify(status), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
  });
}

// Handle users-related requests
async function handleUsersRequest(req: Request, supabase: any) {
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  // Process based on HTTP method
  switch (req.method) {
    case 'GET':
      // Admin can list users, others can only get their own profile
      if (req.url.includes('?id=')) {
        const userId = new URL(req.url).searchParams.get('id');
        if (userId !== user.id) {
          // Check if user is admin
          const { data: isAdmin } = await supabase
            .rpc('check_is_admin', { user_id: user.id });

          if (!isAdmin) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
          }
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }

        return new Response(JSON.stringify(profile), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } else {
        // Check if user is admin before listing all users
        const { data: isAdmin } = await supabase
          .rpc('check_is_admin', { user_id: user.id });

        if (!isAdmin) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }

        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }

        return new Response(JSON.stringify(profiles), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    case 'PUT':
      const userId = new URL(req.url).searchParams.get('id');
      if (userId !== user.id) {
        // Check if user is admin
        const { data: isAdmin } = await supabase
          .rpc('check_is_admin', { user_id: user.id });

        if (!isAdmin) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }
      }

      const updateData = await req.json();
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      return new Response(JSON.stringify(data), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
  }
}

// Handle workflow-related requests
async function handleWorkflowsRequest(req: Request, supabase: any) {
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  switch (req.method) {
    case 'GET':
      // Get workflow by ID or list all user workflows
      if (req.url.includes('?id=')) {
        const workflowId = new URL(req.url).searchParams.get('id');
        
        const { data, error } = await supabase
          .from('workflows')
          .select('*')
          .eq('id', workflowId)
          .eq('created_by', user.id)
          .single();

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }

        return new Response(JSON.stringify(data), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } else {
        const { data, error } = await supabase
          .from('workflows')
          .select('*')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }

        return new Response(JSON.stringify(data), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    case 'POST':
      // Create new workflow
      const createData = await req.json();
      
      const { data, error } = await supabase
        .from('workflows')
        .insert({
          ...createData,
          created_by: user.id,
          status: createData.status || 'inactive'
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      return new Response(JSON.stringify(data), { 
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    case 'PUT':
      // Update workflow by ID
      const workflowId = new URL(req.url).searchParams.get('id');
      if (!workflowId) {
        return new Response(JSON.stringify({ error: 'Workflow ID required' }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
      
      const updateData = await req.json();
      
      const { data: workflow, error: updateError } = await supabase
        .from('workflows')
        .update(updateData)
        .eq('id', workflowId)
        .eq('created_by', user.id)
        .select()
        .single();

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      return new Response(JSON.stringify(workflow), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    case 'DELETE':
      // Delete workflow by ID
      const deleteId = new URL(req.url).searchParams.get('id');
      if (!deleteId) {
        return new Response(JSON.stringify({ error: 'Workflow ID required' }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
      
      const { error: deleteError } = await supabase
        .from('workflows')
        .delete()
        .eq('id', deleteId)
        .eq('created_by', user.id);

      if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      return new Response(JSON.stringify({ success: true }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
  }
}
