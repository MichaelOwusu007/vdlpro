// components/Shipping/CreateShipmentForm.tsx
import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ShipmentItem, Shipment } from "./ShippingTypes";
import { ShippingService } from "./ShippingService";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export function CreateShipmentForm({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated?: (s: Shipment) => void }) {
  // use the imported toast directly
  const carriers = ShippingService.getCarriers();

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [carrier, setCarrier] = useState<string | undefined>(carriers[0]?.id);
  const [trackingId, setTrackingId] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<ShipmentItem[]>([
    { productId: "P1", sku: "SKU-001", name: "Demo Product", qty: 1, weightKg: 0.5, price: 10 }
  ]);

  const totalWeight = useMemo(() => items.reduce((s, it) => s + (it.weightKg ?? 0) * it.qty, 0), [items]);
  const costEstimate = useMemo(() => (carrier ? ShippingService.calcShippingCost(carrier, totalWeight) : 0), [carrier, totalWeight]);

  const addItem = () => {
    setItems(prev => [...prev, { productId: uuidv4(), sku: "", name: "", qty: 1 }]);
  };

  const updateItem = (idx: number, patch: Partial<ShipmentItem>) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCreate = () => {
    if (!customerName || !customerAddress || items.length === 0) {
      toast?.error?.("Please complete basic shipment details");
      return;
    }
    const reference = `OUT-${Date.now().toString().slice(-6)}`;
    const s = ShippingService.createShipment({
      reference,
      customerName,
      customerAddress,
      carrier,
      trackingId: trackingId || null,
      items,
      status: "pending",
      weightKg: totalWeight,
      cost: costEstimate,
      note,
    } as any);
    toast?.success?.("Shipment created.");
    onCreated?.(s);
    onClose();
    // reset form
    setCustomerName("");
    setCustomerAddress("");
    setCarrier(carriers[0]?.id);
    setTrackingId("");
    setItems([{ productId: "P1", sku: "SKU-001", name: "Demo Product", qty: 1, weightKg: 0.5 }]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Shipment</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input placeholder="Customer name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            <Input placeholder="Customer address" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Select value={carrier} onValueChange={v => setCarrier(v)}>
              <SelectTrigger><SelectValue placeholder="Choose carrier" /></SelectTrigger>
              <SelectContent>
                {carriers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Tracking ID (optional)" value={trackingId} onChange={e => setTrackingId(e.target.value)} />
            <Input placeholder="Reference (auto)" value={`OUT-${Date.now().toString().slice(-6)}`} disabled />
          </div>

          <div>
            <div className="font-medium mb-2">Items</div>
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input className="col-span-4 border rounded px-2 py-1" placeholder="Name" value={it.name} onChange={e => updateItem(idx, { name: e.target.value })} />
                  <input className="col-span-2 border rounded px-2 py-1" placeholder="SKU" value={it.sku} onChange={e => updateItem(idx, { sku: e.target.value })} />
                  <input type="number" className="col-span-2 border rounded px-2 py-1" min={1} value={it.qty} onChange={e => updateItem(idx, { qty: Math.max(1, Number(e.target.value)) })} />
                  <input type="number" className="col-span-2 border rounded px-2 py-1" step="0.01" placeholder="Weight Kg" value={it.weightKg ?? ""} onChange={e => updateItem(idx, { weightKg: Number(e.target.value || 0) })} />
                  <div className="col-span-2 flex gap-2">
                    <Button variant="ghost" onClick={() => removeItem(idx)}>Remove</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addItem}>+ Add item</Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Estimated weight: {totalWeight.toFixed(2)} kg</div>
            <div className="text-right">
              <div className="font-semibold">Est. Shipping: ${costEstimate.toFixed(2)}</div>
            </div>
          </div>

          <div>
            <Textarea placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleCreate}>Create Shipment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

