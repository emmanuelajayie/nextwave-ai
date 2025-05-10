
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { BackendService } from "@/lib/backend-service";

interface User {
  id: string;
  email: string;
  role: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  team_id: string;
}

export const UserPermissions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teams, setTeams] = useState<any[]>([]);

  // Fetch teams that the current user is a member of
  const fetchTeams = async () => {
    try {
      // Get the current user
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) return;

      // Get teams where the user is owner
      const { data: ownedTeams, error: ownedError } = await supabase
        .from("teams")
        .select("*")
        .eq("owner_id", sessionData.session.user.id);

      if (ownedError) throw ownedError;

      // Get teams where the user is an admin
      const { data: adminTeams, error: adminError } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", sessionData.session.user.id)
        .eq("role", "admin");

      if (adminError) throw adminError;

      // If user is admin of any teams, fetch those team details
      let adminTeamDetails: any[] = [];
      if (adminTeams && adminTeams.length > 0) {
        const adminTeamIds = adminTeams.map((t) => t.team_id);
        const { data: adminTeamData, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .in("id", adminTeamIds);

        if (teamError) throw teamError;
        adminTeamDetails = adminTeamData || [];
      }

      // Combine owned and admin teams, removing duplicates
      const allTeams = [...(ownedTeams || [])];
      adminTeamDetails.forEach(team => {
        if (!allTeams.find(t => t.id === team.id)) {
          allTeams.push(team);
        }
      });

      setTeams(allTeams);

      // Auto-select the first team if available
      if (allTeams.length > 0 && !selectedTeam) {
        setSelectedTeam(allTeams[0].id);
      }

    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams");
    }
  };

  // Fetch team members for the selected team
  const fetchTeamMembers = async () => {
    if (!selectedTeam) return;
    
    setIsLoading(true);
    try {
      // Fetch team members
      const { data: teamMembers, error: membersError } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", selectedTeam);

      if (membersError) throw membersError;

      // Fetch user emails for each team member
      const userDetails = await Promise.all(
        (teamMembers || []).map(async (member) => {
          try {
            // Call the get-user-email function to get user's email
            const userData = await BackendService.callFunction(
              "get-user-email",
              null,
              { 
                method: "GET",
                headers: { "X-Endpoint": `?user_id=${member.user_id}` }
              }
            );
            
            return {
              id: member.user_id,
              email: userData.email || "Unknown email",
              role: member.role,
            };
          } catch (err) {
            console.error(`Error fetching user ${member.user_id}:`, err);
            return {
              id: member.user_id,
              email: "Failed to load email",
              role: member.role,
            };
          }
        })
      );

      setUsers(userDetails);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers();
    }
  }, [selectedTeam]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!selectedTeam) return;
    
    try {
      // First check if the current user is allowed to change roles
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      // Check if this is the last admin (prevent removing last admin)
      if (newRole !== "admin") {
        const adminsCount = users.filter(u => u.role === "admin" && u.id !== userId).length;
        if (adminsCount === 0) {
          toast.error("Cannot change role - team must have at least one admin");
          return;
        }
      }

      // Update the role in the database
      const { error } = await supabase
        .from("team_members")
        .update({ role: newRole })
        .match({ team_id: selectedTeam, user_id: userId });

      if (error) {
        console.error("Error updating role:", error);
        toast.error("Failed to update role");
        return;
      }

      // Update the local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast.success(`Successfully updated role to ${newRole}`);
    } catch (error) {
      console.error("Error in role change:", error);
      toast.error("An error occurred while updating the role");
    }
  };

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    if (!selectedTeam) return;
    
    try {
      // Don't allow removing yourself
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return;
      }
      
      if (session.user.id === userId) {
        toast.error("You cannot remove yourself from the team");
        return;
      }

      // Check if this is the last admin
      const isAdmin = users.find(u => u.id === userId)?.role === "admin";
      if (isAdmin) {
        const adminsCount = users.filter(u => u.role === "admin").length;
        if (adminsCount <= 1) {
          toast.error("Cannot remove the last admin from the team");
          return;
        }
      }

      // Remove the user from the team
      const { error } = await supabase
        .from("team_members")
        .delete()
        .match({ team_id: selectedTeam, user_id: userId });

      if (error) {
        console.error("Error removing user:", error);
        toast.error("Failed to remove user from team");
        return;
      }

      // Update the local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success(`Successfully removed ${userEmail} from the team`);
    } catch (error) {
      console.error("Error in user removal:", error);
      toast.error("An error occurred while removing the user");
    }
  };

  if (teams.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">User Permissions</h2>
        <p className="text-center text-muted-foreground py-4">
          You need to create or join a team before you can manage user permissions.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">User Permissions</h2>
      
      {/* Team selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Team
        </label>
        <Select
          value={selectedTeam || undefined}
          onValueChange={(value) => setSelectedTeam(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : users.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveUser(user.id, user.email)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          No users found in this team.
        </p>
      )}
    </Card>
  );
};
