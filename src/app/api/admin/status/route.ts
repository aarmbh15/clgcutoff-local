import { createAdminSupabaseClient } from "@/lib/supabase"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient()
    const timeZone = "Asia/Kolkata"

    const tables = [
      "college_table",
      "courses",
      "dropdown_options",
      "payment",
      "price",
      "purchase",
      "user",
    ]

    const results: Record<string, string | null> = {}

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) {
        return NextResponse.json(
          { msg: `Failed to fetch data from ${table}`, error },
          { status: 400 },
        )
      }

      const timestamp = data?.[0]?.created_at

      if (timestamp) {
        const zonedDate = toZonedTime(new Date(timestamp), timeZone)
        results[`${table}_last_inserted`] = format(
          zonedDate,
          "dd-MMMM-yyyy | hh:mm a",
        )
      } else {
        results[`${table}_last_inserted`] = null
      }
    }

    return NextResponse.json(results)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { msg: "Something went wrong!", error: err },
      { status: 400 },
    )
  }
}

