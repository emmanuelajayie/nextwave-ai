
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import ErrorLogger from "@/utils/errorLogger";

export const TeamManagement = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      // Fetch teams without joining to team_members to avoid recursion
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*");
      
      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        ErrorLogger.logError(new Error(teamsError.message), "Unable to load teams data");
        toast.error("Failed to load teams");
        return;
      }
      
      // Set teams data
      setTeams(teamsData || []);
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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("You must be logged in to create a team");
        return;
      }

      const { data, error } = await supabase
        .from("teams")
        .insert([{ 
          name: newTeamName,
          owner_id: userData.user.id  // Use owner_id instead of created_by
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating team:", error);
        ErrorLogger.logError(new Error(error.message), "Failed to create team");
        toast.error("Failed to create team");
        return;
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
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
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
                  <Button variant="outline" size="sm">
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
