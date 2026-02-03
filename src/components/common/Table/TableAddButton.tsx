"use client"

import { cn } from "@/utils/utils"
import { CirclePlus, Trash2 } from "lucide-react"
import React from "react"

interface TableDeleteButtonProps {
  title: string
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function TableAddButton({
  title,
  className,
  onClick,
  disabled,
}: TableDeleteButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "border border-color-accent text-color-accent text-sm px-2 py-1 flex items-center gap-2 rounded-md hover:bg-color-accent hover:text-white group",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <CirclePlus
        className="text-color-accent group-hover:text-white"
        size={20}
      />
      {title}
    </button>
  )
}
