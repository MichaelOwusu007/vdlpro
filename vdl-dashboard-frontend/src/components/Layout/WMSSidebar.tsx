import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  FileBarChart,
  Users,
  Settings,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WMSSidebarProps {
  collapsed: boolean;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Warehouse,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Shipping",
    href: "/shipping",
    icon: Truck,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileBarChart,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const WMSSidebar = ({ collapsed }: WMSSidebarProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border flex-shrink-0">
        {collapsed ? (
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Warehouse className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <img src="/vdllogo.webp" alt="vdl logo" />
            </div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              VDL PRO
            </h1>
          </div>
        )}
      </div>

      {/* Navigation (scrollable section) */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer (sticks to bottom, not scrollable) */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/60 text-center">
            VDL WMS v2.0.0
          </div>
        )}
      </div>
    </div>
  );
};
