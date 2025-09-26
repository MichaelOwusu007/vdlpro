// components/Orders/OrderListItem.tsx
"use client";
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Package } from "lucide-react";
import type { Order } from "./OrderTypes";

export function OrderListItem({
  order,
  onOpen,
  onDelete,
  onEdit,
}: {
  order: Order;
  onOpen: (o: Order) => void;
  onDelete: (o: Order) => void;
  onEdit: (o: Order) => void;
}) {
  const total = order.total ?? order.lines.reduce((s, l) => s + (l.totalPrice ?? (l.unitPrice ?? 0) * l.quantity), 0);

  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader>
        <div className="flex items-center justify-between gap-4 w-full">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-600" /> #{order.number}
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              {order.customerName ?? "Unknown customer"} • {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">${total.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">{order.status}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground truncate">
          {order.lines.slice(0,2).map(l => `${l.name} x${l.quantity}`).join(", ")}
          {order.lines.length > 2 ? ` + ${order.lines.length - 2} more` : ""}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => onOpen(order)}>View</Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(order)}><Edit className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(order)}><Trash className="h-4 w-4 text-destructive" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
