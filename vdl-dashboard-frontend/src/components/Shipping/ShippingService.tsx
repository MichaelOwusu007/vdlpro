// components/Shipping/ShippingService.ts
import type { Shipment, ShippingActivity, ShipmentStatus } from "./ShippingTypes";

const SHIP_KEY = "wms_shipments_v1";
const ACT_KEY = "wms_shipping_activity_v1";

function safeParse<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(k);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const ShippingService = {
  // Shipments
  getShipments(): Shipment[] {
    return safeParse<Shipment[]>(SHIP_KEY, []);
  },
  saveShipments(list: Shipment[]) {
    localStorage.setItem(SHIP_KEY, JSON.stringify(list));
  },
  createShipment(s: Omit<Shipment, "id" | "createdAt">) {
    const existing = this.getShipments();
    const id = `SHP-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const newShipment: Shipment = { id, createdAt, ...s };
    existing.unshift(newShipment);
    this.saveShipments(existing);
    this.pushActivity({
      id: `ACT-${Date.now()}`,
      ts: new Date().toISOString(),
      type: "shipment_created",
      message: `Shipment ${newShipment.reference} created for ${newShipment.customerName}`,
      meta: { shipmentId: newShipment.id }
    });
    return newShipment;
  },
  updateShipment(id: string, patch: Partial<Shipment>) {
    const list = this.getShipments().map(s => (s.id === id ? { ...s, ...patch } : s));
    this.saveShipments(list);
    return list.find(s => s.id === id) || null;
  },
  setShipmentStatus(id: string, status: ShipmentStatus) {
    const list = this.getShipments();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    if (status === "shipped") list[idx].shippedAt = new Date().toISOString();
    this.saveShipments(list);
    this.pushActivity({
      id: `ACT-${Date.now()}`,
      ts: new Date().toISOString(),
      type: "status_update",
      message: `Shipment ${list[idx].reference} status changed to ${status}`,
      meta: { shipmentId: id, status }
    });
    return list[idx];
  },
  deleteShipment(id: string) {
    const list = this.getShipments();
    const removed = list.filter(s => s.id !== id);
    this.saveShipments(removed);
    this.pushActivity({
      id: `ACT-${Date.now()}`,
      ts: new Date().toISOString(),
      type: "shipment_deleted",
      message: `Shipment ${id} deleted`,
      meta: { shipmentId: id }
    });
  },

  // Activity logs
  getActivity(): ShippingActivity[] {
    return safeParse<ShippingActivity[]>(ACT_KEY, []);
  },
  pushActivity(entry: ShippingActivity) {
    const logs = this.getActivity();
    logs.unshift(entry);
    // keep last 200
    localStorage.setItem(ACT_KEY, JSON.stringify(logs.slice(0, 200)));
  },

  // Carriers & simple calculation helpers (demo)
  getCarriers() {
    return [
      { id: "dhl", name: "DHL Express", base: 5 },
      { id: "fedex", name: "FedEx", base: 6 },
      { id: "ups", name: "UPS", base: 5.5 },
      { id: "local", name: "Local Courier", base: 3 },
    ];
  },
  calcShippingCost(carrierId: string, weightKg: number, distanceKm = 10) {
    const carrier = this.getCarriers().find(c => c.id === carrierId);
    const base = carrier?.base ?? 5;
    // super simple demo formula
    return Math.max(4, base + weightKg * 0.8 + distanceKm * 0.05);
  },

  // seed demo data for first run
  ensureSeed() {
    if (!localStorage.getItem(SHIP_KEY)) {
      const demo: Shipment[] = [
        {
          id: "SHP-1001",
          reference: "OUT-1001",
          customerName: "Acme Corp",
          customerAddress: "12 Baker St, London",
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          items: [
            { productId: "P1", sku: "SKU-001", name: "Premium Laptop", qty: 2, weightKg: 2.5, price: 1200 },
            { productId: "P3", sku: "SKU-003", name: "Headphones", qty: 1, weightKg: 0.3, price: 199 },
          ],
          status: "shipped",
          carrier: "dhl",
          trackingId: "DHL-TRK-1001",
          weightKg: 5.3,
          cost: 25.5,
        },
        {
          id: "SHP-1002",
          reference: "OUT-1002",
          customerName: "Beta LLC",
          customerAddress: "25 Market Rd, Accra",
          createdAt: new Date().toISOString(),
          items: [
            { productId: "P2", sku: "SKU-002", name: "Smartphone Pro", qty: 1, weightKg: 0.4, price: 899 },
          ],
          status: "pending",
          weightKg: 0.4,
          cost: 5,
        },
      ];
      this.saveShipments(demo);
    }
    if (!localStorage.getItem(ACT_KEY)) {
      this.pushActivity({
        id: `ACT-${Date.now()}`,
        ts: new Date().toISOString(),
        type: "shipment_created",
        message: "Seeded demo shipments",
      });
    }
  }
};
