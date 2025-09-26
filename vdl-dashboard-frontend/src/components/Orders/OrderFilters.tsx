// components/Orders/OrderFilters.tsx
"use client";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function OrderFilters({
  status,
  onStatus,
  q,
  onQ,
}: {
  status: string | "all";
  onStatus: (v: string) => void;
  q: string;
  onQ: (v: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <div className="flex items-center gap-2 bg-white rounded shadow px-3 py-1 w-full sm:w-auto">
        <Input placeholder="Search orders, customer or SKU" value={q} onChange={(e)=>onQ(e.target.value)} className="border-0 shadow-none" />
      </div>

      <div className="min-w-[200px]">
        <Select value={status} onValueChange={onStatus}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
