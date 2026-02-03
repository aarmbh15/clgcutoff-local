"use client"

import { useAppState } from "@/hooks/useAppState"
import { cn } from "@/utils/utils"
import {
  BadgeIndianRupee,
  CalendarCog,
  Database,
  Home,
  PlusSquare,
  ReceiptIndianRupee,
  Settings,
  Settings2,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const sidebarMenus = [
  {
    icon: <Home />,
    title: "Dashboard",
    link: "/admin/dashboard",
  },
  {
    icon: <ReceiptIndianRupee />,
    title: "Payment Insights",
    link: "/admin/payment-insights",
  },
  {
    icon: <PlusSquare/>,
    title: "Add Data",
    link: "/admin/add-data",
  },
  {
    icon: <PlusSquare />,
    title: "Add Bulk Data",
    link: "/admin/add-bulk-data",
  },
  {
    icon: <PlusSquare />,
    title: "Add category-quota",
    link: "/admin/metadata",
  },
  {
    icon: <Database />,
    title: "Manage Data",
    link: "/admin/manage-data",
  },

  {
    icon: <CalendarCog />,
    title: "Configure Current Year",
    link: "/admin/configure/years",
  },
  {
    icon: <Settings2 />,
    title: "Configure Dropdowns",
    link: "/admin/configure",
  },
  {
    icon: <Settings />,
    title: "Configure Courses",
    link: "/admin/configure/courses",
  },
  {
    icon: <BadgeIndianRupee />,
    title: "Configure Prices",
    link: "/admin/configure/prices",
  },
    {
    icon: <Trash2 />,
    title: "Delete Yearly Data",
    link: "/admin/delete-yearly-data",
  },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  const { setAppState } = useAppState()

  return (
    <div
      className={cn(
        "fixed top-[64px] h-screen pc:h-[calc(100vh-3px)] overflow-y-auto overflow-x-hidden bg-color-form-background w-[210px]",
        className,
      )}
    >
      <ul className="mt-6 flex flex-col gap-2">
        {sidebarMenus.map((menu) => (
          <Link
            key={menu?.title}
            href={menu.link}
            className={cn(
              "flex items-center gap-2 py-3 px-4 hover:bg-color-accent hover:text-white text-sm",
              pathname === menu.link && "bg-color-accent-dark text-white",
            )}
            onClick={() => {
              if (pathname !== menu?.link) setAppState({ pageLoader: true })
            }}
          >
            <span>{menu.icon}</span>
            <span>{menu.title}</span>
          </Link>
        ))}
      </ul>
    </div>
  )
}

