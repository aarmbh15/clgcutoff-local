import { createAdminSupabaseClient } from "@/lib/supabase"
import { subDays } from "date-fns"
import { format, toZonedTime } from "date-fns-tz"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get("days") || "0")

  if (![7, 30, 365].includes(days)) {
    return NextResponse.json(
      { error: "Invalid 'days' query param. Use 7, 30, or 365." },
      { status: 400 },
    )
  }

  const supabase = createAdminSupabaseClient()
  const timeZone = "Asia/Kolkata"

  // Always get current UTC, then convert to IST
  const now = new Date()
  const zonedNow = toZonedTime(now, timeZone)

  const fromDate = subDays(zonedNow, days)

  const { data, error } = await supabase
    .from("payment")
    .select(
      "created_at, SINGLE_COLLEGE_CLOSING_RANK, STATE_CLOSING_RANK, ALL_INDIA_CLOSING_RANK,PREMIUM_PLAN, COLLEGE_CUT_OFF, RANK_COLLEGE_PREDICTOR",
    )
    .gte("created_at", fromDate.toISOString())

  if (error) {
    return NextResponse.json(
      { msg: "Error fetching data", error },
      { status: 500 },
    )
  }

  const grouped: Record<string, number> = {}

  for (const row of data) {
    // Convert DB timestamp to IST
    const rowDate = toZonedTime(new Date(row.created_at), timeZone)
    const dateKey = format(rowDate, "yyyy-MM-dd", { timeZone })

    const total =
      (row.SINGLE_COLLEGE_CLOSING_RANK || 0) +
      (row.STATE_CLOSING_RANK || 0) +
      (row.ALL_INDIA_CLOSING_RANK || 0) +
      (row.PREMIUM_PLAN || 0) +
      (row.COLLEGE_CUT_OFF || 0) +
      (row.RANK_COLLEGE_PREDICTOR || 0)

    grouped[dateKey] = (grouped[dateKey] || 0) + total
  }

  const result = Array.from({ length: days }).map((_, index) => {
    const dateObj = subDays(zonedNow, days - 1 - index)
    const key = format(dateObj, "yyyy-MM-dd", { timeZone })

    return {
      date: format(dateObj, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
      revenue: grouped[key] || 0,
    }
  })

  return NextResponse.json(result)
}

