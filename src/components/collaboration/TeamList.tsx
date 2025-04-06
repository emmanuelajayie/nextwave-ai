
import { Loader2 } from "lucide-react";
import { TeamItem } from "./TeamItem";

interface Team {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  owner_id?: string;
  memberCount?: number;
}

interface TeamListProps {
  teams: Team[];
  isLoading: boolean;
  onManageTeam: (id: string, name: string) => void;
}

export const TeamList = ({ teams, isLoading, onManageTeam }: TeamListProps) => {
  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">No teams yet. Create your first team above.</p>
    );
  }

  return (
    <div className="space-y-2">
      {teams.map((team) => (
        <TeamItem
          key={team.id}
          id={team.id}
          name={team.name}
          memberCount={team.memberCount || 0}
          onManage={onManageTeam}
        />
      ))}
    </div>
  );
};
