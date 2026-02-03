"use client"

import useFetch from "@/hooks/useFetch"
import { cn, isEmpty } from "@/utils/utils"
import { format, subDays } from "date-fns"
import { X } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const timeRanges = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "365 Days", value: 365 },
]

export default function RevenueChart() {
  const [selectedRange, setSelectedRange] = useState(7)
  const [data, setData] = useState<any[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const chartRef = React.useRef<any>(null)

  const { fetchData } = useFetch()

  useEffect(() => {
    fetchData({
      url: `/api/admin/dashboard/revenue/get_date_wise`,
      params: { days: selectedRange },
    }).then((res) => {
      console.log("Response Data: ",res?.payload)
      setData(res?.payload)
    })
  }, [selectedRange])

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }, [])

  if (isEmpty(data)) {
    return null
  }

  return (
    <div
      className={cn(
        "w-full p-6 bg-color-form-background rounded-lg shadow-lg",
        isFullScreen && "p-8",
      )}
      ref={chartRef}
      onClick={() => {
        setIsFullScreen(true)
        chartRef?.current?.requestFullscreen()
      }}
    >
      <X
        className="text-color-text absolute top-3 right-3 cursor-pointer hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation()
          setIsFullScreen(false)
          document.exitFullscreen()
        }}
      />

      <div
        className={cn(
          "flex items-center mb-6 gap-5 px-4",
          isFullScreen && "justify-between",
        )}
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Revenue Analytics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing total revenue for the last {selectedRange} days
          </p>
        </div>
        <select
          className="px-4 py-2 bg-color-form-background border border-gray-300 dark:border-gray-600 rounded shadow-sm text-gray-700 dark:text-gray-200"
          value={selectedRange}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setSelectedRange(Number(e.target.value))}
        >
          {timeRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className={isFullScreen ? "h-[calc(100vh-250px)]" : "h-[250px]"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-300 dark:stroke-gray-700/70"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), "MMM d")}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis className="text-gray-600 dark:text-gray-400" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-color-form-background p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {format(new Date(label), "MMM d, yyyy")}
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-400">
                        Revenue: ₹{payload[0].value}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="linear"
              dataKey="revenue"
              stroke="#34D399"
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

