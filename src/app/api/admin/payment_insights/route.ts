import { createAdminSupabaseClient } from "@/lib/supabase"
import { startOfDay, startOfMonth, startOfYear, subDays } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "20")
  const range = searchParams.get("range") || "allTime"

  if (page < 1 || pageSize < 1) {
    return NextResponse.json(
      { error: "Page and pageSize must be positive integers" },
      { status: 400 },
    )
  }

  const supabase = createAdminSupabaseClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const timeZone = "Asia/Kolkata"
  const zonedNow = toZonedTime(new Date(), timeZone)

  let dateFilter: string | null = null

  switch (range) {
    case "today":
      dateFilter = startOfDay(zonedNow).toISOString()
      break
    case "last7Days":
      dateFilter = subDays(zonedNow, 7).toISOString()
      break
    case "thisMonth":
      dateFilter = startOfMonth(zonedNow).toISOString()
      break
    case "thisYear":
      dateFilter = startOfYear(zonedNow).toISOString()
      break
    case "allTime":
    default:
      dateFilter = null
      break
  }

  let query = supabase
    .from("purchase")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (dateFilter) {
    query = query.gte("created_at", dateFilter)
  }

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json(
      { msg: "Error fetching user data", error },
      { status: 500 },
    )
  }

  const totalItems = count || 0
  const totalPages = Math.ceil(totalItems / pageSize)

  return NextResponse.json({
    data,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  })
}

