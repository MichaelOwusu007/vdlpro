// components/Orders/CreateOrderModal.tsx
"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Order, OrderLine } from "./OrderTypes";
import { OrderService } from "./OrderService";

export function CreateOrderModal({
  open,
  onClose,
  onCreated
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (o: Order) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [lines, setLines] = useState<OrderLine[]>([
    { id: "L-" + Date.now(), productId: "P1", sku: "SKU-001", name: "Demo Product", quantity: 1, unitPrice: 100, totalPrice: 100 }
  ]);

  const addLine = () => {
    setLines(prev => [...prev, { id: `L-${Date.now()}`, productId: "P1", sku: "SKU-001", name: "Demo Product", quantity: 1, unitPrice: 100, totalPrice: 100 }]);
  };

  const updateLine = (idx: number, patch: Partial<OrderLine>) => {
    setLines(prev => prev.map((l, i) => i === idx ? { ...l, ...patch, totalPrice: (patch.unitPrice ?? l.unitPrice ?? 0) * (patch.quantity ?? l.quantity) } : l));
  };

  const removeLine = (idx: number) => setLines(prev => prev.filter((_, i) => i !== idx));

  const handleCreate = () => {
    const total = lines.reduce((s,l) => s + (l.totalPrice ?? (l.unitPrice ?? 0) * l.quantity), 0);
    const order: Order = {
      id: `ORD-${Date.now()}`,
      number: `${Math.floor(Math.random() * 9000) + 1000}`,
      customerName,
      createdAt: new Date().toISOString(),
      status: "pending",
      lines,
      total
    };
    OrderService.createOrder(order);
    onCreated?.(order);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Create Order</DialogTitle></DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="text-sm">Customer name</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border rounded px-2 py-1" />
          </div>

          <div className="space-y-2">
            {lines.map((l, idx) => (
              <div key={l.id} className="grid grid-cols-12 gap-2 items-center">
                <input className="col-span-5 border rounded px-2 py-1" value={l.name} onChange={(e) => updateLine(idx, { name: e.target.value })} />
                <input className="col-span-2 border rounded px-2 py-1" value={l.sku} onChange={(e) => updateLine(idx, { sku: e.target.value })} />
                <input type="number" className="col-span-1 border rounded px-2 py-1" value={l.quantity} onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) })} />
                <input type="number" className="col-span-2 border rounded px-2 py-1" value={l.unitPrice} onChange={(e) => updateLine(idx, { unitPrice: Number(e.target.value) })} />
                <div className="col-span-1 text-sm">{(l.totalPrice ?? (l.unitPrice ?? 0) * l.quantity).toFixed(2)}</div>
                <div className="col-span-1">
                  <Button size="sm" variant="ghost" onClick={() => removeLine(idx)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={addLine}>Add line</Button>
            <div>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={handleCreate} className="ml-2">Create Order</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
