
import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryService } from "./InventoryService";
import type { StockItem } from "./InventoryTypes";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function BarcodeScannerMock({
  stock,
  onUpdate
}: {
  stock: StockItem[];
  onUpdate: (newStock: StockItem[], sku?: string, qty?: number) => void;
}) {
  const [code, setCode] = useState("");
  const [qty, setQty] = useState(1);
  const skuOptions = useMemo(() => {
    // unique SKU list
    const skus = Array.from(new Set(stock.map(s => s.sku)));
    return skus;
  }, [stock]);

  const handleScan = () => {
    if (!code) return toast.error("Please enter or select SKU");
    const idx = stock.findIndex(s => s.sku === code);
    if (idx === -1) return toast.error("SKU not found in demo stock");
    const newStock = stock.map(s => ({ ...s }));
    newStock[idx].quantity += qty;
    newStock[idx].lastUpdated = new Date().toISOString();
    InventoryService.saveStock(newStock);
    onUpdate(newStock, code, qty);
    setCode("");
    setQty(1);
  };

  return (
    <Card>
      <CardHeader><CardTitle>Barcode Scanner (demo)</CardTitle></CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Select value={code} onValueChange={(v) => setCode(v)}>
            <SelectTrigger><SelectValue placeholder="Select SKU or type" /></SelectTrigger>
            <SelectContent>
              {skuOptions.map(sku => <SelectItem key={sku} value={sku}>{sku}</SelectItem>)}
            </SelectContent>
          </Select>

          <Input placeholder="Or type SKU manually" value={code} onChange={(e) => setCode(e.target.value)} />

          <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value || 0))} className="border px-2 py-1 rounded" />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setCode(""); setQty(1); }}>Clear</Button>
            <Button onClick={handleScan}>Apply Receive</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
