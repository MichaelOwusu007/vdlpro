import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Edit, Copy, Archive, Package, DollarSign, Truck, Clock, Download, ToggleLeft, ToggleRight, MapPin, Calendar, Weight, Ruler, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Product } from "@/pages/Products";
import { useState, useEffect, useRef } from "react";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onEdit?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  onArchive?: (product: Product) => void;
  onExport?: () => void;
}

function ProductImageCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
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
      className="relative w-full flex flex-col items-center group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ minHeight: 120 }}
    >
      {/* Main image with zoom on hover */}
      <div className="w-full h-40 sm:h-48 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border relative">
        <img
          src={images[current]}
          alt={alt}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          style={{ cursor: "zoom-in" }}
        />
        {/* Zoom icon */}
        <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1 shadow">
          <Search className="h-5 w-5 text-gray-700" />
        </div>
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

export function ProductDetailModal({ isOpen, onClose, product, onEdit, onDuplicate, onArchive, onExport }: ProductDetailModalProps) {
  if (!product) return null;

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

  const activityLog = [
    { date: "2024-01-08", action: "Stock updated", details: "Stock increased by 50 units", user: "John Doe" },
    { date: "2024-01-07", action: "Price updated", details: "Price changed from $279.99 to $299.99", user: "Jane Smith" },
    { date: "2024-01-05", action: "Product created", details: "Product added to catalog", user: "Admin" },
  ];

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <DialogTitle className="text-xl sm:text-2xl">{product.name}</DialogTitle>
              
              {/* Desktop: Icon + text buttons */}
              <div className="hidden sm:flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={onExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export this product to CSV</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => onEdit?.(product)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit product details</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => onDuplicate?.(product)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Create a copy of this product</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => onArchive?.(product)}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Archive this product</TooltipContent>
                </Tooltip>
              </div>

              {/* Mobile: Text buttons */}
              <div className="flex sm:hidden gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={onExport} className="flex-1">
                  Export
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit?.(product)} className="flex-1">
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDuplicate?.(product)} className="flex-1">
                  Duplicate
                </Button>
                <Button size="sm" variant="outline" onClick={() => onArchive?.(product)} className="flex-1">
                  Archive
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Images and Basic Info */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* --- Replace Avatar image gallery with carousel --- */}
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <ProductImageCarousel
                    images={product.images && product.images.length > 0 ? product.images : ["/placeholder.svg"]}
                    alt={product.name}
                  />
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary" />
                    <div className="text-xl sm:text-2xl font-bold">{product.stock}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Units in Stock</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary" />
                    <div className="text-xl sm:text-2xl font-bold">GH{product.price}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Selling Price</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">SKU</div>
                      <div className="font-mono text-sm break-all">{product.sku}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Status</div>
                      <Badge className={getStatusColor(product.status)} variant="outline">
                        {product.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Category</div>
                      <div className="text-sm">{product.category}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Brand</div>
                      <div className="text-sm">{product.brand}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Supplier</div>
                      <div className="text-sm">{product.supplier}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Barcode</div>
                      <div className="font-mono text-sm break-all">{product.barcode}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Description</div>
                    <div className="text-sm">{product.description}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Inventory */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost Price:</span>
                      <span className="font-medium">${product.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Selling Price:</span>
                      <span className="font-medium">${product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Margin:</span>
                      <span className="font-medium text-success">
                        ${(product.price - product.cost).toFixed(2)} 
                        ({(((product.price - product.cost) / product.price) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unit:</span>
                      <span className="font-medium">{product.unitOfMeasure}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Inventory Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Stock:</span>
                      <span className={`font-medium ${getStockColor(product.stock)}`}>
                        {product.stock} {product.unitOfMeasure}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reorder Point:</span>
                      <span className="font-medium">{product.reorderPoint} {product.unitOfMeasure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lead Time:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {product.leadTime} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Value:</span>
                      <span className="font-medium">
                        ${(product.stock * product.cost).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Product Variants ({product.variants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {product.variants.map(variant => {
                        const variantData = variant as any; // Type assertion for extended variant data
                        return (
                          <Card key={variant.id} className="p-4">
                            <div className="flex items-start gap-4">
                              {/* Variant Images */}
                              <div className="flex-shrink-0">
                               <Avatar className="h-24 w-24 rounded-md">
  {variantData.images && variantData.images.length > 0 ? (
    <AvatarImage
      src={variantData.images[0]} // show the first uploaded variant image
      alt={variant.name}
      className="object-cover rounded-md"
    />
  ) : (
    <AvatarFallback className="rounded-md">
      {variant.name.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  )}
</Avatar>

                                {variantData.images && variantData.images.length > 1 && (
                                  <div className="flex gap-1 mt-2">
                                    {variantData.images.slice(1, 4).map((img: string, idx: number) => (
                                      <Avatar key={idx} className="h-12 w-12">
                                        <AvatarImage src={img} alt={`Variant ${idx + 2}`} />
                                        <AvatarFallback>+</AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {variantData.images.length > 4 && (
                                      <div className="h-6 w-6 rounded bg-muted flex items-center justify-center text-xs">
                                        +{variantData.images.length - 4}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Variant Details */}
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium text-lg">{variant.name}</h4>
                                    <p className="text-sm text-muted-foreground font-mono">{variant.sku}</p>
                                    {variantData.barcode && (
                                      <p className="text-xs text-muted-foreground">Barcode: {variantData.barcode}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1">
                                          {variantData.status === 'active' ? (
                                            <ToggleRight className="h-5 w-5 text-success" />
                                          ) : (
                                            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                                          )}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Variant status: {variantData.status || 'active'}
                                      </TooltipContent>
                                    </Tooltip>
                                    <Badge variant={variantData.status === 'active' ? 'default' : 'secondary'}>
                                      {variantData.status || 'active'}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Attributes */}
                                {variant.attributes && Object.keys(variant.attributes).length > 0 && (
                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium text-muted-foreground">Attributes</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {Object.entries(variant.attributes).map(([key, value]: [string, any]) => {
                                        // Render color attributes as a swatch, not as "color: white" text
                                        if (key.toLowerCase() === 'color') {
                                          const colorValue = String(value || '').trim();
                                          // if color is empty just skip rendering
                                          if (!colorValue) return null;
                                          return (
                                            <div
                                              key={`${variant.id}-${key}`}
                                              className="h-6 w-6 rounded-full border"
                                              title={`Color: ${colorValue}`}
                                              style={{ backgroundColor: colorValue }}
                                            />
                                          );
                                        }
                                        return (
                                          <Badge key={`${variant.id}-${key}`} variant="outline" className="text-xs">
                                            {key}: {String(value)}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Stock & Pricing Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                  {/* Stock Information */}
                                  <Card className="p-3">
                                    <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                      <Package className="h-4 w-4" />
                                      Stock & Inventory
                                    </h5>
                                    <div className="space-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Quantity:</span>
                                        <span className={`font-medium ${getStockColor(variantData.stock?.quantity || 0)}`}>
                                          {variantData.stock?.quantity || 0}
                                        </span>
                                      </div>
                                      {variantData.stock?.reorderLevel && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Reorder Level:</span>
                                          <span>{variantData.stock.reorderLevel}</span>
                                        </div>
                                      )}
                                      {variantData.stock?.location && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Location:</span>
                                          <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {variantData.stock.location}
                                          </span>
                                        </div>
                                      )}
                                      {variantData.stock?.batchLot && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Batch/Lot:</span>
                                          <span>{variantData.stock.batchLot}</span>
                                        </div>
                                      )}
                                    </div>
                                  </Card>

                                  {/* Pricing Information */}
                                  <Card className="p-3">
                                    <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                      <DollarSign className="h-4 w-4" />
                                      Pricing
                                    </h5>
                                    <div className="space-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Base Price:</span>
                                        <span className="font-medium">
                                          ${variantData.pricing?.basePrice || 0}
                                        </span>
                                      </div>
                                      {variantData.pricing?.salePrice && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Sale Price:</span>
                                          <span className="text-destructive font-medium">
                                            ${variantData.pricing.salePrice}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cost Price:</span>
                                        <span>${variantData.pricing?.costPrice || 0}</span>
                                      </div>
                                      {variantData.pricing?.basePrice && variantData.pricing?.costPrice && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Margin:</span>
                                          <span className="text-success text-xs">
                                            {(((variantData.pricing.basePrice - variantData.pricing.costPrice) / variantData.pricing.basePrice) * 100).toFixed(1)}%
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </Card>

                                  {/* Logistics Information */}
                                  <Card className="p-3">
                                    <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                      <Truck className="h-4 w-4" />
                                      Logistics
                                    </h5>
                                    <div className="space-y-1 text-sm">
                                      {variantData.logistics?.weight && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Weight:</span>
                                          <span className="flex items-center gap-1">
                                            <Weight className="h-3 w-3" />
                                            {variantData.logistics.weight}kg
                                          </span>
                                        </div>
                                      )}
                                      {variantData.logistics?.dimensions && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Dimensions:</span>
                                          <span className="flex items-center gap-1 text-xs">
                                            <Ruler className="h-3 w-3" />
                                            {variantData.logistics.dimensions.length}×{variantData.logistics.dimensions.width}×{variantData.logistics.dimensions.height}
                                          </span>
                                        </div>
                                      )}
                                      {variantData.logistics?.packagingType && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Package:</span>
                                          <span>{variantData.logistics.packagingType}</span>
                                        </div>
                                      )}
                                      {variantData.logistics?.hsCode && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">HS Code:</span>
                                          <span className="font-mono text-xs">{variantData.logistics.hsCode}</span>
                                        </div>
                                      )}
                                    </div>
                                  </Card>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Activity Log */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLog.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-sm text-muted-foreground">{activity.details}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {activity.date} • {activity.user}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
