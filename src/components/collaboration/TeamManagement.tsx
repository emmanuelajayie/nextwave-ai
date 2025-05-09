
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ErrorLogger from "@/utils/errorLogger";
import { CreateTeamForm } from "./CreateTeamForm";
import { TeamList } from "./TeamList";
import { TeamMembersList } from "./TeamMembersList";

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
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

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
      const { data: { session } } = await supabase.auth.getSession();
      const hasSession = !!session;
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
      
      // Get the current user for logging purposes
      const { data: userData } = await supabase.auth.getUser();
      console.log("Current user ID:", userData?.user?.id);
      
      // First, get teams where the user is the owner
      const { data: ownedTeams, error: ownedTeamsError } = await supabase
        .from("teams")
        .select("*")
        .eq("owner_id", userData?.user?.id);
      
      if (ownedTeamsError) {
        console.error("Error fetching owned teams:", ownedTeamsError);
        throw new Error(ownedTeamsError.message);
      }
      
      console.log(`Found ${ownedTeams?.length || 0} owned teams`);
      
      // Then get teams where the user is a member (direct query to avoid recursion)
      const { data: teamMembers, error: teamMembersError } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", userData?.user?.id);
        
      if (teamMembersError) {
        console.error("Error fetching team memberships:", teamMembersError);
        throw new Error(teamMembersError.message);
      }
      
      // Get the details of teams the user is a member of
      let memberTeams: any[] = [];
      if (teamMembers && teamMembers.length > 0) {
        const teamIds = teamMembers.map(tm => tm.team_id);
        const { data: memberTeamsData, error: memberTeamsError } = await supabase
          .from("teams")
          .select("*")
          .in("id", teamIds);
          
        if (memberTeamsError) {
          console.error("Error fetching member teams:", memberTeamsError);
        } else {
          memberTeams = memberTeamsData || [];
        }
      }
      
      // Combine both sets of teams
      let allTeams = [...(ownedTeams || [])];
      
      // Add member teams that aren't already in the list (avoiding duplicates)
      memberTeams.forEach(team => {
        if (!allTeams.some(t => t.id === team.id)) {
          allTeams.push(team);
        }
      });
      
      if (allTeams.length === 0) {
        console.log("No teams found");
        setTeams([]);
        setIsLoading(false);
        return;
      }
      
      // Get team member counts for all teams
      try {
        const { data: allTeamMembers, error: allMembersError } = await supabase
          .from("team_members")
          .select("team_id");
          
        if (allMembersError) {
          console.error("Error fetching all team members:", allMembersError);
        } else {
          // Count members per team
          const countMap: Record<string, number> = {};
          allTeamMembers?.forEach(member => {
            const teamId = member.team_id;
            countMap[teamId] = (countMap[teamId] || 0) + 1;
          });
          
          // Add the counts to the teams data
          allTeams = allTeams.map(team => ({
            ...team,
            memberCount: countMap[team.id] || 0
          }));
        }
      } catch (countError) {
        console.error("Error processing team member counts:", countError);
      }
      
      setTeams(allTeams);
    } catch (error: any) {
      console.error("Error in team fetching process:", error);
      ErrorLogger.logError(error, "Failed to load teams data");
      toast.error("Failed to load teams data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageTeam = (teamId: string, teamName: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setSelectedTeam(team);
    }
  };

  const handleBackToTeams = () => {
    setSelectedTeam(null);
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
          selectedTeam ? (
            <TeamMembersList 
              team={selectedTeam} 
              onBack={handleBackToTeams}
              onTeamUpdated={fetchTeams}
            />
          ) : (
            <>
              <CreateTeamForm onTeamCreated={fetchTeams} />
              <TeamList 
                teams={teams}
                isLoading={isLoading}
                onManageTeam={handleManageTeam}
              />
            </>
          )
        ) : (
          <p className="text-center text-muted-foreground py-4">
            You must be logged in to manage teams
          </p>
        )}
      </div>
    </Card>
  );
};
