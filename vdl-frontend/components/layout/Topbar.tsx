"use client";

import IconButton from "@/components/ui/IconButton";
import { LuBell, LuSettings, LuSearch, LuSun } from "react-icons/lu";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-3 px-4">
        {/* Search */}
        <div className="relative flex-1">
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search your page..."
            className="h-10 w-full rounded-lg border pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500">
            ⌘K
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <IconButton aria-label="Theme"><LuSun /></IconButton>
          <IconButton aria-label="Notifications"><LuBell /></IconButton>
          <IconButton aria-label="Settings"><LuSettings /></IconButton>
          <img
            src="/avatars/user-1.jpg"
            alt="avatar"
            className="ml-1 h-9 w-9 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
