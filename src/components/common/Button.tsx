import { cn } from "@/utils/utils"

export function Button({
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
  variant,
  type = "button",
  ...props
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  onMouseLeave?: () => void
  onMouseEnter?: () => void
  type?: "button" | "submit" | "reset"
  variant?: "primary" | "outline"
  disabled?: boolean
}) {
  if (variant === "outline") {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
        className={cn(
          "border border-color-accent-dark text-color-accent-dark hover:bg-color-accent/20 disabled:opacity-50 px-4 py-3 rounded",
          className,
        )}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
         onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      {...props}
      className={cn(
        "bg-color-accent hover:bg-color-accent-dark disabled:bg-color-disabled-bg disabled:text-color-disabled-text px-4 py-3 rounded text-white",
        className,
      )}
    >
      {children}
    </button>
  )
}
