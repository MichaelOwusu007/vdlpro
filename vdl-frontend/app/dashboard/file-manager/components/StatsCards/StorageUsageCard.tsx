"use client";

import Card from "@/app/components/ui/Card"; // ✅ custom card
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", storage: 30 },
  { name: "Tue", storage: 50 },
  { name: "Wed", storage: 70 },
  { name: "Thu", storage: 90 },
  { name: "Fri", storage: 60 },
  { name: "Sat", storage: 40 },
  { name: "Sun", storage: 80 },
];

export default function StorageUsageCard() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Total Storage Used</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="storage" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
