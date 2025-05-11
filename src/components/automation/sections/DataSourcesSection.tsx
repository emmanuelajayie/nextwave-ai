
import { Label } from "@/components/ui/label";
import { Database, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface DataSourcesSectionProps {
  selectedCRMs: string[];
  storagePreference: string;
  sortBy: string;
  cleaningPreference: string;
  automaticModeling: boolean;
  onCRMSelection: (crm: string) => void;
  onStoragePreferenceChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onCleaningPreferenceChange: (value: string) => void;
  onAutomaticModelingChange: (value: boolean) => void;
}

export const DataSourcesSection = ({
  selectedCRMs,
  storagePreference,
  sortBy,
  cleaningPreference,
  automaticModeling,
  onCRMSelection,
  onStoragePreferenceChange,
  onSortByChange,
  onCleaningPreferenceChange,
  onAutomaticModelingChange,
}: DataSourcesSectionProps) => {
  const handleCRMSelection = (crm: string) => {
    onCRMSelection(crm);
    toast.success(`CRM ${selectedCRMs.includes(crm) ? 'removed' : 'added'}: ${crm}`);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Database className="h-5 w-5 text-primary" />
          <div>
            <Label>CRM Data Sources</Label>
            <p className="text-sm text-muted-foreground">
              Select which CRM systems to collect data from
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['hubspot', 'salesforce', 'zoho', 'custom'].map((crm) => (
            <Button
              key={crm}
              variant={selectedCRMs.includes(crm) ? "default" : "outline"}
              size="sm"
              onClick={() => handleCRMSelection(crm)}
              className="capitalize"
            >
              {crm}
            </Button>
          ))}
        </div>
        
        <div className="space-y-2 pt-4">
          <Label>Storage Preference</Label>
          <Select 
            value={storagePreference} 
            onValueChange={(value) => {
              onStoragePreferenceChange(value);
              toast.success(`Storage preference set to ${value}`);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select storage option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google_sheets">Google Sheets</SelectItem>
              <SelectItem value="excel_online">Excel Online</SelectItem>
              <SelectItem value="local_excel">Local Excel Files</SelectItem>
              <SelectItem value="database">Database Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 pt-4">
          <Label>Sort Data By</Label>
          <Select 
            value={sortBy} 
            onValueChange={(value) => {
              onSortByChange(value);
              toast.success(`Sort preference set to ${value}`);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="customer_name">Customer Name</SelectItem>
              <SelectItem value="lead_score">Lead Score</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <div>
            <Label>Data Cleaning Preferences</Label>
            <p className="text-sm text-muted-foreground">
              Choose how data should be cleaned
            </p>
          </div>
        </div>
        
        <Select 
          value={cleaningPreference} 
          onValueChange={(value) => {
            onCleaningPreferenceChange(value);
            toast.success(`Cleaning preference set to ${value}`);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select data cleaning method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automatic">Fully Automatic</SelectItem>
            <SelectItem value="interactive">Interactive (Prompt for decisions)</SelectItem>
            <SelectItem value="manual">Manual Only</SelectItem>
            <SelectItem value="scheduled">Scheduled (No interaction)</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <Label>Automatic Predictive Modeling</Label>
            <p className="text-sm text-muted-foreground">
              Automatically create models after data cleaning
            </p>
          </div>
          <Switch
            checked={automaticModeling}
            onCheckedChange={(value) => {
              onAutomaticModelingChange(value);
              toast.success(`Automatic modeling ${value ? 'enabled' : 'disabled'}`);
            }}
          />
        </div>
      </div>
    </>
  );
};
