// components/Orders/OrderService.ts
import type { Order } from "./OrderTypes";

/**
 * Simple localStorage-backed Order service for demo.
 * Keeps same patterns as your InventoryService.
 */

const ORDERS_KEY = "wms_orders_v1";
const LOGS_KEY = "wms_orders_logs_v1";

function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export interface OrderActivity {
  id: string;
  ts: string;
  type: string;
  message: string;
  meta?: any;
}

export const OrderService = {
  // CRUD
  getOrders(): Order[] {
    return safeParse<Order[]>(ORDERS_KEY, []);
  },

  saveOrders(list: Order[]) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  },

  getOrder(id: string) {
    return this.getOrders().find(o => o.id === id);
  },

  createOrder(order: Order) {
    const all = this.getOrders();
    all.unshift(order);
    this.saveOrders(all);
    this.log(`Created order ${order.number}`, { orderId: order.id });
  },

  updateOrder(updated: Order) {
    const all = this.getOrders().map(o => o.id === updated.id ? updated : o);
    this.saveOrders(all);
    this.log(`Updated order ${updated.number}`, { orderId: updated.id });
  },

  deleteOrder(id: string) {
    const all = this.getOrders().filter(o => o.id !== id);
    this.saveOrders(all);
    this.log(`Deleted order ${id}`, { orderId: id });
  },

  // Activity logs
  getLogs(): OrderActivity[] {
    return safeParse<OrderActivity[]>(LOGS_KEY, []);
  },

  log(message: string, meta?: any) {
    const logs = this.getLogs();
    logs.unshift({
      id: crypto?.randomUUID?.() ?? `${Date.now()}`,
      ts: new Date().toISOString(),
      type: meta?.type ?? "info",
      message,
      meta,
    });
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  // Seed sample data (demo)
  ensureSeedData() {
    // seed products/warehouses should already exist in your app; this seeds orders only
    const existing = this.getOrders();
    if (existing.length) return;

    const now = new Date();
    const sampleOrders: Order[] = [
      {
        id: "ORD-1001",
        number: "1001",
        customerName: "Acme Corp",
        createdAt: now.toISOString(),
        status: "pending",
        warehouseId: "WH-1",
        lines: [
          { id: "L1", productId: "P1", sku: "SKU-001", name: "Premium Laptop", quantity: 2, unitPrice: 1200, totalPrice: 2400 },
        ],
        total: 2400,
        notes: "Priority delivery"
      },
      {
        id: "ORD-1002",
        number: "1002",
        customerName: "Beta LLC",
        createdAt: new Date(now.getTime() - 1000*60*60*24).toISOString(),
        status: "processing",
        warehouseId: "WH-2",
        lines: [
          { id: "L2", productId: "P2", sku: "SKU-002", name: "Wireless Headphones", quantity: 5, unitPrice: 199, totalPrice: 995 },
          { id: "L3", productId: "P3", sku: "SKU-003", name: "Smartwatch", quantity: 2, unitPrice: 199, totalPrice: 398 },
        ],
        total: 1393,
      }
    ];
    this.saveOrders(sampleOrders);
    this.log("Seeded sample orders");
  }
};
