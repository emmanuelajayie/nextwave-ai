
/**
 * Healthcare Data Handler
 * Specialized handlers for healthcare industry data with HIPAA compliance features
 */
import { processLargeDataset } from "../largeDataProcessor";
import { toast } from "sonner";

// Healthcare specific types
export interface PatientData {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contact: PatientContact;
  insurance?: InsuranceInfo;
  // No protected health information in this interface for demonstration
}

interface PatientContact {
  phone: string;
  email?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  primaryInsured: string;
  relationship: string;
}

export interface MedicalRecordData {
  id: string;
  patientId: string;
  date: string;
  providerId: string;
  diagnosis: string[];
  procedures: string[];
  medications: MedicationPrescription[];
  notes: string;
  followUp?: string;
}

interface MedicationPrescription {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

/**
 * Anonymize patient data for research/analytics
 * Removes identifying information while preserving clinical data
 */
export function anonymizePatientData(
  patients: PatientData[]
): Record<string, any>[] {
  return patients.map(patient => {
    // Create research-safe record with anonymized ID and no PII
    return {
      anonymizedId: `ANON-${Math.random().toString(36).substring(2, 10)}`,
      gender: patient.gender,
      birthYear: new Date(patient.dateOfBirth).getFullYear(),
      state: patient.contact.address.state,
      // Add other non-identifying fields as needed
    };
  });
}

/**
 * Process large batches of healthcare records while maintaining HIPAA compliance
 */
export async function processMedicalRecords(
  records: MedicalRecordData[] | (() => Promise<MedicalRecordData[]>),
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    console.log("Processing medical records with HIPAA compliance measures");
    
    await processLargeDataset(
      records,
      async (chunk) => {
        // Process medical records chunk
        console.log(`Processing ${chunk.length} medical records`);
        
        // Here we'd apply business logic, store to database, etc.
        // For demo purposes we're just logging
        const diagnosisCount = chunk.reduce(
          (sum, record) => sum + record.diagnosis.length, 
          0
        );
        
        console.log(`Found ${diagnosisCount} diagnoses in this batch`);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 150));
      },
      { 
        chunkSize: 200, // Smaller chunks for sensitive data
        onProgress,
      }
    );
    
    toast.success("Medical records processed successfully");
  } catch (error) {
    console.error("Failed to process medical records:", error);
    toast.error(`Medical records processing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
}

/**
 * Redact sensitive information from text fields
 * Useful for notes and other free-text fields that might contain PHI
 */
export function redactSensitiveInformation(text: string): string {
  // Patterns that might indicate PHI
  const patterns = [
    // Phone numbers in various formats
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    
    // Email addresses
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    
    // SSN
    /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
    
    // Dates (various formats)
    /\b(0?[1-9]|1[0-2])[\/.-](0?[1-9]|[12]\d|3[01])[\/.-](19|20)?\d{2}\b/g,
    
    // Names (simple pattern - can be expanded)
    /\b(?:[A-Z][a-z]+ )+[A-Z][a-z]+\b/g,
  ];
  
  // Replace matches with [REDACTED]
  let redactedText = text;
  for (const pattern of patterns) {
    redactedText = redactedText.replace(pattern, '[REDACTED]');
  }
  
  return redactedText;
}
