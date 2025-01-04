import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

const sampleData = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    status: "Cleaned",
    issues: "None",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    status: "Warning",
    issues: "Missing Value",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "Cleaned",
    issues: "None",
  },
];

export const DataPreview = () => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Data Preview</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search data..."
              className="pl-8"
              onChange={(e) => console.log("Search:", e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => console.log("Validate data")}
          >
            Validate Data
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Issues</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    row.status === "Cleaned"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {row.status}
                </span>
              </TableCell>
              <TableCell>{row.issues}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};