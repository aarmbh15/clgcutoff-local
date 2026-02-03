
import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient()
  const { searchParams } = new URL(request.url)
  const counselling_type_id = searchParams.get("counselling_type_id")
  const state_code = searchParams.get("state_code")
  const course_type = searchParams.get("course_type")


  if (!counselling_type_id) {
    return NextResponse.json({ success: false, error: "Missing counselling_type_id" }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('get_quotas_with_subquotas', {
  p_counselling_type_id:counselling_type_id ? Number(counselling_type_id) : null,
  p_state_code: state_code || null,
p_course_type:course_type||null

})
  if (error) {
    console.error("Supabase Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
