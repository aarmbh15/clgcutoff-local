import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from("course_type_and_courses")
    .select("id, type, text") 

  if (error) {
    console.error("Supabase Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }


    // Group by unique `type`
  const groupedData = data.reduce((acc: Record<string, any>, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = {
        type: curr.type,
        id:curr.id,
        items: [],
      }
    }
    acc[curr.type].items.push({
      id: curr.id,
      text: curr.text,
    })
    return acc
  }, {})

  // Convert to array
  const result = Object.values(groupedData)
// console.log("REsult: ",result)
  return NextResponse.json({ success: true, data:result }, { status: 200 })
}
