// src/components/ui/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ClipboardList, Tag, Home } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home", color: "text-blue-500" },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    color: "text-purple-500",
  },
  {
    href: "/tasks",
    icon: ClipboardList,
    label: "Tasks",
    color: "text-green-500",
  },
  { href: "/tags", icon: Tag, label: "Tags", color: "text-orange-500" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-18 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-6 space-y-6 shadow-lg backdrop-blur-sm z-50">
      {/* Navigation Items */}
      <nav className="flex flex-col space-y-3 flex-1">
        {navItems.map(({ href, icon: Icon, label, color }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative p-3 rounded-xl transition-all duration-200 hover:scale-110",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:shadow-md"
              )}
            >
              <Icon
                className={cn(
                  "h-7 w-7 transition-colors duration-200",
                  isActive ? "text-white" : `${color} group-hover:scale-110`
                )}
                aria-label={label}
              />

              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                {label}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
