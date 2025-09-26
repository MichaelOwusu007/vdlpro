// components/Inventory/LowStockAlerts.tsx
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryService } from "./InventoryService";
import type { StockItem } from "./InventoryTypes";

export function LowStockAlerts({
  stock,
  onAdjust,
}: {
  stock: StockItem[];
  onAdjust: (s: StockItem[]) => void;
}) {
  const low = stock.filter((s) => (s.reorderPoint ?? 0) > s.quantity);

  const replenish = (item: StockItem) => {
    const newStock = stock.map((s) => {
      if (
        s.productId === item.productId &&
        s.warehouseId === item.warehouseId
      ) {
        const replenishQty = Math.max(item.reorderPoint ?? 10, 10);
        return {
          ...s,
          quantity: s.quantity + replenishQty,
          lastUpdated: new Date().toISOString(),
        };
      }
      return s;
    });
    InventoryService.saveStock(newStock);
    InventoryService.log(
      `Replenished ${item.name} in warehouse ${item.warehouseId}`
    );
    onAdjust(newStock);
  };

  if (low.length === 0) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {low.map((item) => (
            <div
              key={`${item.productId}-${item.warehouseId}`}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <div className="font-medium">{item.name} — {item.sku}</div>
                <div className="text-xs text-muted-foreground">
                  {item.warehouseId} • Qty: {item.quantity} • Reorder:{" "}
                  {item.reorderPoint}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => replenish(item)}
              >
                Replenish
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
