import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const TeamManagement = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*, team_members(*)");
    
    if (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams");
      return;
    }
    
    setTeams(data || []);
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    const { data, error } = await supabase
      .from("teams")
      .insert([{ name: newTeamName }])
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

        <div className="space-y-2">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{team.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {team.team_members?.length || 0} members
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};