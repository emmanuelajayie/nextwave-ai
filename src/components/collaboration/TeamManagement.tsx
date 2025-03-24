
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import ErrorLogger from "@/utils/errorLogger";

export const TeamManagement = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      // Fixed query to avoid recursion - fetch teams first
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*");
      
      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        ErrorLogger.logError(new Error(teamsError.message), "Unable to load teams data");
        toast.error("Failed to load teams");
        return;
      }
      
      // If we have teams, get the member counts separately
      if (teamsData && teamsData.length > 0) {
        const teamsWithMemberCounts = await Promise.all(
          teamsData.map(async (team) => {
            const { count, error: countError } = await supabase
              .from("team_members")
              .select("*", { count: 'exact', head: true })
              .eq("team_id", team.id);
            
            if (countError) {
              console.error("Error fetching team member count:", countError);
              return { ...team, memberCount: 0 };
            }
            
            return { ...team, memberCount: count || 0 };
          })
        );
        
        setTeams(teamsWithMemberCounts);
      } else {
        setTeams([]);
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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("You must be logged in to create a team");
        return;
      }

      const { data, error } = await supabase
        .from("teams")
        .insert([{ 
          name: newTeamName,
          created_by: userData.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating team:", error);
        toast.error("Failed to create team");
        return;
      }

      toast.success("Team created successfully");
      setNewTeamName("");
      fetchTeams();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to process team creation");
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
          <Button onClick={createTeam}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Team
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
