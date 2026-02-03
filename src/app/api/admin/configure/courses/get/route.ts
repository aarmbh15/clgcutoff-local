
import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient()

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  if (!type) {
    return NextResponse.json({ success: false, error: "Missing 'type' query param" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("course_type_and_courses")
    .select("id, text, type") // Only id and text as per your latest requirement
    .eq("type", type)
      .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data }, { status: 200 })
}
