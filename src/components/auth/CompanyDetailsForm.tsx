
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface CompanyDetailsFormProps {
  email: string;
  onSuccess: () => void;
}

// Supported industries in the application
const supportedIndustries = [
  { value: "ecommerce", label: "E-commerce" },
  { value: "finance", label: "Finance" },
  { value: "logistics", label: "Logistics" },
  { value: "tech", label: "Technology" },
  { value: "realestate", label: "Real Estate" }
];

export const CompanyDetailsForm = ({ email, onSuccess }: CompanyDetailsFormProps) => {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [businessSize, setBusinessSize] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          company_name: companyName,
          employee_count: parseInt(employeeCount),
          business_size: businessSize,
          industry: industry // Store the selected industry
        });

      if (error) throw error;

      toast.success("Company details saved successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Company Details</h2>
        <p className="text-gray-600 mt-2">Please provide your company information</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Number of Employees"
            value={employeeCount}
            onChange={(e) => setEmployeeCount(e.target.value)}
            required
          />
        </div>
        <div>
          <Select
            value={businessSize}
            onValueChange={(value) => setBusinessSize(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Business Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small Business</SelectItem>
              <SelectItem value="medium">Small-Medium Business</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={industry}
            onValueChange={(value) => setIndustry(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Your Industry" />
            </SelectTrigger>
            <SelectContent>
              {supportedIndustries.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>
                  {ind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Complete Registration"}
        </Button>
      </form>
    </Card>
  );
};
