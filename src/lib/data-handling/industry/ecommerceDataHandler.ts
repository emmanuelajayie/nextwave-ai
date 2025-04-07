
/**
 * E-commerce Data Handler
 * Specialized handlers for e-commerce industry data with high volume processing
 */
import { processLargeDataset, streamData } from "../largeDataProcessor";
import { toast } from "sonner";

// E-commerce specific types
export interface ProductData {
  id: string;
  name: string;
  price: number;
  inventory: number;
  category: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  attributes: Record<string, string>;
  price?: number;
  inventory: number;
}

export interface OrderData {
  id: string;
  customerId: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
}

interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Process large product catalog updates
 */
export async function processProductCatalog(
  products: ProductData[] | (() => Promise<ProductData[]>),
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    await processLargeDataset(
      products,
      async (chunk) => {
        // Process product chunk (would normally update database)
        console.log(`Processing ${chunk.length} products`);
        
        // Calculate total variants for reporting
        const totalVariants = chunk.reduce(
          (sum, product) => sum + (product.variants?.length || 0), 
          0
        );
        
        console.log(`Found ${totalVariants} product variants`);
        
        // Simulate database operations
        await new Promise(resolve => setTimeout(resolve, 100));
      },
      { 
        chunkSize: 1000, 
        onProgress,
      }
    );
    
    toast.success("Product catalog updated successfully");
  } catch (error) {
    console.error("Failed to process product catalog:", error);
    toast.error(`Product catalog update failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
}

/**
 * Process large order history for analytics
 */
export async function processOrderHistory(
  fetchOrderBatch: (offset: number, limit: number) => Promise<{ data: OrderData[], hasMore: boolean }>,
  onProgress?: (progress: number, processedOrders: number) => void
): Promise<{ totalOrders: number, totalRevenue: number }> {
  let totalOrders = 0;
  let totalRevenue = 0;

  try {
    const orderStream = streamData<OrderData>(fetchOrderBatch, { batchSize: 500 });
    
    for await (const orderBatch of orderStream) {
      // Process this batch of orders
      console.log(`Processing ${orderBatch.length} orders`);
      
      // Calculate batch metrics
      const batchRevenue = orderBatch.reduce((sum, order) => sum + order.total, 0);
      
      // Update totals
      totalOrders += orderBatch.length;
      totalRevenue += batchRevenue;
      
      if (onProgress) {
        onProgress(0, totalOrders); // Progress percentage unknown in streaming mode
      }
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    toast.success(`Processed ${totalOrders} orders successfully`);
    return { totalOrders, totalRevenue };
  } catch (error) {
    console.error("Failed to process order history:", error);
    toast.error(`Order history processing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
}

/**
 * Generate inventory alerts based on product data
 */
export function generateInventoryAlerts(products: ProductData[]): { 
  lowStock: ProductData[]; 
  outOfStock: ProductData[]; 
} {
  const lowStock: ProductData[] = [];
  const outOfStock: ProductData[] = [];
  
  for (const product of products) {
    if (product.inventory === 0) {
      outOfStock.push(product);
    } else if (product.inventory < 10) {
      lowStock.push(product);
    }
    
    // Check variants too
    if (product.variants) {
      const lowStockVariants = product.variants.filter(v => v.inventory > 0 && v.inventory < 10);
      const outOfStockVariants = product.variants.filter(v => v.inventory === 0);
      
      if (outOfStockVariants.length > 0) {
        // Only add the product once if not already added
        if (!outOfStock.find(p => p.id === product.id)) {
          outOfStock.push(product);
        }
      } else if (lowStockVariants.length > 0) {
        // Only add the product once if not already added
        if (!lowStock.find(p => p.id === product.id) && !outOfStock.find(p => p.id === product.id)) {
          lowStock.push(product);
        }
      }
    }
  }
  
  return { lowStock, outOfStock };
}
