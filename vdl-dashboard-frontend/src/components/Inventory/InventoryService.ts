// components/Inventory/InventoryService.ts
import type { StockItem, Warehouse, TransferRecord, ProductLite } from "./InventoryTypes";

const STOCK_KEY = "app_stock";
const WAREHOUSE_KEY = "app_warehouses";
const TRANSFER_KEY = "app_transfers";
const LOG_KEY = "app_activity_logs";
const PRODUCT_KEY = "app_products";

// Activity log entry type
export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details?: Record<string, any>;
}

// === Helper: safe JSON parse ===
function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// === Helper: Seed Data ===
function ensureSeedData() {
  // Only seed if not present
  if (!localStorage.getItem(PRODUCT_KEY)) {
    const products = [
      // Example products
      { id: "P1", sku: "SKU1", name: "Product 1", price: 10 },
      { id: "P2", sku: "SKU2", name: "Product 2", price: 20 },
    ];
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  }
  if (!localStorage.getItem(WAREHOUSE_KEY)) {
    const warehouses = [
      { id: "W1", name: "Main Warehouse", location: "HQ", capacity: 1000 },
      { id: "W2", name: "Branch", location: "City", capacity: 500 },
    ];
    localStorage.setItem(WAREHOUSE_KEY, JSON.stringify(warehouses));
  }
  if (!localStorage.getItem(STOCK_KEY)) {
    const stock = [
      { productId: "P1", warehouseId: "W1", quantity: 100, sku: "SKU1", reorderPoint: 10 },
      { productId: "P2", warehouseId: "W2", quantity: 50, sku: "SKU2", reorderPoint: 5 },
    ];
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
  }
}

// === Products ===
function getProducts(): ProductLite[] {
  return safeParse<ProductLite[]>(PRODUCT_KEY, []);
}

function getProduct(id: string): ProductLite | undefined {
  return getProducts().find((p) => p.id === id);
}

// === Activity Log (pushActivity) ===
function pushActivity(log: any) {
  const logs = InventoryService.getLogs();
  logs.unshift(log);
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

export const InventoryService = {
  // === Stock ===
  getStock(): StockItem[] {
    return safeParse<StockItem[]>(STOCK_KEY, []);
  },
  saveStock(stock: StockItem[]) {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
  },

  // === Warehouses ===
  getWarehouses(): Warehouse[] {
    return safeParse<Warehouse[]>(WAREHOUSE_KEY, []);
  },
  saveWarehouses(wh: Warehouse[]) {
    localStorage.setItem(WAREHOUSE_KEY, JSON.stringify(wh));
  },

  // === Transfers ===
  getTransfers(): TransferRecord[] {
    return safeParse<TransferRecord[]>(TRANSFER_KEY, []);
  },
  saveTransfers(tr: TransferRecord[]) {
    localStorage.setItem(TRANSFER_KEY, JSON.stringify(tr));
  },

  // === Activity Logs ===
  getLogs(): ActivityLog[] {
    return safeParse<ActivityLog[]>(LOG_KEY, []);
  },
  log(action: string, details?: Record<string, any>) {
    const logs = InventoryService.getLogs();
    logs.unshift({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details,
    });
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  },

  logTransfer(record: TransferRecord) {
    InventoryService.log("TRANSFER", {
      productId: record.productId,
      qty: record.quantity,
      from: record.fromWarehouseId,
      to: record.toWarehouseId,
      status: record.status,
    });
  },

  logAdjustment(item: StockItem, change: number) {
    InventoryService.log("ADJUSTMENT", {
      productId: item.productId,
      variantId: item.variantId,
      change,
      newQty: item.quantity,
      warehouseId: item.warehouseId,
    });
  },

  logDeletion(item: StockItem) {
    InventoryService.log("DELETION", {
      productId: item.productId,
      sku: item.sku,
      warehouseId: item.warehouseId,
    });
  },

  // === Capacity & Valuation ===
  hasCapacity(warehouseId: string, amount: number): boolean {
    const wh = InventoryService.getWarehouses().find((w) => w.id === warehouseId);
    if (!wh?.capacity) return true; // unlimited capacity
    return InventoryService.getCapacityUsed(warehouseId) + amount <= wh.capacity;
  },

  getCapacityUsed(warehouseId: string): number {
    const stock = InventoryService.getStock().filter((s) => s.warehouseId === warehouseId);
    return stock.reduce((sum, s) => sum + s.quantity, 0);
  },

  getCapacityLeft(warehouseId: string): number | null {
    const wh = InventoryService.getWarehouses().find((w) => w.id === warehouseId);
    if (!wh?.capacity) return null;
    return wh.capacity - InventoryService.getCapacityUsed(warehouseId);
  },

  getWarehouseValue(warehouseId: string): number {
    const stock = InventoryService.getStock().filter((s) => s.warehouseId === warehouseId);
    return stock.reduce((sum, s) => {
      const price = Number((s as any).price ?? (s as any).meta?.price ?? 0);
      return sum + price * s.quantity;
    }, 0);
  },

  getTotalInventoryValue(): number {
    return InventoryService.getStock().reduce((sum, s) => {
      const price = Number((s as any).price ?? (s as any).meta?.price ?? 0);
      return sum + price * s.quantity;
    }, 0);
  },

  ensureSeedData,
  getProducts,
  getProduct,
  pushActivity,
};



