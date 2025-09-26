// components/Shipping/ShipmentDetailsModal.tsx
import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ShippingService } from "./ShippingService";
import type { Shipment, ShipmentItem, ShipmentStatus } from "./ShippingTypes";
import { toast } from "sonner";

export function ShipmentDetailsModal({ open, shipment, onClose, onSaved }: { open: boolean; shipment: Shipment | null; onClose: () => void; onSaved?: (s: Shipment) => void; }) {
  // use the imported toast directly
  const [local, setLocal] = useState<Shipment | null>(shipment);
  const carriers = ShippingService.getCarriers();

  // sync incoming shipment
  React.useEffect(() => { setLocal(shipment); }, [shipment]);

  const changeStatus = (status: ShipmentStatus) => {
    if (!local) return;
    const updated = ShippingService.setShipmentStatus(local.id, status);
    setLocal(updated);
    toast?.success?.("Status updated");
    onSaved?.(updated!);
  };

  const saveNote = (note: string) => {
    if (!local) return;
    const updated = ShippingService.updateShipment(local.id, { note });
    setLocal(updated);
    toast?.success?.("Note saved");
    onSaved?.(updated!);
  };

  if (!open || !local) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Shipment {local.reference}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-muted-foreground">Customer</div>
                  <div className="font-medium">{local.customerName}</div>
                  <div className="text-sm text-muted-foreground mt-1">{local.customerAddress}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Carrier</div>
                  <div className="flex gap-2 items-center">
                    <Select value={local.carrier ?? undefined} onValueChange={(v) => { const u = ShippingService.updateShipment(local.id, { carrier: v }); setLocal(u!); }}>
                      <SelectTrigger><SelectValue placeholder="Carrier" /></SelectTrigger>
                      <SelectContent>{carriers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <input className="border rounded px-2 py-1" placeholder="Tracking ID" value={local.trackingId ?? ""} onChange={(e) => { const u = ShippingService.updateShipment(local.id, { trackingId: e.target.value }); setLocal(u!); }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Items</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {local.items.map((it: ShipmentItem, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-muted-foreground">{it.sku} • {it.variantId ?? "base"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{it.qty}</div>
                      <div className="text-xs text-muted-foreground">{(it.weightKg ?? 0).toFixed(2)} kg</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Button onClick={() => changeStatus("packed")}>Mark Packed</Button>
                <Button onClick={() => changeStatus("shipped")}>Mark Shipped</Button>
                <Button onClick={() => changeStatus("delivered")}>Mark Delivered</Button>
                <Button variant="destructive" onClick={() => { ShippingService.deleteShipment(local.id); onClose(); toast?.success?.("Shipment deleted"); }}>Delete</Button>
              </div>
              <div className="text-sm text-muted-foreground">Created: {new Date(local.createdAt).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

