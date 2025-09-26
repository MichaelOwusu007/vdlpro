// components/Shipping/TrackingStatus.tsx
import React from "react";
import { motion } from "framer-motion";

export function TrackingStatus({ status }: { status: string }) {
  const steps = [
    { key: "pending", label: "Pending" },
    { key: "packed", label: "Packed" },
    { key: "shipped", label: "Shipped" },
    { key: "in_transit", label: "In Transit" },
    { key: "delivered", label: "Delivered" },
  ];

  const currentIndex = Math.max(0, steps.findIndex(s => s.key === status));

  return (
    <div className="flex items-center gap-4">
      {steps.map((s, i) => {
        const done = i <= currentIndex;
        return (
          <div key={s.key} className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: done ? 1.05 : 1 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? "bg-indigo-600 text-white" : "bg-muted-foreground/20 text-muted-foreground"}`}
            >
              {i + 1}
            </motion.div>
            <div className="hidden sm:block text-xs">{s.label}</div>
            {i < steps.length - 1 && <div className={`h-px w-8 ${i < currentIndex ? "bg-indigo-600" : "bg-muted-foreground/20"}`} />}
          </div>
        );
      })}
    </div>
  );
}
