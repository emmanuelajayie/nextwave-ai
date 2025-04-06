
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import ErrorLogger from "@/utils/errorLogger";

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
  const [newTeamName, setNewTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
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

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      setIsCreatingTeam(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error("Auth error:", userError);
        toast.error("You must be logged in to create a team");
        return;
      }

      // Check for duplicate team name
      const { data: existingTeam, error: checkError } = await supabase
        .from("teams")
        .select("id")
        .eq("name", newTeamName.trim())
        .maybeSingle();

      if (checkError) {
        console.error("Error checking team name:", checkError);
      }

      if (existingTeam) {
        toast.error("A team with this name already exists");
        return;
      }

      // Create the team with owner_id
      const { data, error } = await supabase
        .from("teams")
        .insert([{ 
          name: newTeamName.trim(),
          owner_id: userData.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating team:", error);
        ErrorLogger.logError(new Error(error.message), "Failed to create team");
        
        // Provide more specific error messages based on error codes
        if (error.code === "23505") { // Unique constraint violation
          toast.error("A team with this name already exists");
        } else if (error.code === "23502") { // Not null violation
          toast.error("Missing required fields");
        } else {
          toast.error(`Failed to create team: ${error.message}`);
        }
        return;
      }

      // Also add the creator as a team member with 'admin' role
      if (data) {
        const { error: memberError } = await supabase
          .from("team_members")
          .insert([{
            team_id: data.id,
            user_id: userData.user.id,
            role: 'admin'
          }]);

        if (memberError) {
          console.error("Error adding team member:", memberError);
          // Don't return here, we still created the team successfully
        }
      }

      toast.success("Team created successfully");
      setNewTeamName("");
      fetchTeams();
    } catch (error: any) {
      console.error("Error creating team:", error);
      ErrorLogger.logError(error, "Failed to process team creation");
      toast.error("Failed to process team creation");
    } finally {
      setIsCreatingTeam(false);
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
        <div className="flex gap-2">
          <Input
            placeholder="Enter team name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={createTeam}
            disabled={isCreatingTeam || !newTeamName.trim()}
          >
            {isCreatingTeam ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Team
              </>
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="py-4 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {teams.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No teams yet. Create your first team above.</p>
            ) : (
              teams.map((team) => (
                <div
                  key={team.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{team.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {team.memberCount || 0} members
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleManageTeam(team.id, team.name)}
                  >
                    Manage
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
