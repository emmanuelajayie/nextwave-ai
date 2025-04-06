
import { Button } from "@/components/ui/button";

interface TeamItemProps {
  id: string;
  name: string;
  memberCount: number;
  onManage: (id: string, name: string) => void;
}

export const TeamItem = ({ id, name, memberCount, onManage }: TeamItemProps) => {
  return (
    <div className="flex justify-between items-center p-3 border rounded-lg">
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {memberCount || 0} members
        </p>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onManage(id, name)}
      >
        Manage
      </Button>
    </div>
  );
};
