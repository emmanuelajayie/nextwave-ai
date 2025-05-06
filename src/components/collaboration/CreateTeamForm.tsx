
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ErrorLogger from "@/utils/errorLogger";

interface CreateTeamFormProps {
  onTeamCreated: () => void;
}

export const CreateTeamForm = ({ onTeamCreated }: CreateTeamFormProps) => {
  const [newTeamName, setNewTeamName] = useState("");
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get the current user ID when component mounts
    const getUserId = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else if (data?.user) {
        setUserId(data.user.id);
      }
    };

    getUserId();
  }, []);

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      setIsCreatingTeam(true);
      
      // Get the latest user data to ensure we have current auth
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        console.error("Authentication error:", error);
        toast.error("You must be logged in to create a team");
        return;
      }
      
      const currentUserId = data.user.id;
      console.log("Creating team with user ID:", currentUserId);

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
      const { data: teamData, error: createError } = await supabase
        .from("teams")
        .insert([{ 
          name: newTeamName.trim(),
          owner_id: currentUserId
        }])
        .select()
        .single();

      if (createError) {
        console.error("Error creating team:", createError);
        ErrorLogger.logError(new Error(createError.message), "Failed to create team");
        
        // Provide more specific error messages based on error codes
        if (createError.code === "23505") { // Unique constraint violation
          toast.error("A team with this name already exists");
        } else if (createError.code === "23502") { // Not null violation
          toast.error("Missing required fields");
        } else {
          toast.error(`Failed to create team: ${createError.message}`);
        }
        return;
      }

      // Also add the creator as a team member with 'admin' role
      if (teamData) {
        const { error: memberError } = await supabase
          .from("team_members")
          .insert([{
            team_id: teamData.id,
            user_id: currentUserId,
            role: 'admin'
          }]);

        if (memberError) {
          console.error("Error adding team member:", memberError);
          // Don't return here, we still created the team successfully
        }
      }

      toast.success("Team created successfully");
      setNewTeamName("");
      onTeamCreated();
    } catch (error: any) {
      console.error("Error creating team:", error);
      ErrorLogger.logError(error, "Failed to process team creation");
      toast.error("Failed to process team creation");
    } finally {
      setIsCreatingTeam(false);
    }
  };

  return (
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
  );
};
