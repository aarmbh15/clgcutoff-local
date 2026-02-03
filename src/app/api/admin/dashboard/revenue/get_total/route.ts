import { createAdminSupabaseClient } from "@/lib/supabase"
import { startOfMonth } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createAdminSupabaseClient()
  const timeZone = "Asia/Kolkata"

  // Get current UTC time and convert to IST
  const zonedNow = toZonedTime(new Date(), timeZone)
  const currentMonthStart = startOfMonth(zonedNow).toISOString()

  const { data: totalData, error: totalError } =
    await supabase.rpc("total_revenue")

  const { data: monthlyData, error: monthlyError } = await supabase.rpc(
    "monthly_revenue",
    { start_date: currentMonthStart },
  )

  if (totalError || monthlyError) {
    return NextResponse.json(
      { msg: "Error fetching revenue summary", totalError, monthlyError },
      { status: 500 },
    )
  }

  const sumValues = (data: Record<string, any>[]) =>
    Object.values(data?.[0] ?? {}).reduce((sum, val) => sum + (val || 0), 0)

  return NextResponse.json({
    totalRevenue: sumValues(totalData),
    monthlyRevenue: sumValues(monthlyData),
  })
}

