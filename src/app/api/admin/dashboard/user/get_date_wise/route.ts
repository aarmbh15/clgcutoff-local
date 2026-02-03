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

  const zonedNow = toZonedTime(new Date(), timeZone)
  const fromDate = subDays(zonedNow, days)

  // const { data, error } = await supabase
  //   .from("user")
  //   .select("created_at")
  //   .gte("created_at", fromDate.toISOString())
const toDate = zonedNow // now
const { data, error } = await supabase
  .from("user")
  .select("created_at")
  .gte("created_at", fromDate.toISOString())
  .lte("created_at", toDate.toISOString())
  if (error) {
    return NextResponse.json(
      { msg: "Error fetching user data", error },
      { status: 500 },
    )
  }
// console.log("Data: ",data)
  const grouped: Record<string, number> = {}

  for (const row of data) {
    const rowDate = toZonedTime(new Date(row.created_at), timeZone)
    const dateKey = format(rowDate, "yyyy-MM-dd", { timeZone })
    grouped[dateKey] = (grouped[dateKey] || 0) + 1
  }

  const result = Array.from({ length: days }).map((_, index) => {
    const dateObj = subDays(zonedNow, days - 1 - index)
    const key = format(dateObj, "yyyy-MM-dd", { timeZone })
    return {
      date: format(dateObj, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
      userCount: grouped[key] || 0,
    }
  })

  return NextResponse.json(result)
}

