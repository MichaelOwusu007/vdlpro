// components/Shipping/ShippingTypes.ts
export type ShipmentStatus = "pending" | "packed" | "shipped" | "in_transit" | "delivered" | "cancelled";

export interface ShipmentItem {
  productId: string;
  sku: string;
  name: string;
  qty: number;
  weightKg?: number;
  price?: number;
  variantId?: string | null;
}

export interface Shipment {
  id: string;
  reference: string;
  customerName: string;
  customerAddress: string;
  createdAt: string;
  shippedAt?: string | null;
  carrier?: string | null;
  trackingId?: string | null;
  items: ShipmentItem[];
  status: ShipmentStatus;
  weightKg?: number;
  volumeM3?: number;
  cost?: number;
  note?: string;
}

export interface ShippingActivity {
  id: string;
  ts: string;
  type: "shipment_created" | "status_update" | "shipment_deleted" | "note";
  message: string;
  meta?: Record<string, any>;
}
