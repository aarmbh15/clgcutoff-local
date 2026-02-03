import { cn } from "@/utils/utils"

export function Card({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "bg-color-form-background shadow-2xl rounded-lg px-4 py-3",
        className,
      )}
    >
      {children}
    </div>
  )
}
