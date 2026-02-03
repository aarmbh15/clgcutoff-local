"use client"

import { FC } from "react"
import { cn } from "@/utils/utils" // your utility for classNames

interface IOption {
  id: string | number
  text: string
}

interface SelectProps {
  value: string | number
  options: IOption[]
  onChange: (value: string | number) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const Select: FC<SelectProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select",
  className = "",
  disabled = false,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "border border-gray-300 rounded py-2 focus:outline-none focus:ring focus:ring-blue-300",
        className
      )}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.text}
        </option>
      ))}
    </select>
  )
}
