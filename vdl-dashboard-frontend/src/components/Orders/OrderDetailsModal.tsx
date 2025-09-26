// components/Orders/OrderDetailsModal.tsx
"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Order } from "./OrderTypes";
import { OrderService } from "./OrderService";
import { toast } from "sonner";

export function OrderDetailsModal({
  order,
  open,
  onClose,
  onUpdated,
}: {
  order?: Order;
  open: boolean;
  onClose: () => void;
  onUpdated?: (o: Order) => void;
}) {
  const [editable, setEditable] = useState<Order | undefined>(order);

  // when order prop changes, sync local state
  React.useEffect(() => setEditable(order), [order]);

  if (!open || !editable) return null;

  const total = editable.total ?? editable.lines.reduce((s,l) => s + (l.totalPrice ?? (l.unitPrice ?? 0) * l.quantity), 0);

  const changeStatus = (s: Order["status"]) => {
    const copy = { ...editable, status: s };
    setEditable(copy);
    OrderService.updateOrder(copy);
    OrderService.log(`Order ${copy.number} status changed to ${s}`, { orderId: copy.id });
    onUpdated?.(copy);
    toast.success(`Order ${copy.number} marked ${s}`);
  };

  const saveNotes = () => {
    if (!editable) return;
    OrderService.updateOrder(editable);
    onUpdated?.(editable);
    toast.success("Order saved");
  };

  const handleDelete = () => {
    if (!editable) return;
    if (!confirm(`Delete order ${editable.number}? This cannot be undone.`)) return;
    OrderService.deleteOrder(editable.id);
    OrderService.log(`Order ${editable.number} deleted`, { orderId: editable.id });
    onUpdated?.(editable);
    toast.success("Order deleted");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Order #{editable.number}</DialogTitle></DialogHeader>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">{editable.customerName}</div>
              <div className="text-xs text-muted-foreground">Created: {new Date(editable.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">${total.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">{editable.status}</div>
            </div>
          </div>

          <div className="space-y-1">
            {editable.lines.map(l => (
              <div key={l.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.sku} • {l.variantId ?? "base"}</div>
                </div>
                <div className="text-right">
                  <div>{l.quantity} × ${Number(l.unitPrice ?? 0).toFixed(2)}</div>
                  <div className="text-sm font-semibold">${Number(l.totalPrice ?? (l.unitPrice ?? 0) * l.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm">Notes</label>
            <textarea value={editable.notes ?? ""} onChange={(e) => setEditable({ ...editable, notes: e.target.value })} className="w-full border rounded p-2" />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => changeStatus("processing")}>Mark Processing</Button>
              <Button variant="ghost" onClick={() => changeStatus("fulfilled")}>Mark Fulfilled</Button>
              <Button variant="ghost" onClick={() => changeStatus("cancelled")}>Cancel</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              <Button onClick={saveNotes}>Save</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
