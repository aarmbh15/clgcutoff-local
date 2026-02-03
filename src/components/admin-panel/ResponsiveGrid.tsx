import { cn } from "@/utils/utils"
import React from "react"

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveGrid({ children, className }: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-y-5 tab:gap-[30px] max-w-full",
        className,
      )}
    >
      {children}
    </div>
  )
}
