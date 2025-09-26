"use client";

import { useState } from "react";
import {
  Package,
  ShoppingCart,
  Truck,
  AlertTriangle,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/Dashboard/KPICard";

// KPI Data
const kpiData = [
  {
    title: "Total Products",
    value: "12,847",
    icon: Package,
    trend: { value: 8.2, isPositive: true },
  },
  {
    title: "Orders Today",
    value: "342",
    icon: ShoppingCart,
    trend: { value: 12.5, isPositive: true },
    variant: "success" as const,
  },
  {
    title: "Pending Shipments",
    value: "89",
    icon: Truck,
    trend: { value: -4.1, isPositive: false },
    variant: "warning" as const,
  },
  {
    title: "Low Stock Alerts",
    value: "23",
    icon: AlertTriangle,
    variant: "destructive" as const,
  },
  {
    title: "Fulfillment Rate",
    value: "98.7%",
    icon: TrendingUp,
    trend: { value: 2.3, isPositive: true },
    variant: "success" as const,
  },
  {
    title: "Warehouse Utilization",
    value: "76%",
    icon: Warehouse,
    trend: { value: 5.1, isPositive: true },
  },
];

// Orders data
const ordersData = [
  { day: "Mon", orders: 145 },
  { day: "Tue", orders: 189 },
  { day: "Wed", orders: 234 },
  { day: "Thu", orders: 198 },
  { day: "Fri", orders: 342 },
  { day: "Sat", orders: 267 },
  { day: "Sun", orders: 156 },
];

// Warehouse data
const warehouseData = [
  { warehouse: "Main", stock: 8450 },
  { warehouse: "North", stock: 3200 },
  { warehouse: "South", stock: 4670 },
  { warehouse: "East", stock: 2890 },
];

// Storage data
const storageData = [
  { name: "Used", value: 76, color: "hsl(214, 84%, 56%)" },
  { name: "Available", value: 24, color: "hsl(210, 20%, 89%)" },
];

// Alerts
const alerts = [
  {
    id: 1,
    type: "Low Stock",
    product: "Premium Headphones",
    message: "Only 5 units remaining",
    severity: "high",
  },
  {
    id: 2,
    type: "Delayed Shipment",
    order: "ORD-2024-001234",
    message: "Shipment delayed by 2 days",
    severity: "medium",
  },
  {
    id: 3,
    type: "Quality Check",
    product: "Wireless Mouse",
    message: "Batch QC-240108 requires inspection",
    severity: "low",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your WMS overview. Here's what's happening today.
        </p>
      </div>

      {/* KPI Grid (3x2 instead of carousel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts (Stacked in columns) */}
      <div className="space-y-6">
        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders This Week</CardTitle>
            <CardDescription>Daily order volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(214, 84%, 56%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(214, 84%, 56%)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock by Warehouse */}
        <Card>
          <CardHeader>
            <CardTitle>Stock by Warehouse</CardTitle>
            <CardDescription>Current inventory levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={warehouseData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="warehouse" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar
                  dataKey="stock"
                  fill="hsl(214, 84%, 56%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <CardDescription>Warehouse capacity</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Recent Alerts
          </CardTitle>
          <CardDescription>
            Important notifications requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.severity === "high"
                        ? "bg-destructive"
                        : alert.severity === "medium"
                        ? "bg-warning"
                        : "bg-info"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-sm">{alert.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.message}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {alert.product || alert.order}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
