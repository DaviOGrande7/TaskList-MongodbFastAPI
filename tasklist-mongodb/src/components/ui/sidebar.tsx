"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardList,
  Tag,
  Home,
} from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: ClipboardList, label: "Tasks" },
  { href: "/tags", icon: Tag, label: "Tags" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-gray-100 dark:bg-gray-900 border-r flex flex-col items-center py-4 space-y-4">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition",
            pathname === href && "bg-gray-300 dark:bg-gray-700"
          )}
        >
          <Icon className="h-6 w-6" aria-label={label} />
        </Link>
      ))}
    </aside>
  )
}
