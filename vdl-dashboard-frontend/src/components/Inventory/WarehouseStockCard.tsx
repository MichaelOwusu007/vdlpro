// components/Inventory/WarehouseStockCard.tsx
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Warehouse, StockItem } from "./InventoryTypes";

export function WarehouseStockCard({
  warehouse,
  stock,
  onAdjust,
  onQuickTransfer,
  onProductClick,
}: {
  warehouse: Warehouse;
  stock: StockItem[];
  onAdjust: (newStock: StockItem[]) => void;
  onQuickTransfer: () => void;
  onProductClick: (productId: string) => void; // <-- Change here
}) {
  const totalQty = stock.reduce((s, i) => s + i.quantity, 0);

  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  return (
    <Card className="shadow-md rounded-xl">
      {/* Warehouse header */}
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle className="flex items-center gap-1">
              <span className="text-lg font-semibold">{warehouse.name}</span>
            </CardTitle>
            <div className="text-xs text-muted-foreground">{warehouse.location}</div>
          </div>
          <div className="text-sm font-semibold">{totalQty}</div>
        </div>
      </CardHeader>

      {/* Stock list */}
      <CardContent>
        <div  className="space-y-2 lg:grid grid-cols-3 gap-4 justify-between max-h-64  overflow-auto">
          {stock.length === 0 && (
            <div className="text-sm text-muted-foreground italic">
              No stock in this warehouse
            </div>
          )}

          {stock.map((item) => {
            const price = Number((item as any).price ?? (item as any).meta?.price ?? 0);
            const hasLow = (item.reorderPoint ?? 0) > item.quantity;

            return (
              <div
                key={`${item.productId}-${item.variantId ?? "base"}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onProductClick(item.productId); // <-- Change here
                }}
                onClick={() => onProductClick(item.productId)} // <-- Change here
                aria-label={`Open details for ${item.name}`}
                className="flex items-center p-10  justify-between rounded-lg border hover:bg-gray-50 focus:bg-gray-50 transition-transform transform hover:-translate-y-0.5 active:scale-[0.995] cursor-pointer"
              >
                {/* Product image + info */}
                <div className="flex gap-3 items-center min-w-0">
                  <div className="w-10 h-10 rounded overflow-hidden bg-muted-foreground/10 flex-shrink-0">
                    <img
                      src={item.image ?? "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.sku}
                      {item.batchLot ? ` • ${item.batchLot}` : ""}
                      {item.variantId ? ` • Variant: ${item.variantId}` : ""}
                    </div>
                  </div>
                </div>

                {/* Quantity + price */}
                <div className="text-right ml-4 flex-shrink-0">
                  <div className="font-semibold">{item.quantity}</div>
                  <div className="text-xs text-muted-foreground">
                    {fmt(price)} • Reorder: {item.reorderPoint ?? "-"}
                    {hasLow && (
                      <span className="ml-2 text-amber-600 font-medium">• Low</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={onQuickTransfer}>
            Transfer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
