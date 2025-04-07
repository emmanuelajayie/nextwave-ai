
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { processBankingTransactions } from "@/lib/data-handling/industry/bankingDataHandler";
import { processProductCatalog } from "@/lib/data-handling/industry/ecommerceDataHandler";
import { processMedicalRecords } from "@/lib/data-handling/industry/healthcareDataHandler";
import { AlertCircle, CheckCircle2, FileSpreadsheet, BarChart3, Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const DEMO_DATA_SIZE = 10000; // Number of records in the demo dataset

export const LargeDataProcessor = () => {
  const [activeTab, setActiveTab] = useState("banking");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [processedRecords, setProcessedRecords] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setProgress(0);
    setProcessingTime(null);
    setProcessedRecords(null);
    setError(null);
  };

  const handleProgress = (progressValue: number) => {
    setProgress(progressValue);
  };

  const generateDemoData = (industry: string, count: number = DEMO_DATA_SIZE) => {
    // Generate fake data for demo purposes
    console.log(`Generating ${count} ${industry} records for demo`);
    
    switch (industry) {
      case "banking":
        return Array.from({ length: count }, (_, i) => ({
          id: `tx-${i}`,
          timestamp: new Date().toISOString(),
          amount: Math.random() * 1000,
          accountId: `acc-${Math.floor(Math.random() * 1000)}`,
          type: ["deposit", "withdrawal", "transfer"][Math.floor(Math.random() * 3)] as any,
          status: ["pending", "completed", "failed"][Math.floor(Math.random() * 3)] as any
        }));
      
      case "ecommerce":
        return Array.from({ length: count }, (_, i) => ({
          id: `prod-${i}`,
          name: `Product ${i}`,
          price: Math.random() * 100 + 10,
          inventory: Math.floor(Math.random() * 100),
          category: ["Electronics", "Clothing", "Home", "Books"][Math.floor(Math.random() * 4)],
          variants: Math.random() > 0.5 ? Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
            id: `var-${i}-${j}`,
            attributes: { color: ["Red", "Blue", "Green"][Math.floor(Math.random() * 3)] },
            inventory: Math.floor(Math.random() * 50)
          })) : undefined
        }));
      
      case "healthcare":
        return Array.from({ length: count }, (_, i) => ({
          id: `rec-${i}`,
          patientId: `pat-${Math.floor(Math.random() * 1000)}`,
          date: new Date().toISOString(),
          providerId: `prov-${Math.floor(Math.random() * 100)}`,
          diagnosis: Array.from(
            { length: Math.floor(Math.random() * 3) + 1 }, 
            () => ["Hypertension", "Diabetes", "Allergies", "Arthritis"][Math.floor(Math.random() * 4)]
          ),
          procedures: [],
          medications: Array.from(
            { length: Math.floor(Math.random() * 3) }, 
            () => ({
              name: ["Acetaminophen", "Lisinopril", "Metformin"][Math.floor(Math.random() * 3)],
              dosage: "100mg",
              frequency: "Daily",
              startDate: new Date().toISOString(),
            })
          ),
          notes: "Patient follow-up recommended in 3 months."
        }));
      
      default:
        return [];
    }
  };

  const processData = async () => {
    resetState();
    setIsProcessing(true);
    const startTime = performance.now();

    try {
      switch (activeTab) {
        case "banking": {
          const demoData = generateDemoData("banking");
          await processBankingTransactions(demoData, handleProgress);
          setProcessedRecords(demoData.length);
          break;
        }
        case "ecommerce": {
          const demoData = generateDemoData("ecommerce");
          await processProductCatalog(demoData, handleProgress);
          setProcessedRecords(demoData.length);
          break;
        }
        case "healthcare": {
          const demoData = generateDemoData("healthcare");
          await processMedicalRecords(demoData, handleProgress);
          setProcessedRecords(demoData.length);
          break;
        }
      }
      
      const endTime = performance.now();
      setProcessingTime(Math.round(endTime - startTime));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsProcessing(false);
      setProgress(100); // Ensure progress shows complete
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Large Data Processing</CardTitle>
        <CardDescription>
          Process large volumes of industry-specific data efficiently
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
            <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
          </TabsList>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {processedRecords !== null && processingTime !== null && !error && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Processing Complete</AlertTitle>
              <AlertDescription>
                Processed {processedRecords.toLocaleString()} records in {processingTime}ms
              </AlertDescription>
            </Alert>
          )}

          <TabsContent value="banking">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Banking Data Processing</h3>
              <p className="text-muted-foreground">
                Securely process large volumes of sensitive banking transactions with
                automatic validation and masking of sensitive fields.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="ecommerce">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">E-Commerce Data Processing</h3>
              <p className="text-muted-foreground">
                Efficiently process large product catalogs and order histories
                with inventory tracking and automated alerting.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="healthcare">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Healthcare Data Processing</h3>
              <p className="text-muted-foreground">
                Process medical records with HIPAA-compliant data handling, 
                including PHI redaction and anonymization capabilities.
              </p>
            </div>
          </TabsContent>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <span className="font-medium">Data Size: {DEMO_DATA_SIZE.toLocaleString()} records</span>
            </div>
            
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Processing progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
            
            <Button 
              onClick={processData} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Process {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Data
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
