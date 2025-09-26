"use client";

import { useState } from "react";
import { WarehouseStockCard } from "./WarehouseStockCard";
import { TransferStockModal } from "./TransferStockModal";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, Building2, ArrowLeftRight } from "lucide-react";

// Default warehouse + stock data
const initialWarehouses = [
  {
    id: "wh1",
    name: "Accra Main Warehouse",
    stock: {
      "Laptop": 25,
      "Headphones": 40,
      "Keyboard": 15,
    },
  },
  {
    id: "wh2",
    name: "Kumasi Distribution Center",
    stock: {
      "Laptop": 10,
      "Headphones": 20,
      "Keyboard": 30,
    },
  },
  {
    id: "wh3",
    name: "Takoradi Backup Warehouse",
    stock: {
      "Laptop": 5,
      "Headphones": 8,
      "Keyboard": 12,
    },
  },
];

export function InventoryDashboard() {
  const [warehouses, setWarehouses] = useState(initialWarehouses);

  const handleTransfer = (fromId: string, toId: string, product: string, qty: number) => {
    if (fromId === toId) {
      toast.error("You cannot transfer stock to the same warehouse.");
      return;
    }

    const updatedWarehouses = warehouses.map((wh) => {
      if (wh.id === fromId) {
        if ((wh.stock[product] || 0) < qty) {
          toast.error("Not enough stock to transfer.");
          throw new Error("Insufficient stock");
        }
        return {
          ...wh,
          stock: {
            ...wh.stock,
            [product]: (wh.stock[product] || 0) - qty,
          },
        };
      }
      if (wh.id === toId) {
        return {
          ...wh,
          stock: {
            ...wh.stock,
            [product]: (wh.stock[product] || 0) + qty,
          },
        };
      }
      return wh;
    });

    setWarehouses(updatedWarehouses);
    toast.success(`${qty} ${product}(s) transferred successfully!`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Package className="h-6 w-6 text-blue-600" /> Inventory Management
      </h1>

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-lg">
          <TabsTrigger value="view" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> View Warehouses
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" /> Transfer Stock
          </TabsTrigger>
        </TabsList>

        {/* View Warehouse Stocks */}
        <TabsContent value="view" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {warehouses.map((wh) => (
              <WarehouseStock key={wh.id} warehouse={wh} />
            ))}
          </div>
        </TabsContent>

        {/* Transfer Stock */}
        <TabsContent value="transfer" className="mt-6">
          <TransferStock warehouses={warehouses} onTransfer={handleTransfer} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
