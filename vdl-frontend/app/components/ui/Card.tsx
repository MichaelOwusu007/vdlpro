import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl shadow-md border border-gray-200 bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}