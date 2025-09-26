// components/Orders/OrdersOverview.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderService } from "./OrderService";
import { OrderListItem } from "./OrderListItem";
import { CreateOrderModal } from "./CreateOrderModal";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { OrderFilters } from "./OrderFilters";
import { OrderActivityLog } from "./OrderActivityLog";
import type { Order } from "./OrderTypes";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function OrdersOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterQ, setFilterQ] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | "all">("all");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Order | undefined>(undefined);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    OrderService.ensureSeedData?.();
    setOrders(OrderService.getOrders());
  }, []);

  const filtered = useMemo(() => {
    const q = filterQ.trim().toLowerCase();
    return orders.filter(o => {
      if (filterStatus !== "all" && o.status !== filterStatus) return false;
      if (!q) return true;
      return o.number.includes(q) || (o.customerName || "").toLowerCase().includes(q) || o.lines.some(l => l.sku.toLowerCase().includes(q));
    });
  }, [orders, filterQ, filterStatus]);

  const openCreate = () => setCreating(true);
  const handleCreated = (o: Order) => {
    setOrders(OrderService.getOrders());
    toast.success(`Order ${o.number} created`);
  };

  const handleOpen = (o: Order) => {
    setSelected(o);
    setDetailsOpen(true);
  };

  const handleEdit = (o: Order) => {
    setSelected(o);
    setDetailsOpen(true);
  };

  const handleDelete = (o: Order) => {
    if (!confirm(`Delete order ${o.number}?`)) return;
    OrderService.deleteOrder(o.id);
    setOrders(OrderService.getOrders());
    toast.success("Order deleted");
  };

  const handleUpdate = (o?: Order) => {
    setOrders(OrderService.getOrders());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage orders, fulfillment and history</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Order
          </Button>
        </div>
      </div>

      <OrderFilters status={filterStatus} onStatus={(v) => setFilterStatus(v)} q={filterQ} onQ={(v) => setFilterQ(v)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Card>
            <CardHeader><CardTitle>Orders ({filtered.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {filtered.map(o => (
                <OrderListItem key={o.id} order={o} onOpen={handleOpen} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
              {filtered.length === 0 && <div className="text-sm text-muted-foreground">No orders found</div>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <OrderActivityLog />
        </div>
      </div>

      <CreateOrderModal open={creating} onClose={() => setCreating(false)} onCreated={handleCreated} />
      <OrderDetailsModal open={detailsOpen} order={selected} onClose={() => setDetailsOpen(false)} onUpdated={handleUpdate} />
    </div>
  );
}
