
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, UserPlus, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Team {
  id: string;
  name: string;
  owner_id?: string;
  memberCount?: number;
}

interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  role: string;
  user_email?: string;
}

interface TeamMembersListProps {
  team: Team;
  onBack: () => void;
  onTeamUpdated: () => void;
}

export const TeamMembersList = ({ team, onBack, onTeamUpdated }: TeamMembersListProps) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user.id);
        setIsOwner(session.user.id === team.owner_id);
      }
    };
    
    getUser();
    fetchMembers();
  }, [team.id]);
  
  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch team members
      const { data: teamMembers, error: membersError } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", team.id);
        
      if (membersError) {
        throw new Error(membersError.message);
      }
      
      // We need to get the user emails for each member
      const enrichedMembers = await Promise.all(teamMembers.map(async (member) => {
        try {
          // Get user details from auth schema (we can't query directly, so we use our own function)
          const { data: userData, error: userError } = await supabase
            .functions.invoke('get-user-email', {
              body: { userId: member.user_id }
            });
            
          if (userError) {
            console.error("Error fetching user email:", userError);
            return { ...member, user_email: "Unknown User" };
          }
          
          return { ...member, user_email: userData?.email || "Unknown User" };
        } catch (error) {
          console.error("Error enriching member data:", error);
          return { ...member, user_email: "Unknown User" };
        }
      }));
      
      setMembers(enrichedMembers);
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      setError(error.message);
      toast.error("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRoleChange = async (memberId: string, userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .update({ role: newRole })
        .eq("id", memberId);
        
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Role updated successfully");
      fetchMembers();
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };
  
  const handleRemoveMember = async (memberId: string, userId: string) => {
    // Don't allow removing yourself if you're the owner
    if (userId === currentUser && isOwner) {
      toast.error("You cannot remove yourself as the team owner");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);
        
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Team member removed");
      fetchMembers();
      onTeamUpdated(); // Update the parent counts
    } catch (error: any) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    }
  };
  
  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsAddingMember(true);
    try {
      // Call our edge function to handle user lookup and team invitation
      const { data, error } = await supabase.functions.invoke('invite-team-member', {
        body: {
          teamId: team.id,
          email: newMemberEmail.trim(),
          role: 'viewer' // Default role
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success(`Invitation sent to ${newMemberEmail}`);
      setNewMemberEmail("");
      fetchMembers();
      onTeamUpdated(); // Update the parent counts
    } catch (error: any) {
      console.error("Error inviting team member:", error);
      toast.error(error.message || "Failed to invite team member");
    } finally {
      setIsAddingMember(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Teams
      </Button>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{team.name} - Team Members</h3>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add member by email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleAddMember}
          disabled={isAddingMember || !newMemberEmail.trim()}
        >
          {isAddingMember ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </>
          )}
        </Button>
      </div>
      
      {members.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No team members yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.user_email}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={member.role}
                    onValueChange={(value) => handleRoleChange(member.id, member.user_id, value)}
                    disabled={!isOwner && member.user_id !== currentUser}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveMember(member.id, member.user_id)}
                    disabled={(!isOwner && member.user_id !== currentUser) || (isOwner && member.user_id === currentUser)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
