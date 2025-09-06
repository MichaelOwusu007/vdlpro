"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import clsx from "clsx";
import Badge from "@/components/ui/Badge";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 px-5 border-b">
        <img src="/images/vdl-logo.svg" alt="logo" className="h-6 w-6" />
        <span className="font-semibold">isomorphic</span>
      </div>

      {/* Scrollable nav list */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="px-3 pb-2 text-xs font-semibold text-gray-400 tracking-wide">
          OVERVIEW
        </p>

        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "group flex items-center rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-gray-100 font-semibold text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={clsx(
                      "mr-3 h-5 w-5",
                      active ? "text-gray-900" : "text-gray-400 group-hover:text-gray-700"
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && <Badge>{item.badge}</Badge>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
