import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryService } from "./InventoryService";
import { WarehouseStockCard } from "./WarehouseStockCard";
import { TransferStockModal } from "./TransferStockModal";
import { LowStockAlerts } from "./LowStockAlerts";
import { BarcodeScannerMock } from "./BarcodeScannerMock";
import { ActivityLog } from "./ActivityLog";
import type { Warehouse, StockItem, ProductLite } from "./InventoryTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Layers, ArrowLeftRight, QrCode } from "lucide-react";
import { toast } from "sonner";
import { ProductDetailsModal } from "./ProductDetailsModal";

export function InventoryOverview() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [products, setProducts] = useState<ProductLite[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | "all">("all");
  const [searchText, setSearchText] = useState("");
  const [selectedSkuForTransfer, setSelectedSkuForTransfer] = useState<string | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // 🔹 Load initial data
  useEffect(() => {
    InventoryService.ensureSeedData();
    setWarehouses(InventoryService.getWarehouses());
    setStock(InventoryService.getStock());
    setProducts(InventoryService.getProducts());
    setLogs(InventoryService.getLogs());
  }, []);

  // 🔹 Persist stock changes
  useEffect(() => {
    InventoryService.saveStock(stock);
  }, [stock]);

  // 🔹 Visible warehouses based on filter/search
  const visibleWarehouses = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    const base =
      selectedWarehouseId === "all"
        ? warehouses
        : warehouses.filter((w) => w.id === selectedWarehouseId);
    if (!q) return base;
    return base.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        (w.location || "").toLowerCase().includes(q)
    );
  }, [warehouses, selectedWarehouseId, searchText]);

  // 🔹 KPI stats
  const totals = useMemo(() => {
    const items =
      selectedWarehouseId === "all"
        ? stock
        : stock.filter((s) => s.warehouseId === selectedWarehouseId);

    const totalValue = items.reduce((sum, it) => {
      const product = InventoryService.getProduct(it.productId);
      return sum + (product?.price ?? 0) * it.quantity;
    }, 0);

    const totalProducts = items.length;
    const lowStock = items.filter((it) => (it.reorderPoint ?? 0) > it.quantity).length;

    if (selectedWarehouseId === "all") {
      return {
        totalValue,
        totalProducts,
        warehousesCount: warehouses.length,
        lowStock,
        warehouseName: "All Warehouses",
        capacity: undefined,
      };
    } else {
      const wh = warehouses.find((w) => w.id === selectedWarehouseId);
      const usedCapacity = items.reduce((s, it) => s + it.quantity, 0);
      return {
        totalValue,
        totalProducts,
        warehousesCount: 1,
        lowStock,
        warehouseName: wh?.name || "Warehouse",
        capacity: {
          total: wh?.capacity ?? 0,
          used: usedCapacity,
          left: (wh?.capacity ?? 0) - usedCapacity,
        },
      };
    }
  }, [stock, warehouses, selectedWarehouseId]);

  // 🔹 Handle transfer completion
  const onTransferComplete = (updatedStock: StockItem[], transferRecord?: any) => {
    setStock(updatedStock);
    setShowTransfer(false);
    if (transferRecord) {
      InventoryService.pushActivity({
        id: `ACT-${Date.now()}`,
        type: "transfer",
        message: `Transferred ${transferRecord.quantity} of SKU ${transferRecord.sku} from ${transferRecord.fromName} to ${transferRecord.toName}`,
        meta: transferRecord,
        createdAt: new Date().toISOString(),
      });
      setLogs(InventoryService.getLogs());
      toast.success("Transfer completed");
    }
  };

  // 🔹 Handle barcode receive
  const handleReceiveScan = (updatedStock: StockItem[], sku: string, qty: number) => {
    setStock(updatedStock);
    InventoryService.pushActivity({
      id: `ACT-${Date.now()}`,
      type: "receive",
      message: `Received ${qty} units of SKU ${sku}`,
      meta: { sku, qty },
      createdAt: new Date().toISOString(),
    });
    setLogs(InventoryService.getLogs());
    toast.success(`Received ${qty} units of ${sku}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Layers className="h-7 w-7 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold">Inventory Overview</h1>
            <p className="text-sm text-muted-foreground">
              Warehouse, stock and transfer management
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto items-center">
          <div className="flex items-center gap-2 bg-white shadow rounded-lg px-2 py-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search warehouses..."
              className="border-0 shadow-none"
            />
          </div>

          <div className="min-w-[220px]">
            <Select
              value={selectedWarehouseId}
              onValueChange={(v) => setSelectedWarehouseId(v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Warehouse / All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"all"}>All Warehouses</SelectItem>
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name} — {w.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setShowTransfer(true)}
            className="flex items-center gap-2"
          >
            <ArrowLeftRight className="h-4 w-4" /> Transfer
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              const el = document.getElementById("open-scanner-trigger");
              if (el) el.click();
            }}
            className="flex items-center gap-2"
          >
            <QrCode className="h-4 w-4" /> Scan
          </Button>
        </div>
      </div>

      {/* KPI / quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* total value */}
        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Total Value</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ${totals.totalValue.toFixed(2)}
          </CardContent>
        </Card>

        {/* total products */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totals.totalProducts}
          </CardContent>
        </Card>

        {/* warehouses/capacity */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>
              {selectedWarehouseId === "all"
                ? "Warehouses"
                : `${totals.warehouseName} Capacity`}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {selectedWarehouseId === "all"
              ? totals.warehousesCount
              : `${totals.capacity?.used}/${totals.capacity?.total} (Left: ${totals.capacity?.left})`}
          </CardContent>
        </Card>

        {/* low stock */}
        <Card className="bg-gradient-to-r from-amber-400 to-rose-500 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Low Stock</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-2xl font-bold">
            <div>{totals.lowStock}</div>
            <Button
              variant="ghost"
              onClick={() => setSelectedWarehouseId("all")}
              className="text-white"
            >
              View
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Low stock alerts */}
      <LowStockAlerts
        stock={
          selectedWarehouseId === "all"
            ? stock
            : stock.filter((s) => s.warehouseId === selectedWarehouseId)
        }
        onAdjust={setStock}
      />

      {/* Warehouses */}
      <div className="grid grid-cols-1 gap-4">
        {visibleWarehouses.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No warehouses found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Try searching or add warehouses.
              </p>
            </CardContent>
          </Card>
        ) : (
          visibleWarehouses.map((wh) => (
            <WarehouseStockCard
              key={wh.id}
              warehouse={wh}
              stock={stock.filter((s) => s.warehouseId === wh.id)}
              onAdjust={setStock}
              onQuickTransfer={() => {
                setSelectedWarehouseId(wh.id);
                setShowTransfer(true);
              }}
              onProductClick={(productId: string) => setSelectedProductId(productId)}
            />
          ))
        )}
      </div>

      {/* Bottom area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div id="open-scanner-trigger" style={{ display: "none" }} />
          <BarcodeScannerMock
            stock={stock}
            onUpdate={(s, sku, qty) => handleReceiveScan(s, sku, qty)}
          />
        </div>
        <div>
          <ActivityLog logs={logs} />
        </div>
      </div>

      {/* Transfer modal */}
      <TransferStockModal
        open={showTransfer}
        defaultFrom={selectedWarehouseId === "all" ? undefined : selectedWarehouseId}
        warehouses={warehouses}
        stock={stock}
        onClose={() => setShowTransfer(false)}
        onComplete={onTransferComplete}
      />

      {/* Product details modal */}
      <ProductDetailsModal
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
        product={products.find((p) => p.id === selectedProductId)}
      />
    </div>
  );
}
