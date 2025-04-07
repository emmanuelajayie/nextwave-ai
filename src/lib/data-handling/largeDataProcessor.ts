
/**
 * Large Data Processing Utility
 * Handles efficient processing of large datasets through chunking and streams
 */
import { toast } from "sonner";

export type DataChunk = {
  index: number;
  data: any[];
  total: number;
  isLastChunk: boolean;
};

export type ProcessingOptions = {
  chunkSize: number;
  onProgress?: (progress: number) => void;
  onChunkProcessed?: (chunk: DataChunk) => void;
  validateData?: (data: any[]) => { valid: boolean; errors?: string[] };
};

const DEFAULT_CHUNK_SIZE = 1000;

/**
 * Process large datasets in manageable chunks to prevent memory issues
 */
export async function processLargeDataset<T>(
  dataSource: T[] | (() => Promise<T[]>),
  processor: (chunk: T[]) => Promise<void>,
  options: ProcessingOptions = { chunkSize: DEFAULT_CHUNK_SIZE }
): Promise<void> {
  const { chunkSize, onProgress, onChunkProcessed, validateData } = options;
  
  try {
    // Get data from source (array or function)
    const data = typeof dataSource === 'function' ? await dataSource() : dataSource;
    
    // Optional data validation
    if (validateData) {
      const validationResult = validateData(data);
      if (!validationResult.valid) {
        throw new Error(`Data validation failed: ${validationResult.errors?.join(', ')}`);
      }
    }

    const totalItems = data.length;
    const chunks = Math.ceil(totalItems / chunkSize);
    
    console.log(`Processing ${totalItems} items in ${chunks} chunks of ${chunkSize}`);
    
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, totalItems);
      const chunk = data.slice(start, end);
      
      // Process this chunk
      await processor(chunk);
      
      // Report progress
      const progress = Math.floor((end / totalItems) * 100);
      if (onProgress) {
        onProgress(progress);
      }
      
      if (onChunkProcessed) {
        onChunkProcessed({
          index: i,
          data: chunk,
          total: chunks,
          isLastChunk: i === chunks - 1
        });
      }
      
      console.log(`Processed chunk ${i + 1}/${chunks} (${progress}%)`);
      
      // Small delay to allow UI updates and prevent freezing
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  } catch (error) {
    console.error("Error processing large dataset:", error);
    toast.error("Failed to process data: " + (error instanceof Error ? error.message : "Unknown error"));
    throw error;
  }
}

/**
 * Stream data from a source in manageable chunks
 */
export async function* streamData<T>(
  fetchFn: (offset: number, limit: number) => Promise<{ data: T[], hasMore: boolean }>,
  options: { batchSize: number } = { batchSize: DEFAULT_CHUNK_SIZE }
): AsyncGenerator<T[], void> {
  const { batchSize } = options;
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    const result = await fetchFn(offset, batchSize);
    if (result.data.length > 0) {
      yield result.data;
      offset += result.data.length;
    }
    
    hasMore = result.hasMore && result.data.length > 0;
    
    // Small delay to prevent overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

/**
 * Monitor memory usage during large data operations
 */
export function monitorMemoryUsage(warningThresholdMB = 1024) {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    // Define a type for the Chrome's memory API
    interface MemoryInfo {
      usedJSHeapSize: number;
      jsHeapSizeLimit: number;
      totalJSHeapSize: number;
    }
    
    // Safely cast performance.memory to our defined type
    const memoryInfo = performance.memory as unknown as MemoryInfo;
    
    if (memoryInfo && memoryInfo.usedJSHeapSize) {
      const usedMB = Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024));
      const totalMB = Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024));
      const usagePercent = Math.round((usedMB / totalMB) * 100);
      
      console.log(`Memory usage: ${usedMB}MB / ${totalMB}MB (${usagePercent}%)`);
      
      if (usedMB > warningThresholdMB) {
        console.warn(`High memory usage detected: ${usedMB}MB`);
        return { warning: true, usedMB, totalMB, usagePercent };
      }
      
      return { warning: false, usedMB, totalMB, usagePercent };
    }
  }
  
  return null; // Memory monitoring not supported
}
