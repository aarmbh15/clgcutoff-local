import { createAdminSupabaseClient } from "@/lib/supabase"
import { format, subDays } from "date-fns"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "20")

  if (page < 1 || pageSize < 1) {
    return NextResponse.json(
      { error: "Page and pageSize must be positive integers" },
      { status: 400 },
    )
  }

  const supabase = createAdminSupabaseClient()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await supabase
    .from("user")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

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

