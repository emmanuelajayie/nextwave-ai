
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
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
  const [session, setSession] = useState<any>(null);

  // Set up authentication listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        setSession(data.session);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  // Fetch teams when session changes or when teams need to be refreshed
  useEffect(() => {
    if (session?.user) {
      fetchTeams();
    } else {
      setTeams([]);
      setIsLoading(false);
    }
  }, [session]);

  const fetchTeams = async () => {
    if (!session?.user) {
      console.log("No authenticated user found, skipping team fetch");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching teams for user:", session.user.id);

      // First, fetch teams data
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*");
      
      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        ErrorLogger.logError(new Error(teamsError.message), "Unable to load teams data");
        toast.error("Failed to load teams");
        return;
      }

      if (!teamsData) {
        setTeams([]);
        return;
      }
      
      // Get team member counts in a separate query
      const teamIds = teamsData.map(team => team.id);
      if (teamIds.length > 0) {
        // Use proper SQL aggregation instead of .group() method
        const { data: memberCounts, error: membersError } = await supabase
          .from("team_members")
          .select("team_id, count(*)");
          
        if (!membersError && memberCounts) {
          // Create a map of team_id -> member count
          const countMap: Record<string, number> = {};
          
          memberCounts.forEach((item: any) => {
            const count = item.count !== null ? parseInt(String(item.count)) : 0;
            countMap[item.team_id] = count;
          });
          
          // Add the counts to the teams data
          const teamsWithCounts: Team[] = teamsData.map(team => ({
            ...team,
            memberCount: countMap[team.id] || 0
          }));
          
          setTeams(teamsWithCounts);
        } else {
          // If there was an error getting counts, just use the teams data without counts
          setTeams(teamsData);
        }
      } else {
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
        <CreateTeamForm onTeamCreated={fetchTeams} />
        <TeamList 
          teams={teams}
          isLoading={isLoading}
          onManageTeam={handleManageTeam}
        />
      </div>
    </Card>
  );
};
