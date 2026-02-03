import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

export async function GET() {
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase.from("counselling_types").select("*")

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
