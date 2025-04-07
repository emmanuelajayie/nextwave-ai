
import MainLayout from "@/components/layout/MainLayout";
import { LargeDataProcessor } from "@/components/data-handling/LargeDataProcessor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Shield, Database, TrendingUp, ArrowUpRight } from "lucide-react";

const IndustryDataProcessing = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Industry Data Processing</h1>
          <p className="text-muted-foreground">
            Process large volumes of industry-specific data with optimized handling and compliance features.
          </p>
        </div>

        <Tabs defaultValue="processing" className="space-y-4">
          <TabsList>
            <TabsTrigger value="processing">Data Processing</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Features</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>
          
          <TabsContent value="processing" className="space-y-4">
            <LargeDataProcessor />
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    Banking Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    <li>Transaction data processing</li>
                    <li>Financial analysis</li>
                    <li>Fraud detection patterns</li>
                    <li>Sensitive data masking</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    E-Commerce Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    <li>Product catalog processing</li>
                    <li>Order history analysis</li>
                    <li>Customer data management</li>
                    <li>Inventory optimization</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Healthcare Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    <li>Medical record processing</li>
                    <li>HIPAA-compliant handling</li>
                    <li>Data anonymization</li>
                    <li>PHI redaction capabilities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>Industry Compliance Features</CardTitle>
                <CardDescription>
                  Built-in compliance capabilities for regulated industries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Banking &amp; Financial Services
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>PCI DSS compliant data handling for payment information</li>
                    <li>Sensitive data masking for account numbers and identifiers</li>
                    <li>Transaction validation with fraud detection capabilities</li>
                    <li>Secure audit trails for all data modifications</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    E-Commerce &amp; Retail
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>GDPR-compliant customer data handling</li>
                    <li>Secure storage of order and payment information</li>
                    <li>Data retention policies with automated enforcement</li>
                    <li>Customer consent management capabilities</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Healthcare &amp; Life Sciences
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>HIPAA-compliant data handling for protected health information</li>
                    <li>Data anonymization for research and analytics</li>
                    <li>PHI redaction in free-text fields</li>
                    <li>Secure audit trails for all PHI access and modifications</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="architecture">
            <Card>
              <CardHeader>
                <CardTitle>Data Processing Architecture</CardTitle>
                <CardDescription>
                  Designed to efficiently process large volumes of data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted p-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-2 text-primary" />
                      Chunked Processing
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Data is automatically divided into manageable chunks to prevent memory issues
                      and browser freezing when dealing with large datasets.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-2 text-primary" />
                      Streaming Data Handling
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      For extremely large datasets, a streaming approach fetches and processes data
                      in batches, handling potentially millions of records efficiently.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-2 text-primary" />
                      Memory Monitoring
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time memory usage monitoring prevents application crashes by adjusting
                      processing parameters based on available resources.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-2 text-primary" />
                      Serverless Processing Support
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      For extremely demanding operations, processing can be offloaded to serverless
                      functions with automatic chunking and result aggregation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default IndustryDataProcessing;
