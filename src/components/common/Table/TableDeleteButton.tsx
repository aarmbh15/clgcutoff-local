"use client"

import { cn } from "@/utils/utils"
import { Trash2 } from "lucide-react"
import React from "react"

interface TableDeleteButtonProps {
  title: string
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function TableDeleteButton({
  title,
  className,
  onClick,
  disabled,
}: TableDeleteButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "border border-red-600 text-red-600 text-sm px-2 py-1 flex items-center gap-2 rounded-md hover:bg-red-600 hover:text-white group",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Trash2 className="text-red-600 group-hover:text-white" size={20} />
      {title}
    </button>
  )
}
