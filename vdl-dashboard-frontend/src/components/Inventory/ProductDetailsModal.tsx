// components/Inventory/ProductDetailsModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ProductLite } from "./InventoryTypes";

export interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductLite | undefined;
}

export function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl animate-slideIn">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image preview */}
          <div className="flex justify-center">
            <img
              src={product.image ?? "/placeholder.svg"}
              alt={product.name}
              className="w-32 h-32 object-cover rounded bg-muted"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <div className="w-full border rounded px-2 py-1 bg-gray-50">
              {product.name}
            </div>
          </div>

          {/* SKU */}
          <div>
            <label className="text-sm font-medium">SKU</label>
            <div className="w-full border rounded px-2 py-1 bg-gray-50">
              {product.sku}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium">Price</label>
            <div className="w-full border rounded px-2 py-1 bg-gray-50">
              ${product.price}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
