import { cn } from "@/utils/utils"
import React from "react"

export function Heading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "text-[18px] text-color-text font-semibold pc:text-[24px] pb-2 title",
        className,
      )}
    >
      {children}
    </h2>
  )
}
