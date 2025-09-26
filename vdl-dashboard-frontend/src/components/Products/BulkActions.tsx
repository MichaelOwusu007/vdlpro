import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Download, Edit, Archive, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export function BulkActions({ selectedCount, onClearSelection }: BulkActionsProps) {
  const handleBulkAction = (action: string) => {
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedCount} products.`
    });
    onClearSelection();
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm sm:text-base">{selectedCount} items selected</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onClearSelection}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction("Export")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            
            <Select onValueChange={(value) => handleBulkAction(`Status changed to ${value}`)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Set Active</SelectItem>
                <SelectItem value="inactive">Set Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => handleBulkAction(`Category changed to ${value}`)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="tech-accessories">Tech Accessories</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => handleBulkAction(`Supplier changed to ${value}`)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="techsupplier">TechSupplier Co</SelectItem>
                <SelectItem value="office-solutions">Office Solutions Ltd</SelectItem>
                <SelectItem value="sportscorp">SportsCorp</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction("Archived")}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>

          {/* Mobile: Grid layout */}
          <div className="sm:hidden grid grid-cols-2 gap-2 w-full">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction("Export")}
              className="w-full"
            >
              Export
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction("Archived")}
              className="w-full"
            >
              Archive
            </Button>
            
            <Select onValueChange={(value) => handleBulkAction(`Status changed to ${value}`)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Change Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Set Active</SelectItem>
                <SelectItem value="inactive">Set Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => handleBulkAction(`Category changed to ${value}`)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Change Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="tech-accessories">Tech Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}