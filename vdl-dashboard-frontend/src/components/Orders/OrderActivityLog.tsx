// components/Orders/OrderActivityLog.tsx
"use client";
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { OrderService } from "./OrderService";

export function OrderActivityLog({ limit = 20 }: { limit?: number }) {
  const logs = OrderService.getLogs().slice(0, limit);
  if (!logs || logs.length === 0) return null;

  return (
    <Card>
      <CardHeader><CardTitle>Order Activity</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {logs.map(l => (
            <li key={l.id} className="border-b pb-1">
              <div className="text-xs text-muted-foreground">{new Date(l.ts).toLocaleString()}</div>
              <div className="font-medium">{l.message}</div>
              {l.meta && <div className="text-xs text-muted-foreground">{JSON.stringify(l.meta)}</div>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
