"use client";

import Card from "@/app/components/ui/Card"; // ✅ use custom Card

export default function StorageCircleCard() {
  const used = 75; // 75% used
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (used / 100) * circumference;

  return (
    <Card className="p-6 flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-4">Storage Usage</h2>
      <div className="relative w-40 h-40">
        <svg className="w-40 h-40">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#3b82f6"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
          {used}%
        </span>
      </div>
    </Card>
  );
}
