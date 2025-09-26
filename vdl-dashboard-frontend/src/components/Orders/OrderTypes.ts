// components/Orders/OrderTypes.ts
export type OrderStatus = "draft" | "pending" | "processing" | "fulfilled" | "cancelled";

export interface OrderLine {
  id: string;
  productId: string;
  sku: string;
  name: string;
  variantId?: string | null;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface Order {
  id: string;
  number: string; // human-friendly order number
  customerName?: string;
  createdAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  warehouseId?: string; // fulfillment warehouse
  notes?: string;
  total?: number;
  meta?: Record<string, any>;
}
