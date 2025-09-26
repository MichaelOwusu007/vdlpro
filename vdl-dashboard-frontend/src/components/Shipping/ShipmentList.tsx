// components/Shipping/ShipmentList.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Shipment } from "./ShippingTypes";

export function ShipmentList({ shipments, onOpen }: { shipments: Shipment[]; onOpen: (s: Shipment) => void }) {
  if (!shipments.length) {
    return (
      <Card>
        <CardHeader><CardTitle>Shipments</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No shipments yet. Create a new shipment to begin.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipments</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Weight (kg)</TableCell>
              <TableCell>Created</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map(s => (
              <TableRow key={s.id} className="hover:bg-muted-foreground/5 transition">
                <TableCell>{s.reference}</TableCell>
                <TableCell>{s.customerName}</TableCell>
                <TableCell className="capitalize">{s.status.replace("_", " ")}</TableCell>
                <TableCell>{s.items.length}</TableCell>
                <TableCell>{(s.weightKg ?? 0).toFixed(2)}</TableCell>
                <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onOpen(s)}>
                      <MoreHorizontal />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
