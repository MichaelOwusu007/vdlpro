// components/Shipping/ShippingOverview.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ShipmentList } from "./ShipmentList";
import { CreateShipmentForm } from "./CreateShipmentForm";
import { ShipmentDetailsModal } from "./ShipmentDetailsModal";
import { ActivityLog } from "./ActivityLog";
import { TrackingStatus } from "./TrackingStatus";
import { ShippingService } from "./ShippingService";
import type { Shipment } from "./ShippingTypes";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ShippingOverview() {
  const toast = useToast();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    ShippingService.ensureSeed();
    setShipments(ShippingService.getShipments());
    setActivity(ShippingService.getActivity());
  }, []);

  const filtered = useMemo(() => {
    return shipments.filter(s => {
      if (filterStatus !== "all" && s.status !== filterStatus) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return s.reference.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q) || (s.trackingId ?? "").toLowerCase().includes(q);
    });
  }, [shipments, filterStatus, query]);

  const onCreated = (s: Shipment) => {
    setShipments(prev => [s, ...prev]);
    setActivity(ShippingService.getActivity());
  };

  const onOpenDetails = (s: Shipment) => {
    setActiveShipment(s);
  };

  const onSaved = (s: Shipment) => {
    setShipments(ShippingService.getShipments());
    setActivity(ShippingService.getActivity());
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Shipping</h2>
          <p className="text-sm text-muted-foreground">Manage outbound shipments & tracking</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border rounded px-2 py-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Input placeholder="Search shipments, customer or tracking..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="packed">Packed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2">
            <Plus /> Create Shipment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <ShipmentList shipments={filtered} onOpen={(s) => onOpenDetails(s)} />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Quick Tracking</CardTitle></CardHeader>
            <CardContent>
              {/* demo: show latest shipment status */}
              {shipments[0] ? (
                <>
                  <div className="mb-3">
                    <div className="font-medium">{shipments[0].reference} • {shipments[0].customerName}</div>
                    <div className="text-xs text-muted-foreground">{shipments[0].trackingId ?? "No tracking id"}</div>
                  </div>
                  <TrackingStatus status={shipments[0].status} />
                </>
              ) : <div className="text-sm text-muted-foreground">No shipments</div>}
            </CardContent>
          </Card>

          <ActivityLog logs={activity} />
        </div>
      </div>

      <CreateShipmentForm open={createOpen} onClose={() => setCreateOpen(false)} onCreated={onCreated} />

      <ShipmentDetailsModal open={!!activeShipment} shipment={activeShipment} onClose={() => setActiveShipment(null)} onSaved={onSaved} />
    </div>
  );
}
