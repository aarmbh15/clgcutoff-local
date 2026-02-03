import { cn } from "@/utils/utils"
import { HTMLAttributes, ReactNode } from "react"

interface IProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function BEContainer({ className, children, ...props }: IProps) {
  return (
    <div className={cn("max-w-[1366px] px-4 tab:px-8", className)} {...props}>
      {children}
    </div>
  )
}
