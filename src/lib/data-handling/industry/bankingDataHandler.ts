/**
 * Banking Data Handler
 * Specialized handlers for banking industry data with security measures
 */
import { processLargeDataset } from "../largeDataProcessor";
import { toast } from "sonner";

// Types specific to banking data
export interface BankingTransactionData {
  id: string;
  timestamp: string;
  amount: number;
  accountId: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

export interface AccountData {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: string;
  owner: string;
}

/**
 * Validate banking transactions
 * Checks for required fields and data format issues
 */
export function validateBankingTransactions(data: BankingTransactionData[]): { 
  valid: boolean; 
  errors?: string[]; 
} {
  const errors: string[] = [];
  
  // Sample validation rules
  for (let i = 0; i < data.length; i++) {
    const transaction = data[i];
    
    if (!transaction.id) errors.push(`Transaction at index ${i} missing ID`);
    if (typeof transaction.amount !== 'number') errors.push(`Transaction ${transaction.id}: Invalid amount`);
    if (!['deposit', 'withdrawal', 'transfer'].includes(transaction.type)) {
      errors.push(`Transaction ${transaction.id}: Invalid transaction type`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Process large banking transaction datasets
 */
export async function processBankingTransactions(
  transactions: BankingTransactionData[] | (() => Promise<BankingTransactionData[]>),
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    const startTime = performance.now();
    
    await processLargeDataset(
      transactions,
      async (chunk) => {
        // Here we would normally persist to database or apply business logic
        // For demo purposes we're just logging
        console.log(`Processing ${chunk.length} banking transactions`);
        
        // Simulate transaction processing that would happen in a real app
        await new Promise(resolve => setTimeout(resolve, 200));
      },
      { 
        chunkSize: 500, 
        onProgress,
        validateData: validateBankingTransactions
      }
    );
    
    const duration = Math.round(performance.now() - startTime);
    
    toast.success(`Banking transactions processed successfully in ${duration}ms`);
    return;
  } catch (error) {
    console.error("Failed to process banking transactions:", error);
    toast.error(`Banking data processing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
}

/**
 * Securely mask sensitive banking data (account numbers, etc.)
 * This version uses proper type checking for generic object types
 */
export function maskSensitiveBankingData<T extends Record<string, any>>(
  data: T[], 
  fieldsToMask: string[] = ['accountNumber', 'ssn', 'taxId']
): T[] {
  return data.map(item => {
    // Create a shallow copy of the item
    const maskedItem = { ...item } as T;
    
    for (const field of fieldsToMask) {
      // Check if the field exists and is a string before attempting to mask it
      if (typeof field === 'string' && field in maskedItem) {
        const fieldValue = maskedItem[field as keyof T];
        
        // Only process if the field value is a string
        if (typeof fieldValue === 'string') {
          const value = fieldValue;
          let maskedValue: string;
          
          // Keep first and last characters, mask the rest
          if (value.length > 6) {
            maskedValue = `${value.substring(0, 2)}${'*'.repeat(value.length - 4)}${value.substring(value.length - 2)}`;
          } else if (value.length > 2) {
            maskedValue = `${value.substring(0, 1)}${'*'.repeat(value.length - 2)}${value.substring(value.length - 1)}`;
          } else {
            maskedValue = '**';
          }
          
          // Use type assertion for assignment
          maskedItem[field as keyof T] = maskedValue as any;
        }
      }
    }
    
    return maskedItem;
  });
}
