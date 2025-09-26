// components/Inventory/InventoryTypes.ts
export interface Warehouse {
  capacity: number;
  id: string;
  name: string;
  location?: string;
  meta?: Record<string, any>;
}

export interface ProductLite {
  price: number;
  id: string;
  sku: string;
  name: string;
  image?: string;
}

export interface StockItem {
  meta: any;
  id: string;
  productId: string;
  sku: string;
  name: string;
  warehouseId: string;
  variantId?: string | null;
  quantity: number;
  reorderPoint?: number;
  batchLot?: string;
  lastUpdated?: string;
  note?: string;
  image?: string;
}

export type TransferStatus = "pending" | "completed" | "cancelled";

export interface TransferRecord {
  id: string;
  productId: string;
  variantId?: string | null;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  createdAt: string;
  status: TransferStatus;
  note?: string;
}


