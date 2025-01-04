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
    date: "2024-01-01",
    revenue: "$5,234",
    customers: 123,
    region: "North",
  },
  {
    id: 2,
    date: "2024-01-02",
    revenue: "$6,112",
    customers: 145,
    region: "South",
  },
  {
    id: 3,
    date: "2024-01-03",
    revenue: "$4,889",
    customers: 98,
    region: "East",
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
            <TableHead>Date</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Customers</TableHead>
            <TableHead>Region</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.revenue}</TableCell>
              <TableCell>{row.customers}</TableCell>
              <TableCell>{row.region}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};