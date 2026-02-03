"use client"

import { cn } from "@/utils/utils"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { IndianRupee } from "lucide-react"
import * as React from "react"

interface FeeRangeSliderProps {
  className?: string
  range: [number, number]
  setRange: React.Dispatch<React.SetStateAction<[number, number]>>
  includeFeeRange: boolean
  setIncludeFeeRange: React.Dispatch<React.SetStateAction<boolean>>
}

export const MAX_FEE = 100_000_000

export function FeeRangeSlider({
  className,
  range,
  setRange,
  includeFeeRange,
  setIncludeFeeRange,
}: FeeRangeSliderProps) {
  const handleSliderChange = (newValue: number[]) => {
    setRange([newValue[0], newValue[1]])
    if (!includeFeeRange) {
      setIncludeFeeRange(true)
    }
  }

  const handleInputChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value)
      if (!isNaN(newValue) && newValue >= 0 && newValue <= MAX_FEE) {
        const newRange: [number, number] = [...range] as [number, number]
        newRange[index] = newValue

        // Ensure from value doesn't exceed to value and vice versa
        if (index === 0 && newValue > range[1]) {
          newRange[0] = range[1]
        } else if (index === 1 && newValue < range[0]) {
          newRange[1] = range[0]
        } else {
          newRange[index] = newValue
        }

        setRange(newRange)

        if (!includeFeeRange) {
          setIncludeFeeRange(true)
        }
      }
    }

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className={cn(className)}>
      <label className={cn("text-base pc:text-lg mb-[6px] block font-medium")}>
        Fees
      </label>

      <div className="flex items-center gap-3 w-full">
        <div className="relative w-full">
          <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="feeFrom"
            type="number"
            min={0}
            max={MAX_FEE}
            value={range[0] === 0 ? "" : range[0]}
            placeholder="0"
            onChange={handleInputChange(0)}
            className="pl-8 text-xs py-4 border border-color-border bg-color-white_black rounded w-full"
          />
        </div>

        <div className="relative w-full">
          <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="feeTo"
            type="number"
            min={0}
            max={MAX_FEE}
            value={range[1] === 0 ? "" : range[1]}
            onChange={handleInputChange(1)}
            className="pl-8 text-xs py-4 border border-color-border bg-color-white_black rounded w-full"
          />
        </div>
      </div>

      <Slider
        min={0}
        max={MAX_FEE}
        step={1000}
        value={range}
        onValueChange={handleSliderChange}
        className="py-6"
      />
      <div className="text-sm text-color-text flex justify-between px-2">
        <p>
          From:
          <br />
          {formatValue(range[0])}
        </p>
        <p>
          To:
          <br />
          {formatValue(range[1])}
        </p>
      </div>
    </div>
  )
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-color-border">
      <SliderPrimitive.Range className="absolute h-full bg-color-accent" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border border-color-border bg-color-dim-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:border-primary hover:bg-color-accent cursor-pointer" />
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border border-color-border bg-color-dim-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:border-primary hover:bg-color-accent cursor-pointer" />
  </SliderPrimitive.Root>
))

Slider.displayName = SliderPrimitive.Root.displayName
