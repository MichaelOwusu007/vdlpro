// components/Shipping/ActivityLog.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ShippingActivity } from "./ShippingTypes";

export function ActivityLog({ logs }: { logs: ShippingActivity[] }) {
  if (!logs || logs.length === 0) return (
    <Card>
      <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
      <CardContent><div className="text-sm text-muted-foreground">No activity yet.</div></CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {logs.map(l => (
            <li key={l.id} className="border-b pb-1">
              <div className="font-medium">{l.message}</div>
              <div className="text-xs text-muted-foreground">{new Date(l.ts).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
