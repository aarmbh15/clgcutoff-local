import { cn } from "@/utils/utils"
import { HTMLAttributes, ReactNode } from "react"

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn("max-w-[2000px] mx-auto px-1 tab:px-6 pc:px-8", className)}
      {...props}
    >
      {children}
    </div>
  )
}
