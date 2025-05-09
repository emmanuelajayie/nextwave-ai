
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    );
    
    // Verify the calling user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const { teamId, email, role } = await req.json();
    
    if (!teamId || !email) {
      return new Response(
        JSON.stringify({ error: 'Team ID and email are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Check if the user has permission to invite to this team
    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Check team membership or ownership for the current user
    const { data: team, error: teamError } = await supabaseClient
      .from('teams')
      .select('owner_id')
      .eq('id', teamId)
      .single();
      
    if (teamError) {
      return new Response(
        JSON.stringify({ error: 'Team not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    const isOwner = team.owner_id === user.id;
    
    if (!isOwner) {
      // Check if user is an admin
      const { data: membership, error: membershipError } = await supabaseClient
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();
        
      if (membershipError || membership.role !== 'admin') {
        return new Response(
          JSON.stringify({ error: 'You do not have permission to invite members to this team' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        );
      }
    }
    
    // Find the user by email in the auth system
    const { data: foundUsers, error: userError } = await supabaseClient.auth.admin.listUsers();
    
    if (userError) {
      return new Response(
        JSON.stringify({ error: 'Error searching for user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const invitedUser = foundUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!invitedUser) {
      return new Response(
        JSON.stringify({ error: 'User not found. They must sign up first.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Check if the user is already a member of the team
    const { data: existingMember, error: existingError } = await supabaseClient
      .from('team_members')
      .select()
      .eq('team_id', teamId)
      .eq('user_id', invitedUser.id)
      .maybeSingle();
      
    if (existingMember) {
      return new Response(
        JSON.stringify({ error: 'User is already a member of this team' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Add the user to the team
    const { data: newMember, error: addError } = await supabaseClient
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: invitedUser.id,
        role: role || 'viewer'
      })
      .select()
      .single();
      
    if (addError) {
      return new Response(
        JSON.stringify({ error: 'Failed to add user to team' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Log the successful action
    await supabaseClient
      .from('system_logs')
      .insert({
        action: 'team_member_added',
        status: 'success',
        description: `${invitedUser.email} added to team`,
        metadata: {
          team_id: teamId,
          added_by: user.id
        }
      });
      
    return new Response(
      JSON.stringify({ success: true, data: { ...newMember, user_email: invitedUser.email } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("Error in invite-team-member:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
