// components/Inventory/TransferStockModal.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { InventoryService } from "./InventoryService";
import type { StockItem, TransferRecord, Warehouse } from "./InventoryTypes";
import { toast } from "sonner";

export function TransferStockModal({
  open,
  onClose,
  warehouses,
  stock,
  onComplete,
  defaultFrom
}: {
  open: boolean;
  onClose(): void;
  warehouses: Warehouse[];
  stock: StockItem[];
  onComplete: (newStock: StockItem[], transferRecord?: TransferRecord & { sku?: string; fromName?: string; toName?: string; }) => void;
  defaultFrom?: string;
}) {
  const [fromWh, setFromWh] = useState<string | undefined>(defaultFrom);
  const [toWh, setToWh] = useState<string | undefined>(undefined);
  const [selectedSku, setSelectedSku] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    if (defaultFrom) setFromWh(defaultFrom);
  }, [defaultFrom, open]);

  const availableItems = useMemo(() => {
    if (!fromWh) return [];
    return stock.filter(s => s.warehouseId === fromWh);
  }, [stock, fromWh]);

  const handleTransfer = () => {
    if (!fromWh || !toWh || !selectedSku) {
      toast.error("Please select source, destination and a product");
      return;
    }
    if (fromWh === toWh) {
      toast.error("Source and destination must be different");
      return;
    }
    if (qty <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }

    const sourceIndex = stock.findIndex(s => s.warehouseId === fromWh && s.sku === selectedSku);
    if (sourceIndex === -1) {
      toast.error("Selected SKU not found in source");
      return;
    }
    if (stock[sourceIndex].quantity < qty) {
      toast.error("Insufficient quantity in source");
      return;
    }

    const newStock = stock.map(s => ({ ...s }));
    newStock[sourceIndex].quantity -= qty;
    newStock[sourceIndex].lastUpdated = new Date().toISOString();

    const destIndex = newStock.findIndex(s => s.warehouseId === toWh && s.sku === selectedSku);
    if (destIndex === -1) {
      const newLine: StockItem = {
        ...newStock[sourceIndex],
        id: `STK-${Date.now()}`,
        warehouseId: toWh,
        quantity: qty,
        lastUpdated: new Date().toISOString(),
      };
      newStock.push(newLine);
    } else {
      newStock[destIndex].quantity += qty;
      newStock[destIndex].lastUpdated = new Date().toISOString();
    }

    // create transfer record
    const transfer: TransferRecord & { sku?: string; fromName?: string; toName?: string } = {
      id: `TR-${Date.now()}`,
      productId: newStock[sourceIndex].productId,
      variantId: newStock[sourceIndex].variantId ?? null,
      fromWarehouseId: fromWh,
      toWarehouseId: toWh,
      quantity: qty,
      createdAt: new Date().toISOString(),
      status: "completed",
      // extras
      sku: newStock[sourceIndex].sku,
      fromName: warehouses.find(w => w.id === fromWh)?.name,
      toName: warehouses.find(w => w.id === toWh)?.name,
    };

    const transfers = InventoryService.getTransfers();
    transfers.unshift(transfer);
    InventoryService.saveTransfers(transfers);
    InventoryService.saveStock(newStock);

    toast.success("Transfer completed");
    onComplete(newStock, transfer);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Transfer Stock</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <div className="text-sm text-muted-foreground mb-1">From Warehouse</div>
            <Select value={fromWh} onValueChange={(v) => setFromWh(v)}>
              <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
              <SelectContent>{warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">To Warehouse</div>
            <Select value={toWh} onValueChange={(v) => setToWh(v)}>
              <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
              <SelectContent>{warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Product (SKU)</div>
            <Select value={selectedSku} onValueChange={(v) => setSelectedSku(v)}>
              <SelectTrigger><SelectValue placeholder="Select product from source" /></SelectTrigger>
              <SelectContent>
                {availableItems.map(i => (
                  <SelectItem key={i.sku} value={i.sku}>{i.sku} — {i.name} ({i.quantity})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Quantity</div>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value || 0))} className="w-full border rounded px-2 py-1" />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleTransfer}>Transfer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
