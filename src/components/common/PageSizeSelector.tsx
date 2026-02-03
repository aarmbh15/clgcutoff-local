"use client"

import { FC } from "react"
import { IOption } from "@/types/GlobalTypes"
import { Select } from "@/components/common/Select"

interface PageSizeSelectorProps {
  pageSize: number
  onChange: (size: number) => void
  options?: IOption[]
  className?:string
}

export const PageSizeSelector: FC<PageSizeSelectorProps> = ({
  pageSize,
  onChange,
  className,
  options = [
    { id: 10, text: "10" },
    { id: 20, text: "20" },
    { id: 50, text: "50" },
    { id: 100, text: "100" },
  ],
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-700">Show</span>
      <Select
        value={pageSize}
        options={options}
        onChange={(val) => onChange(Number(val))}
        className="w-20"
      />
       <span className="text-sm text-gray-700">entries</span>
    </div>
  )
}
