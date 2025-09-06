// /lib/nav.ts
import { IconType } from "react-icons";
import {
  LuFolder, LuCalendar, LuUserCog, LuFolderKanban, LuHandshake,
  LuUsers, LuGavel, LuShare2, LuBriefcase,
  LuWallet, LuTruck, LuShoppingBag, LuChartLine
} from "react-icons/lu";

export type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  badge?: "NEW";
};

export const NAV_ITEMS: NavItem[] = [
  { label: "File Manager", href: "/dashboard/file-manager", icon: LuFolder },
  { label: "Appointment", href: "/dashboard/appointment", icon: LuCalendar },
  { label: "Executive", href: "/dashboard/executive", icon: LuUserCog },
  { label: "Project", href: "/dashboard/project", icon: LuFolderKanban },
  { label: "CRM", href: "/dashboard/crm", icon: LuHandshake },
  { label: "Affiliate", href: "/dashboard/affiliate", icon: LuUsers },
  { label: "Store Analytics", href: "/dashboard/store-analytics", icon: LuShare2, badge: "NEW" },
  { label: "Bidding", href: "/dashboard/bidding", icon: LuGavel, badge: "NEW" },
  { label: "Social Media", href: "/dashboard/social-media", icon: LuShare2 },
  { label: "Job Board", href: "/dashboard/job-board", icon: LuBriefcase },
  { label: "Financial", href: "/dashboard/financial", icon: LuWallet },
  { label: "Logistics", href: "/dashboard/logistics", icon: LuTruck },
  { label: "E-Commerce", href: "/dashboard/e-commerce", icon: LuShoppingBag },
  { label: "Analytics", href: "/dashboard/analytics", icon: LuChartLine },
];
