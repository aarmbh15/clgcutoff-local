// app/api/category-types/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient()
  const { searchParams } = new URL(request.url)
  const quota_type_id = searchParams.get("quota_type_id")

  if (!quota_type_id) {
    return NextResponse.json({ success: false, error: "Missing quota_type_id" }, { status: 400 })
  }

  const { data, error } = await supabase.rpc("get_category_types", {
  quota_type_id: parseInt(quota_type_id),
})

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
