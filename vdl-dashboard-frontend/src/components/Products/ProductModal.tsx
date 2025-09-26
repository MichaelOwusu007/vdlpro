"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Upload,
  X,
  Plus,
  Minus,
  Package,
  DollarSign,
  Settings,
  Tag,
  Palette,
  Move,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HexColorPicker } from "react-colorful";

/**
 * Full combined ProductModal.tsx
 * - Combines earlier provided code sections into one complete, working modal
 * - Uses localStorage for demo persistence
 * - Converts uploaded Files to data-URLs so images persist in localStorage
 *
 * Keep the design/structure you provided. This file intentionally mirrors your UI.
 */

/* ---------------- Types ---------------- */

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  status: "active" | "inactive";
  attributes: Record<string, string>;
  images: string[]; // data URL strings
  primaryImage?: string;
  stock: {
    quantity: number;
    reorderLevel: number;
    location?: string;
    batchLot?: string;
  };
  pricing: {
    basePrice: number;
    salePrice?: number;
    costPrice: number;
  };
  logistics: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    packagingType?: string;
    hsCode?: string;
  };
}

interface AttributeOption {
  id: string;
  name: string;
  type: "color" | "text" | "number" | "select";
  options?: string[];
  required?: boolean;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any; // incoming product for edit (flexible shape)
  onSave: (productData: any) => void;
}

/* ---------------- Helpers ---------------- */

const DRAFT_KEY = "product_modal_draft_v1";
const PRODUCTS_KEY = "serviceconnect_products_v1";

/** convert File -> data URL for serialization to localStorage */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

function genId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/* ---------------- Component ---------------- */

export function ProductModal({ isOpen, onClose, product, onSave }: ProductModalProps) {
  const { toast } = useToast();

  // top-level formData
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    supplier: "",
    brand: "",
    barcode: "",
    costPrice: 0,
    sellingPrice: 0,
    unitOfMeasure: "piece",
    reorderPoint: 10,
    leadTime: 7,
    status: "active" as "active" | "inactive",
    tags: [] as string[],
    images: [] as string[], // data URLs
  });

  // variants state
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Attributes UI
  const [customAttributes, setCustomAttributes] = useState<AttributeOption[]>([
    { id: "1", name: "Color", type: "color", required: true },
    { id: "2", name: "Size", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL"], required: true },
    { id: "3", name: "Material", type: "select", options: ["Cotton", "Polyester", "Leather", "Wool"] },
    { id: "4", name: "Style", type: "select", options: ["Plain", "Striped", "Graphic", "Pattern"] },
  ]);
  const [newAttribute, setNewAttribute] = useState<{ name: string; type: AttributeOption["type"]; options: string[] }>({
    name: "",
    type: "text",
    options: [],
  });
  const [newTag, setNewTag] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ff0000");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const categoryOptions = ["Electronics", "Clothing", "Food & Beverage", "Industrial", "Medical", "Automotive"];
  const supplierOptions = ["Acme Corp", "Global Supplies", "TechDistrib", "MegaWholesale"];
  const unitOptions = ["piece", "box", "kg", "liter", "meter", "pack"];
  const predefinedColors = [
    { name: "Red", hex: "#ff0000" },
    { name: "Blue", hex: "#0000ff" },
    { name: "Green", hex: "#00ff00" },
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#ffffff" },
    { name: "Gray", hex: "#808080" },
    { name: "Yellow", hex: "#ffff00" },
    { name: "Orange", hex: "#ffa500" },
  ];

  /* ---------------- Load / Draft handling ---------------- */

  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      // map incoming product into formData and variants
      setFormData({
        name: product.name ?? "",
        sku: product.sku ?? "",
        description: product.description ?? "",
        category: product.category ?? "",
        supplier: product.supplier ?? "",
        brand: product.brand ?? "",
        barcode: product.barcode ?? "",
        costPrice: typeof product.cost === "number" ? product.cost : product.costPrice ?? 0,
        sellingPrice: typeof product.price === "number" ? product.price : product.sellingPrice ?? 0,
        unitOfMeasure: product.unitOfMeasure ?? "piece",
        reorderPoint: product.reorderPoint ?? 10,
        leadTime: product.leadTime ?? 7,
        status: product.status ?? "active",
        tags: product.tags ?? [],
        images: Array.isArray(product.images) ? product.images : [],
      });

      setVariants((product.variants ?? []).map((v: any) => normalizeVariant(v)));
      return;
    }

    // no product => restore draft if available
    try {
      const draftRaw = localStorage.getItem(DRAFT_KEY);
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        setFormData({
          name: draft.name ?? "",
          sku: draft.sku ?? "",
          description: draft.description ?? "",
          category: draft.category ?? "",
          supplier: draft.supplier ?? "",
          brand: draft.brand ?? "",
          barcode: draft.barcode ?? "",
          costPrice: draft.costPrice ?? 0,
          sellingPrice: draft.sellingPrice ?? 0,
          unitOfMeasure: draft.unitOfMeasure ?? "piece",
          reorderPoint: draft.reorderPoint ?? 10,
          leadTime: draft.leadTime ?? 7,
          status: draft.status ?? "active",
          tags: draft.tags ?? [],
          images: Array.isArray(draft.images) ? draft.images : [],
        });
        setVariants((draft.variants ?? []).map((v: any) => normalizeVariant(v)));
        return;
      }
    } catch (e) {
      // parsing error - ignore and use defaults
    }

    // defaults
    setFormData({
      name: "",
      sku: "",
      description: "",
      category: "",
      supplier: "",
      brand: "",
      barcode: "",
      costPrice: 0,
      sellingPrice: 0,
      unitOfMeasure: "piece",
      reorderPoint: 10,
      leadTime: 7,
      status: "active",
      tags: [],
      images: [],
    });
    setVariants([]);
  }, [isOpen, product]);

  /* persist draft to localStorage while modal is open */
  useEffect(() => {
    if (!isOpen) return;
    const draft = {
      ...formData,
      variants,
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
      // ignore
    }
  }, [isOpen, formData, variants]);

  /* ---------------- Normalization ---------------- */

  function normalizeVariant(v: any): ProductVariant {
    return {
      id: v.id ?? genId("var"),
      name: v.name ?? v.sku ?? "Variant",
      sku: v.sku ?? `VAR-${Math.floor(Math.random() * 100000)}`,
      barcode: v.barcode ?? "",
      status: v.status ?? "active",
      attributes: v.attributes ?? {},
      images: Array.isArray(v.images) ? v.images : [],
      primaryImage: v.primaryImage ?? (Array.isArray(v.images) && v.images.length ? v.images[0] : undefined),
      stock: {
        quantity: v.stock?.quantity ?? 0,
        reorderLevel: v.stock?.reorderLevel ?? 10,
        location: v.stock?.location ?? "",
        batchLot: v.stock?.batchLot ?? "",
      },
      pricing: {
        basePrice: v.pricing?.basePrice ?? v.basePrice ?? 0,
        salePrice: v.pricing?.salePrice ?? v.salePrice,
        costPrice: v.pricing?.costPrice ?? v.costPrice ?? 0,
      },
      logistics: {
        weight: v.logistics?.weight ?? 0,
        dimensions: v.logistics?.dimensions ?? { length: 0, width: 0, height: 0 },
        packagingType: v.logistics?.packagingType ?? "",
        hsCode: v.logistics?.hsCode ?? "",
      },
    };
  }

  /* ---------------- Form helpers ---------------- */

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    const t = newTag.trim();
    if (!t) return;
    if (!formData.tags.includes(t)) {
      handleInputChange("tags", [...formData.tags, t]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange("tags", formData.tags.filter((t) => t !== tagToRemove));
  };

  /* ---------------- Product-level image handling ---------------- */

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    try {
      const promises = Array.from(files).map((f) => fileToDataUrl(f));
      const urls = await Promise.all(promises);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (e) {
      toast({
        title: "Image upload error",
        description: "Could not read one or more files.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((i) => i !== imageUrl) }));
  };

  /* ---------------- Variant management ---------------- */

  const handleAddVariant = () => {
    const newVar: ProductVariant = {
      id: genId("var"),
      name: `${formData.name || "Product"} - Variant ${variants.length + 1}`,
      sku: `${(formData.sku || "SKU").toString().slice(0, 10)}-V${variants.length + 1}`,
      barcode: "",
      status: "active",
      attributes: {},
      images: [],
      primaryImage: undefined,
      stock: {
        quantity: 0,
        reorderLevel: 10,
        location: "",
        batchLot: "",
      },
      pricing: {
        basePrice: formData.sellingPrice ?? 0,
        costPrice: formData.costPrice ?? 0,
      },
      logistics: {
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        packagingType: "",
        hsCode: "",
      },
    };
    setVariants((prev) => [...prev, newVar]);
  };

  const handleRemoveVariant = (variantId: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  const handleVariantChange = (variantId: string, field: string, value: any) => {
    setVariants((prev) => prev.map((v) => (v.id === variantId ? { ...v, [field]: value } : v)));
  };

  const handleVariantAttributeChange = (variantId: string, attributeName: string, value: string) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              attributes: { ...variant.attributes, [attributeName]: value },
              name: generateVariantName(formData.name, { ...variant.attributes, [attributeName]: value }),
            }
          : variant
      )
    );
  };

  function generateVariantName(baseName: string, attributes: Record<string, string>) {
    const vals = Object.values(attributes).filter(Boolean);
    return vals.length ? `${baseName} - ${vals.join(", ")}` : baseName || "Variant";
  }

  /* ---------------- Variant images ---------------- */

  const handleVariantImageUpload = async (variantId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    try {
      const promises = Array.from(files).map((f) => fileToDataUrl(f));
      const urls = await Promise.all(promises);
      setVariants((prev) =>
        prev.map((variant) =>
          variant.id === variantId ? { ...variant, images: [...variant.images, ...urls], primaryImage: variant.primaryImage ?? urls[0] } : variant
        )
      );
    } catch (e) {
      toast({
        title: "Image upload error",
        description: "Could not read one or more variant files.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveVariantImage = (variantId: string, imageUrl: string) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              images: variant.images.filter((i) => i !== imageUrl),
              primaryImage: variant.primaryImage === imageUrl ? variant.images.find((i) => i !== imageUrl) : variant.primaryImage,
            }
          : variant
      )
    );
  };

  const handleSetPrimaryImage = (variantId: string, imageUrl: string) => {
    setVariants((prev) => prev.map((variant) => (variant.id === variantId ? { ...variant, primaryImage: imageUrl } : variant)));
  };

  /* ---------------- Custom attributes ---------------- */

  const handleAddCustomAttribute = () => {
    const name = newAttribute.name.trim();
    if (!name) return;
    const attr: AttributeOption = {
      id: genId("attr"),
      name,
      type: newAttribute.type,
      options: newAttribute.type === "select" ? newAttribute.options : undefined,
    };
    setCustomAttributes((prev) => [...prev, attr]);
    setNewAttribute({ name: "", type: "text", options: [] });
  };

  const handleRemoveAttribute = (attributeId: string) => {
    setCustomAttributes((prev) => prev.filter((a) => a.id !== attributeId));
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  /* ---------------- Derive top-level pricing & stock ---------------- */

  function deriveTopLevelPricing() {
    let price = Number(formData.sellingPrice || 0);
    let cost = Number(formData.costPrice || 0);
    if ((price === 0 || isNaN(price) || cost === 0 || isNaN(cost)) && variants.length > 0) {
      const first = variants[0].pricing;
      if (first) {
        if ((price === 0 || isNaN(price)) && typeof first.basePrice === "number") price = first.basePrice;
        if ((cost === 0 || isNaN(cost)) && typeof first.costPrice === "number") cost = first.costPrice;
      }
    }
    return { price, cost };
  }

  /* ---------------- Save product (localStorage demo) ---------------- */

  const handleSave = () => {
    if (!formData.name.trim() || !formData.sku.trim() || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, SKU, Category).",
        variant: "destructive",
      });
      return;
    }

    if (formData.images.length === 0 && variants.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload at least one product image or variant image.",
        variant: "destructive",
      });
      return;
    }

    const { price, cost } = deriveTopLevelPricing();
    const totalStock = variants.length > 0 ? variants.reduce((s, v) => s + (v.stock?.quantity ?? 0), 0) : 0;

    const productData = {
      id: product?.id ?? `PRD-${Date.now()}`,
      name: formData.name,
      sku: formData.sku,
      description: formData.description,
      category: formData.category,
      supplier: formData.supplier,
      brand: formData.brand,
      barcode: formData.barcode,
      cost: cost,
      price: price,
      unitOfMeasure: formData.unitOfMeasure,
      reorderPoint: formData.reorderPoint,
      leadTime: formData.leadTime,
      status: formData.status,
      tags: formData.tags,
      images: formData.images,
      variants,
      stock: totalStock,
      createdAt: product?.createdAt ?? new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    // Save to localStorage (demo)
    try {
      const existingRaw = localStorage.getItem(PRODUCTS_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      let updated;
      if (product) {
        updated = existing.map((p: any) => (p.id === product.id ? productData : p));
      } else {
        updated = [...existing, productData];
      }
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    // clear draft
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {}

    onSave(productData);
    onClose();

    // reset local state for next open (safe defaults)
    setFormData({
      name: "",
      sku: "",
      description: "",
      category: "",
      supplier: "",
      brand: "",
      barcode: "",
      costPrice: 0,
      sellingPrice: 0,
      unitOfMeasure: "piece",
      reorderPoint: 10,
      leadTime: 7,
      status: "active",
      tags: [],
      images: [],
    });
    setVariants([]);
  };

  /* ---------------- Render UI ---------------- */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">
              <Package className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="variants">
              <Tag className="h-4 w-4 mr-2" />
              Variants
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* ---------------- DETAILS ---------------- */}
          <TabsContent value="details" className="space-y-6">
            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="product-image-upload" />
                  <label htmlFor="product-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload product images</p>
                  </label>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-6 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img src={image} alt={`Product ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                          <Button size="sm" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-0" onClick={() => handleRemoveImage(image)}>
                            <X className="h-3 w-3" />
                          </Button>
                          {index === 0 && <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs">Primary</Badge>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Enter product name" />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input id="sku" value={formData.sku} onChange={(e) => handleInputChange("sku", e.target.value)} placeholder="Enter unique SKU" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select value={formData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {supplierOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" value={formData.brand} onChange={(e) => handleInputChange("brand", e.target.value)} placeholder="Enter brand" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input id="barcode" value={formData.barcode} onChange={(e) => handleInputChange("barcode", e.target.value)} placeholder="EAN/UPC/QR Code" />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Enter product description" rows={4} />
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag" onKeyDown={(e) => e.key === "Enter" && handleAddTag()} />
                    <Button type="button" onClick={handleAddTag}>Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- PRICING ---------------- */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="costPrice">Cost Price *</Label>
                    <Input id="costPrice" type="number" step="0.01" value={formData.costPrice} onChange={(e) => handleInputChange("costPrice", parseFloat(e.target.value) || 0)} placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="sellingPrice">Selling Price *</Label>
                    <Input id="sellingPrice" type="number" step="0.01" value={formData.sellingPrice} onChange={(e) => handleInputChange("sellingPrice", parseFloat(e.target.value) || 0)} placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
                    <Select value={formData.unitOfMeasure} onValueChange={(value) => handleInputChange("unitOfMeasure", value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{unitOptions.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <Card>
                  <CardHeader><CardTitle className="text-base">Profit Analysis</CardTitle></CardHeader>
                  <CardContent>
                    {formData.costPrice && formData.sellingPrice ? (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div><p className="text-muted-foreground">Profit Margin</p><p className="text-lg font-semibold">${(formData.sellingPrice - formData.costPrice).toFixed(2)}</p></div>
                        <div><p className="text-muted-foreground">Margin %</p><p className="text-lg font-semibold">{(((formData.sellingPrice - formData.costPrice) / formData.sellingPrice) * 100).toFixed(1)}%</p></div>
                        <div><p className="text-muted-foreground">Markup %</p><p className="text-lg font-semibold">{formData.costPrice ? (((formData.sellingPrice - formData.costPrice) / formData.costPrice) * 100).toFixed(1) : "0"}%</p></div>
                      </div>
                    ) : <p className="text-muted-foreground">Enter cost and selling price to see profit analysis</p>}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- VARIANTS ---------------- */}
          <TabsContent value="variants" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Product Variants</h3>
              <div className="flex gap-2">
                <Button onClick={handleAddVariant} size="sm"><Plus className="h-4 w-4 mr-2" />Add Variant</Button>
              </div>
            </div>

            {/* Custom Attributes Management */}
            <Card>
              <CardHeader><CardTitle className="text-base">Variant Attributes</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {customAttributes.map((attr) => (
                    <Badge key={attr.id} variant="secondary" className="flex items-center gap-1">
                      {attr.name} ({attr.type})
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveAttribute(attr.id)} />
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input placeholder="Attribute name" value={newAttribute.name} onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })} className="flex-1" />
                  <Select value={newAttribute.type} onValueChange={(value: any) => setNewAttribute({ ...newAttribute, type: value })}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddCustomAttribute} size="sm"><Plus className="h-4 w-4" /></Button>
                </div>

                {newAttribute.type === "select" && (
                  <div>
                    <Label>Options (comma separated)</Label>
                    <Input placeholder="Option 1, Option 2, Option 3" onChange={(e) => setNewAttribute({ ...newAttribute, options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
                  </div>
                )}
              </CardContent>
            </Card>

            {variants.length === 0 ? (
              <Card><CardContent className="flex flex-col items-center justify-center py-12"><Package className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-muted-foreground">No variants created yet</p><p className="text-sm text-muted-foreground">Add variants to manage different sizes, colors, or styles</p></CardContent></Card>
            ) : (
              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <Card key={variant.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div><CardTitle className="text-base">{variant.name}</CardTitle><p className="text-sm text-muted-foreground">SKU: {variant.sku}</p></div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveVariant(variant.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="basic">Basic</TabsTrigger>
                          <TabsTrigger value="attributes">Attributes</TabsTrigger>
                          <TabsTrigger value="inventory">Inventory</TabsTrigger>
                          <TabsTrigger value="logistics">Logistics</TabsTrigger>
                        </TabsList>

                        {/* Basic */}
                        <TabsContent value="basic" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`variant-name-${variant.id}`}>Variant Name</Label>
                              <Input id={`variant-name-${variant.id}`} value={variant.name} onChange={(e) => handleVariantChange(variant.id, "name", e.target.value)} />
                            </div>
                            <div>
                              <Label htmlFor={`variant-sku-${variant.id}`}>SKU</Label>
                              <Input id={`variant-sku-${variant.id}`} value={variant.sku} onChange={(e) => handleVariantChange(variant.id, "sku", e.target.value)} />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`variant-barcode-${variant.id}`}>Barcode</Label>
                            <Input id={`variant-barcode-${variant.id}`} value={variant.barcode ?? ""} onChange={(e) => handleVariantChange(variant.id, "barcode", e.target.value)} placeholder="EAN/UPC/QR Code" />
                          </div>

                          {/* Variant Images */}
                          <div>
                            <Label>Variant Images</Label>
                            <div className="mt-2">
                              <input type="file" multiple accept="image/*" onChange={(e) => handleVariantImageUpload(variant.id, e)} className="hidden" id={`variant-image-upload-${variant.id}`} />
                              <label htmlFor={`variant-image-upload-${variant.id}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">Click to upload variant images</p>
                              </label>
                            </div>

                            {variant.images.length > 0 && (
                              <div className="grid grid-cols-4 gap-2 mt-4">
                                {variant.images.map((image, imgIndex) => (
                                  <div key={imgIndex} className="relative group">
                                    <img src={image} alt={`Variant ${index + 1} - Image ${imgIndex + 1}`} className={`w-full h-20 object-cover rounded-lg ${variant.primaryImage === image ? "ring-2 ring-primary" : ""}`} />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center gap-1">
                                      <Button size="sm" variant="secondary" onClick={() => handleSetPrimaryImage(variant.id, image)} className="h-6 px-2 text-xs">Primary</Button>
                                      <Button size="sm" variant="destructive" onClick={() => handleRemoveVariantImage(variant.id, image)} className="h-6 w-6 p-0"><X className="h-3 w-3" /></Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        {/* Attributes */}
                        <TabsContent value="attributes" className="space-y-4">
                          {customAttributes.map((attr) => (
                            <div key={attr.id}>
                              <Label>{attr.name} {attr.required && '*'}</Label>
                              {attr.type === 'color' ? (
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    {predefinedColors.map((color) => (
                                      <button
                                        key={color.hex}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 ${variant.attributes[attr.name] === color.hex ? 'border-primary ring-2 ring-primary/20' : 'border-muted-foreground/20'}`}
                                        style={{ backgroundColor: color.hex }}
                                        onClick={() => handleVariantAttributeChange(variant.id, attr.name, color.hex)}
                                        title={color.name}
                                      />
                                    ))}
                                    <Button type="button" variant="outline" size="sm" className="w-8 h-8 p-0" onClick={() => setShowColorPicker(!showColorPicker)}><Palette className="h-4 w-4" /></Button>
                                  </div>

                                  {showColorPicker && (
                                    <div className="relative">
                                      <div className="absolute z-10 bg-background border rounded-lg p-4 shadow-lg">
                                        <HexColorPicker
                                          color={selectedColor}
                                          onChange={(color) => {
                                            setSelectedColor(color);
                                            handleVariantAttributeChange(variant.id, attr.name, color);
                                          }}
                                        />
                                        <Button className="mt-2 w-full" size="sm" onClick={() => setShowColorPicker(false)}>Done</Button>
                                      </div>
                                    </div>
                                  )}

                                  <Input value={variant.attributes[attr.name] || ''} onChange={(e) => handleVariantAttributeChange(variant.id, attr.name, e.target.value)} placeholder="Hex color code" />
                                </div>
                              ) : attr.type === 'select' && attr.options ? (
                                <Select value={variant.attributes[attr.name] || ''} onValueChange={(value) => handleVariantAttributeChange(variant.id, attr.name, value)}>
                                  <SelectTrigger><SelectValue placeholder={`Select ${attr.name}`} /></SelectTrigger>
                                  <SelectContent>
                                    {attr.options.map((option: string) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input type={attr.type === 'number' ? 'number' : 'text'} value={variant.attributes[attr.name] || ''} onChange={(e) => handleVariantAttributeChange(variant.id, attr.name, e.target.value)} placeholder={`Enter ${attr.name}`} />
                              )}
                            </div>
                          ))}
                        </TabsContent>

                        {/* Inventory */}
                        <TabsContent value="inventory" className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div><Label htmlFor={`variant-base-price-${variant.id}`}>Base Price</Label><Input id={`variant-base-price-${variant.id}`} type="number" step="0.01" value={variant.pricing.basePrice} onChange={(e) => handleVariantChange(variant.id, 'pricing', { ...variant.pricing, basePrice: parseFloat(e.target.value) || 0 })} /></div>
                            <div><Label htmlFor={`variant-sale-price-${variant.id}`}>Sale Price</Label><Input id={`variant-sale-price-${variant.id}`} type="number" step="0.01" value={variant.pricing.salePrice || ''} onChange={(e) => handleVariantChange(variant.id, 'pricing', { ...variant.pricing, salePrice: parseFloat(e.target.value) || undefined })} /></div>
                            <div><Label htmlFor={`variant-cost-price-${variant.id}`}>Cost Price</Label><Input id={`variant-cost-price-${variant.id}`} type="number" step="0.01" value={variant.pricing.costPrice} onChange={(e) => handleVariantChange(variant.id, 'pricing', { ...variant.pricing, costPrice: parseFloat(e.target.value) || 0 })} /></div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div><Label htmlFor={`variant-quantity-${variant.id}`}>Stock Quantity</Label><Input id={`variant-quantity-${variant.id}`} type="number" value={variant.stock.quantity} onChange={(e) => handleVariantChange(variant.id, 'stock', { ...variant.stock, quantity: parseInt(e.target.value) || 0 })} /></div>
                            <div><Label htmlFor={`variant-reorder-${variant.id}`}>Reorder Level</Label><Input id={`variant-reorder-${variant.id}`} type="number" value={variant.stock.reorderLevel} onChange={(e) => handleVariantChange(variant.id, 'stock', { ...variant.stock, reorderLevel: parseInt(e.target.value) || 0 })} /></div>
                            <div><Label htmlFor={`variant-location-${variant.id}`}>Location</Label><Input id={`variant-location-${variant.id}`} value={variant.stock.location || ''} onChange={(e) => handleVariantChange(variant.id, 'stock', { ...variant.stock, location: e.target.value })} placeholder="Rack A3, Bin 5" /></div>
                          </div>

                          <div className="mt-4"><Label htmlFor={`variant-batch-${variant.id}`}>Batch/Lot Number</Label><Input id={`variant-batch-${variant.id}`} value={variant.stock.batchLot || ''} onChange={(e) => handleVariantChange(variant.id, 'stock', { ...variant.stock, batchLot: e.target.value })} placeholder="LOT-2024-001" /></div>
                        </TabsContent>

                        {/* Logistics */}
                        <TabsContent value="logistics" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor={`variant-weight-${variant.id}`}>Weight (kg)</Label><Input id={`variant-weight-${variant.id}`} type="number" step="0.01" value={variant.logistics.weight || ''} onChange={(e) => handleVariantChange(variant.id, 'logistics', { ...variant.logistics, weight: parseFloat(e.target.value) || undefined })} /></div>

                            <div>
                              <Label htmlFor={`variant-packaging-${variant.id}`}>Packaging Type</Label>
                              <Select value={variant.logistics.packagingType || ''} onValueChange={(value) => handleVariantChange(variant.id, 'logistics', { ...variant.logistics, packagingType: value })}>
                                <SelectTrigger><SelectValue placeholder="Select packaging" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="box">Box</SelectItem>
                                  <SelectItem value="bag">Bag</SelectItem>
                                  <SelectItem value="roll">Roll</SelectItem>
                                  <SelectItem value="envelope">Envelope</SelectItem>
                                  <SelectItem value="tube">Tube</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label>Dimensions (cm)</Label>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              <Input type="number" step="0.1" placeholder="Length" value={variant.logistics.dimensions?.length || ''} onChange={(e) => handleVariantChange(variant.id, 'logistics', { ...variant.logistics, dimensions: { ...variant.logistics.dimensions, length: parseFloat(e.target.value) || 0 } })} />
                              <Input type="number" step="0.1" placeholder="Width" value={variant.logistics.dimensions?.width || ''} onChange={(e) => handleVariantChange(variant.id, 'logistics', { ...variant.logistics, dimensions: { ...variant.logistics.dimensions, width: parseFloat(e.target.value) || 0 } })} />
                              <Input type="number" step="0.1" placeholder="Height" value={variant.logistics.dimensions?.height || ''} onChange={(e) => handleVariantChange(variant.id, 'logistics', { ...variant.logistics, dimensions: { ...variant.logistics.dimensions, height: parseFloat(e.target.value) || 0 } })} />
                            </div>
                          </div>

                          <div className="mt-4"><Label htmlFor={`variant-hs-code-${variant.id}`}>HS Code</Label><Input id={`variant-hs-code-${variant.id}`} value={variant.logistics.hsCode || ''} onChange={(e) => handleVariantChange(variant.id, 'logistics', { ...variant.logistics, hsCode: e.target.value })} placeholder="e.g., 6109.10.00" /></div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---------------- SETTINGS ---------------- */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Inventory Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label htmlFor="reorderPoint">Reorder Point</Label><Input id="reorderPoint" type="number" value={formData.reorderPoint} onChange={(e) => handleInputChange('reorderPoint', parseInt(e.target.value) || 0)} placeholder="Enter reorder point" /></div>
                  <div><Label htmlFor="leadTime">Lead Time (days)</Label><Input id="leadTime" type="number" value={formData.leadTime} onChange={(e) => handleInputChange('leadTime', parseInt(e.target.value) || 0)} placeholder="Enter lead time in days" /></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Product Status</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch id="status" checked={formData.status === 'active'} onCheckedChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')} />
                  <Label htmlFor="status">Product is active</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{product ? 'Update Product' : 'Create Product'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
