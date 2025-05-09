
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
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface User {
  name: string;
  email: string;
  role: string;
}

export const UserPermissions = () => {
  const [users, setUsers] = useState<User[]>([
    { name: "John Doe", email: "john@example.com", role: "admin" },
    { name: "Jane Smith", email: "jane@example.com", role: "analyst" },
    { name: "Mike Johnson", email: "mike@example.com", role: "viewer" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // This is a mock function since we can't easily integrate with the teams database in a settings component
  const fetchTeamMembers = async () => {
    // In a real implementation, this would fetch from the team_members table
    // But for now we'll use mock data
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleRoleChange = (email: string, newRole: string) => {
    console.log("Changing role for", email, "to", newRole);
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.email === email ? { ...user, role: newRole } : user
      )
    );
    toast({
      title: "Role updated",
      description: `Successfully updated role for ${email} to ${newRole}`,
    });
  };

  const handleRemoveUser = (email: string) => {
    console.log("Removing user", email);
    setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
    toast({
      title: "User removed",
      description: `Successfully removed ${email} from the system`,
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">User Permissions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.email}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  defaultValue={user.role.toLowerCase()}
                  onValueChange={(value) => handleRoleChange(user.email, value)}
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
                  onClick={() => handleRemoveUser(user.email)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
