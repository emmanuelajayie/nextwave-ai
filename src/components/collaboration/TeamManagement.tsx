
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ErrorLogger from "@/utils/errorLogger";
import { CreateTeamForm } from "./CreateTeamForm";
import { TeamList } from "./TeamList";

// Define TypeScript interfaces for our data
interface Team {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  owner_id?: string;
  memberCount?: number;
}

export const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set up authentication listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        const newAuthState = !!currentSession;
        setIsAuthenticated(newAuthState);
        
        if (newAuthState && !isAuthenticated) {
          // Only fetch teams when auth state changes from false to true
          console.log("Auth state changed to logged in, fetching teams");
          fetchTeams();
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getUser();
      const hasSession = !!data.user;
      setIsAuthenticated(hasSession);
      
      if (hasSession) {
        console.log("User is authenticated, fetching teams");
        fetchTeams();
      } else {
        console.log("User not authenticated");
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const fetchTeams = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching teams");

      // First, fetch teams data
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*");
      
      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        ErrorLogger.logError(new Error(teamsError.message), "Unable to load teams data");
        toast.error("Failed to load teams");
        setIsLoading(false);
        return;
      }

      if (!teamsData || teamsData.length === 0) {
        console.log("No teams found");
        setTeams([]);
        setIsLoading(false);
        return;
      }
      
      console.log(`Found ${teamsData.length} teams`);
      
      // Get team member counts in a separate query
      const teamIds = teamsData.map(team => team.id);
      
      try {
        // Use a simpler query for member counts
        const { data: teamMembers, error: membersError } = await supabase
          .from("team_members")
          .select("team_id");
          
        if (membersError) {
          console.error("Error fetching team members:", membersError);
          // Just continue with the teams data we have
          setTeams(teamsData);
          return;
        }
        
        // Count members per team
        const countMap: Record<string, number> = {};
        teamMembers?.forEach(member => {
          const teamId = member.team_id;
          countMap[teamId] = (countMap[teamId] || 0) + 1;
        });
        
        // Add the counts to the teams data
        const teamsWithCounts: Team[] = teamsData.map(team => ({
          ...team,
          memberCount: countMap[team.id] || 0
        }));
        
        setTeams(teamsWithCounts);
      } catch (countError) {
        console.error("Error processing team member counts:", countError);
        // Just use the teams data without counts
        setTeams(teamsData);
      }
      
    } catch (error: any) {
      console.error("Error in team fetching process:", error);
      ErrorLogger.logError(error, "Failed to load teams data");
      toast.error("Failed to load teams data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageTeam = (teamId: string, teamName: string) => {
    // For now just show a toast, this will be implemented in the future
    toast.info(`Managing team: ${teamName}`);
    console.log("Opening management for team:", teamId);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Team Management</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage your teams
          </p>
        </div>
        <Users className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {isAuthenticated ? (
          <>
            <CreateTeamForm onTeamCreated={fetchTeams} />
            <TeamList 
              teams={teams}
              isLoading={isLoading}
              onManageTeam={handleManageTeam}
            />
          </>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            You must be logged in to manage teams
          </p>
        )}
      </div>
    </Card>
  );
};
