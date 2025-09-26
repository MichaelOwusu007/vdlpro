"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Search, Download, Upload, Grid3X3, List, Edit, Eye, Copy, Archive, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProductModal } from "@/components/Products/ProductModal";
import { ProductDetailModal } from "@/components/Products/ProductDetailModal";
import { BulkActions } from "@/components/Products/BulkActions";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Trash } from "lucide-react";


export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  status: 'active' | 'inactive';
  attributes: Record<string, string>;
  images: string[];
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

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  brand?: string;
  stock: number;
  cost?: number;
  price: number;
  status: "active" | "inactive";
  lastUpdated: string;
  createdAt: string;
  description?: string;
  barcode?: string;
  tags: string[];
  images: string[];
  reorderPoint?: number;
  leadTime?: number;
  unitOfMeasure: string;
  variants?: ProductVariant[];
}

const mockProducts: Product[] = [
  {
    id: "PRD-001",
    name: "Premium Wireless Headphones",
    sku: "WH-PREM-001",
    category: "Electronics",
    supplier: "TechSupplier Co",
    brand: "AudioTech",
    stock: 245,
    cost: 150.0,
    price: 299.99,
    status: "active",
    lastUpdated: "2024-01-08",
    createdAt: "2023-12-01",
    description: "High-quality wireless headphones with noise cancellation and superior sound quality.",
    barcode: "1234567890123",
    tags: ["fast-moving", "premium"],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    reorderPoint: 50,
    leadTime: 14,
    unitOfMeasure: "piece",
    variants: [
      {
        id: "VAR-001",
        sku: "WH-PREM-001-BLK",
        name: "Black",
        barcode: "1234567890124",
        status: "active" as const,
        attributes: { color: "Black" },
        images: ["/placeholder.svg"],
        primaryImage: "/placeholder.svg",
        stock: { quantity: 145, reorderLevel: 25, location: "A1-B2", batchLot: "BT001" },
        pricing: { basePrice: 299.99, costPrice: 150.0 },
        logistics: { weight: 0.5, dimensions: { length: 20, width: 15, height: 8 }, packagingType: "box", hsCode: "8518300000" }
      },
      {
        id: "VAR-002",
        sku: "WH-PREM-001-WHT",
        name: "White",
        barcode: "1234567890125",
        status: "active" as const,
        attributes: { color: "White" },
        images: ["/placeholder.svg"],
        primaryImage: "/placeholder.svg",
        stock: { quantity: 100, reorderLevel: 25, location: "A1-B3", batchLot: "BT002" },
        pricing: { basePrice: 299.99, costPrice: 150.0 },
        logistics: { weight: 0.5, dimensions: { length: 20, width: 15, height: 8 }, packagingType: "box", hsCode: "8518300000" }
      }
    ]
  },
  {
    id: "PRD-002",
    name: "Ergonomic Office Chair",
    sku: "FURN-CHAIR-002",
    category: "Furniture",
    supplier: "Office Solutions Ltd",
    brand: "OfficeMax",
    stock: 89,
    cost: 225.0,
    price: 449.99,
    status: "active",
    lastUpdated: "2024-01-07",
    createdAt: "2023-11-15",
    description: "Comfortable ergonomic office chair with lumbar support and adjustable height.",
    barcode: "2345678901234",
    tags: ["bulky", "premium"],
    images: ["/placeholder.svg"],
    reorderPoint: 20,
    leadTime: 21,
    unitOfMeasure: "piece"
  },
  {
    id: "PRD-003",
    name: "Smart Water Bottle",
    sku: "SPORT-BOT-003",
    category: "Sports",
    supplier: "SportsCorp",
    brand: "HydroSmart",
    stock: 12,
    cost: 40.0,
    price: 79.99,
    status: "active",
    lastUpdated: "2024-01-08",
    createdAt: "2023-12-20",
    description: "Smart water bottle with temperature monitoring and hydration tracking.",
    barcode: "3456789012345",
    tags: ["smart", "fast-moving"],
    images: ["/placeholder.svg"],
    reorderPoint: 25,
    leadTime: 7,
    unitOfMeasure: "piece"
  },
  {
    id: "PRD-004",
    name: "Laptop Stand Aluminum",
    sku: "TECH-STAND-004",
    category: "Tech Accessories",
    supplier: "TechSupplier Co",
    brand: "DeskPro",
    stock: 0,
    cost: 45.0,
    price: 89.99,
    status: "inactive",
    lastUpdated: "2024-01-06",
    createdAt: "2023-10-10",
    description: "Adjustable aluminum laptop stand for better ergonomics and cooling.",
    barcode: "4567890123456",
    tags: ["tech", "aluminum"],
    images: ["/placeholder.svg"],
    reorderPoint: 15,
    leadTime: 10,
    unitOfMeasure: "piece"
  }
];




const categories = ["All Categories", "Electronics", "Furniture", "Sports", "Tech Accessories"];
const suppliers = ["All Suppliers", "TechSupplier Co", "Office Solutions Ltd", "SportsCorp"];

const STORAGE_KEY = "serviceconnect_products_v1";

export default function Products() {
  const { toast } = useToast();

  // initialize from localStorage if available, otherwise from mockProducts
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored) as Product[];
        }
      }
    } catch (e) {
      console.error("Failed to parse stored products:", e);
    }
    return mockProducts;
  });

  
  // ✅ FIX: move delete handler inside the component
  const handleDelete = (productToDelete: Product) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== productToDelete.id)
    );

    toast({
      title: "Product Deleted",
      description: `${productToDelete.name} was removed successfully.`,
      variant: "destructive",
    });
  };

  // persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Failed to persist products to localStorage:", e);
    }
  }, [products]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [viewingProduct, setViewingProduct] = useState<Product | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 12;

  // filter & sort
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
    const matchesSupplier = selectedSupplier === "All Suppliers" || product.supplier === selectedSupplier;
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case "sku":
        aValue = a.sku;
        bValue = b.sku;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case "stock":
        aValue = a.stock;
        bValue = b.stock;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return sortOrder === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
  });

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map(p => p.id));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
    setShowDetailModal(true);
  };

  // helper: normalize pricing from modal/productData
  const normalizePricing = (productData: any) => {
    // Priority:
    // 1. explicit top-level price/cost
    // 2. modal fields sellingPrice / costPrice
    // 3. first variant pricing if present
    let price = 0;
    let cost = 0;
    if (typeof productData.price === "number") price = productData.price;
    if (typeof productData.cost === "number") cost = productData.cost;

    if ((price === 0 || isNaN(price)) && typeof productData.sellingPrice === "number") {
      price = productData.sellingPrice;
    }
    if ((cost === 0 || isNaN(cost)) && typeof productData.costPrice === "number") {
      cost = productData.costPrice;
    }

    // If there are variants, prefer the first variant's pricing
    if ((price === 0 || isNaN(price) || cost === 0 || isNaN(cost)) && Array.isArray(productData.variants) && productData.variants.length > 0) {
      const variantPricing = productData.variants[0]?.pricing;
      if (variantPricing) {
        if ((price === 0 || isNaN(price)) && typeof variantPricing.basePrice === "number") price = variantPricing.basePrice;
        if ((cost === 0 || isNaN(cost)) && typeof variantPricing.costPrice === "number") cost = variantPricing.costPrice;
      }
    }

    // final numeric fallback
    price = Number(price || 0);
    cost = Number(cost || 0);

    return { price, cost };
  };

  const handleSaveProduct = (productData: any) => {
    // Ensure images array exists
    const images = Array.isArray(productData.images) ? productData.images : (productData.images ? [productData.images] : []);

    // normalize pricing
    const { price, cost } = normalizePricing(productData);

    // compute stock if variants present
    const stockFromVariants = Array.isArray(productData.variants)
      ? productData.variants.reduce((sum: number, v: ProductVariant) => sum + (v?.stock?.quantity ?? 0), 0)
      : undefined;

    const normalized = {
      ...productData,
      images,
      price,
      cost,
      stock: typeof stockFromVariants === "number" ? stockFromVariants : (productData.stock ?? 0),
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p =>
        p.id === editingProduct.id
          ? { 
              ...p,
              ...normalized,
              // preserve createdAt if present
              createdAt: p.createdAt ?? normalized.createdAt ?? new Date().toISOString().split('T')[0]
            }
          : p
      ));
      toast({
        title: "Product Updated",
        description: `${normalized.name} has been updated successfully.`
      });
    } else {
      // Create new product
      const newProduct: Product = {
        id: `PRD-${Date.now()}`,
        ...normalized,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: "Product Created",
        description: `${normalized.name} has been created successfully.`
      });
    }

    setShowProductModal(false);
    setEditingProduct(undefined);
  };

  const handleDuplicate = (product: Product) => {
    const duplicatedProduct: Product = {
      ...product,
      id: `PRD-${Date.now()}`,
      sku: `${product.sku}-COPY`,
      name: `${product.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setProducts(prev => [...prev, duplicatedProduct]);
    toast({
      title: "Product Duplicated",
      description: `${product.name} has been duplicated successfully.`
    });
  };

  const handleArchive = (product: Product) => {
    setProducts(prev => prev.map(p =>
      p.id === product.id
        ? { ...p, status: "inactive" as const, lastUpdated: new Date().toISOString().split('T')[0] }
        : p
    ));
    toast({
      title: "Product Archived",
      description: `${product.name} has been archived.`
    });
  };

  const handleExport = () => {
    const exportData = filteredProducts.map(product => ({
      ID: product.id,
      Name: product.name,
      SKU: product.sku,
      Category: product.category,
      Supplier: product.supplier,
      Brand: product.brand,
      Stock: product.stock,
      'Cost Price': product.cost,
      'Selling Price': product.price,
      Status: product.status,
      'Unit of Measure': product.unitOfMeasure,
      'Reorder Point': product.reorderPoint,
      'Lead Time': product.leadTime,
      Description: product.description,
      Tags: product.tags.join(', '),
      'Created At': product.createdAt,
      'Last Updated': product.lastUpdated
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `products-export-${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Export Complete",
      description: `${exportData.length} products exported successfully.`
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedProducts = (jsonData as any[]).map((row: any) => ({
          id: `PRD-${Date.now()}-${Math.random()}`,
          name: row.Name || '',
          sku: row.SKU || '',
          category: row.Category || '',
          supplier: row.Supplier || '',
          brand: row.Brand || '',
          stock: Number(row.Stock) || 0,
          cost: Number(row['Cost Price']) || 0,
          price: Number(row['Selling Price']) || 0,
          status: row.Status === 'inactive' ? 'inactive' : 'active',
          description: row.Description || '',
          barcode: row.Barcode || '',
          tags: row.Tags ? String(row.Tags).split(',').map((t: string) => t.trim()) : [],
          images: ['/placeholder.svg'],
          reorderPoint: Number(row['Reorder Point']) || 10,
          leadTime: Number(row['Lead Time']) || 7,
          unitOfMeasure: row['Unit of Measure'] || 'piece',
          createdAt: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
        })) as Product[];

        setProducts(prev => [...prev, ...importedProducts]);
        toast({
          title: "Import Complete",
          description: `${importedProducts.length} products imported successfully.`
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Please check your file format and try again.",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);

    // Reset the input
    event.target.value = '';
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-success/10 text-success"
      : "bg-muted text-muted-foreground";
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-destructive";
    if (stock < 20) return "text-warning";
    return "text-success";
  };

  // --- Add this carousel component above your Products component ---
  function ProductImageCarousel({
    images,
    alt,
    className = "",
  }: {
    images: string[];
    alt: string;
    className?: string;
  }) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-slide logic
    useEffect(() => {
      if (paused || images.length <= 1) return;
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 3500); // 3.5 seconds
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [paused, images.length]);

    // Pause/resume on hover
    const handleMouseEnter = () => setPaused(true);
    const handleMouseLeave = () => setPaused(false);

    // Manual navigation
    const goTo = (idx: number) => setCurrent(idx);
    const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
    const next = () => setCurrent((prev) => (prev + 1) % images.length);

    return (
      <div
        className={`relative w-full flex flex-col items-center group ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ minHeight: 120 }}
      >
        {/* Main image */}
        <div className="w-full h-32 sm:h-40 md:h-48 rounded-md overflow-hidden bg-muted flex items-center justify-center border border-border relative">
          <img
            src={images[current]}
            alt={alt}
            className="object-cover w-full h-full transition-all duration-500"
          />
          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white transition z-10"
                onClick={prev}
                aria-label="Previous"
                tabIndex={0}
                style={{ display: "flex" }}
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white transition z-10"
                onClick={next}
                aria-label="Next"
                tabIndex={0}
                style={{ display: "flex" }}
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}
        </div>
        {/* Dots */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full ${current === idx ? "bg-indigo-500" : "bg-gray-300"} transition`}
                onClick={() => goTo(idx)}
                aria-label={`Go to image ${idx + 1}`}
                tabIndex={0}
              />
            ))}
          </div>
        )}
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`w-12 h-12 rounded-md overflow-hidden border border-border transition ring-2 ${current === idx ? "ring-indigo-500" : "ring-transparent"}`}
                onClick={() => goTo(idx)}
                aria-label={`Show image ${idx + 1}`}
                tabIndex={0}
                style={{ background: "#fff" }}
              >
                <img src={img} alt={`${alt} ${idx}`} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
  // --- End carousel component ---

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your product catalog and inventory information
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Desktop actions */}
            <div className="hidden sm:flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export products to Excel file</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleImport}
                      className="hidden"
                      id="import-file"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="import-file" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                      </label>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Import products from Excel/CSV file</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingProduct(undefined);
                      setShowProductModal(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create a new product</TooltipContent>
              </Tooltip>
            </div>

            {/* Mobile actions */}
            <div className="flex sm:hidden gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="flex-1">
                Export
              </Button>

              <div className="flex-1">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file-mobile"
                />
                <Button variant="outline" size="sm" asChild className="w-full">
                  <label htmlFor="import-file-mobile" className="cursor-pointer">
                    Import
                  </label>
                </Button>
              </div>

              <Button
                size="sm"
                className="flex-1"
                onClick={() => {
                  setEditingProduct(undefined);
                  setShowProductModal(true);
                }}
              >
                Add Product
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products, SKU, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="flex-1 sm:flex-initial"
                  >
                    <Grid3X3 className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Grid</span>
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="flex-1 sm:flex-initial"
                  >
                    <List className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Table</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <BulkActions
            selectedCount={selectedProducts.length}
            onClearSelection={() => setSelectedProducts([])}
          />
        )}

        {/* Products Display */}
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => {
                // determine images to show
                const images = Array.isArray(product.images) && product.images.length > 0
                  ? product.images
                  : (product.variants && product.variants.length > 0
                    ? product.variants.flatMap(v => v.images || [])
                    : ["/placeholder.svg"]);

                const primary = images[0];

                return (
                  <Card key={product.id} className="hover:shadow-md transition-all group">
                    <CardHeader className="pb-3">
                             {/* Desktop: Icon buttons with tooltips */}
                             <div className="flex gap-6 items-center justify-between " >
                        <div className="hidden sm:flex gap-1 ">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => handleView(product)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View product details</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit product</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => handleDuplicate(product)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Duplicate product</TooltipContent>
                          </Tooltip>
<Tooltip>
  <TooltipTrigger asChild>
    <Button
      size="sm"
      variant="ghost"
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
      onClick={() => handleDelete(product)}
    >
      <Trash className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Delete product</TooltipContent>
</Tooltip>


                        </div>
                          <div className="mt-2 flex items-center pb-3 gap-2">
                          <Badge className={getStatusColor(product.status)} variant="outline">
                            {product.status}
                          </Badge>
                          {/* show price next to badge */}
                         
                        </div>
                        </div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => handleSelectProduct(product.id)}
                          />

                          
                          {/* --- Replace image block with carousel --- */}
                          <div className="w-24 h-24 sm:w-60 sm:h-32 rounded-md overflow-hidden bg-muted flex items-center justify-center border border-border">
                            <ProductImageCarousel images={images} alt={product.name} />
                          </div>
                          
                        </div>

                        {/* Mobile: Dropdown menu */}
                        <div className="sm:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(product)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(product)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleArchive(product)}>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="ml-2">
                        <div className="space-y-1">
                          <CardTitle className="text-base leading-5">{product.name}</CardTitle>
                          <CardDescription className="text-sm">{product.sku}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium">{product.category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Supplier:</span>
                          <span className="font-medium">{product.supplier}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Stock:</span>
                          <span className={`font-medium ${getStockColor(product.stock)}`}>
                            {product.stock} {product.unitOfMeasure}
                          </span>
                        </div>

                        {/* Price displayed again in content */}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium text-lg">GH{product.price?.toFixed ? product.price.toFixed(2) : product.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4" >
                           <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Updated {product.lastUpdated}
                        </p>
                      </div> 
                     
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => { setSortBy("sku"); setSortOrder(prev => prev === "asc" ? "desc" : "asc"); }}>
                        SKU {sortBy === "sku" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => { setSortBy("name"); setSortOrder(prev => prev === "asc" ? "desc" : "asc"); }}>
                        Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => { setSortBy("stock"); setSortOrder(prev => prev === "asc" ? "desc" : "asc"); }}>
                        Stock {sortBy === "stock" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => {
                      const images = Array.isArray(product.images) && product.images.length > 0
                        ? product.images
                        : (product.variants && product.variants.length > 0
                          ? product.variants.flatMap(v => v.images || [])
                          : ["/placeholder.svg"]);
                      const primary = images[0];

                      return (
                        <TableRow key={product.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => handleSelectProduct(product.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-12 rounded-md overflow-hidden border border-border">
                                <img src={primary} alt={product.name} className="object-cover w-full h-full" />
                              </div>
                              {/* show small thumbnails if more images exist */}
                              {images.length > 1 && (
                                <div className="flex gap-1">
                                  {images.slice(1, 4).map((img, i) => (
                                    <div key={i} className="w-6 h-6 rounded-sm overflow-hidden border border-border">
                                      <img src={img} className="object-cover w-full h-full" alt={`${product.name}-${i}`} />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.supplier}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(product.status)} variant="outline">
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className={getStockColor(product.stock)}>
                            {product.stock} {product.unitOfMeasure}
                          </TableCell>
                          <TableCell className="font-medium">GH{product.price?.toFixed ? product.price.toFixed(2) : product.price}</TableCell>
                          <TableCell>{product.lastUpdated}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleView(product)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Modals */}
        <ProductModal
          isOpen={showProductModal}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(undefined);
          }}
          product={editingProduct}
          onSave={handleSaveProduct}
        />

        <ProductDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setViewingProduct(undefined);
          }}
          product={viewingProduct}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
          onExport={handleExport}
        />
      </div>
    </TooltipProvider>
  );
}
