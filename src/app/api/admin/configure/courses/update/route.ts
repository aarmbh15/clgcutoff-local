import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { id, text } = await request.json()
    const supabase = createAdminSupabaseClient()

    // 1. Check if course with given ID exists
    const { data: existing, error: fetchError } = await supabase
      .from("course_type_and_courses")
      .select("id")
      .eq("id", id)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json(
        { msg: "Failed to check existing course", error: fetchError },
        { status: 500 }
      )
    }

    if (!existing) {
      return NextResponse.json(
        { msg: "Course not found with given ID" },
        { status: 404 }
      )
    }

    // 2. Proceed with update
    const { data, error: updateError } = await supabase
      .from("course_type_and_courses")
      .update({ text })
      .eq("id", id)
      .select()

    if (updateError || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Failed to update course", error: updateError },
        { status: 400 }
      )
    }

    return NextResponse.json({
      msg: "Course updated successfully",
      data: data[0],
    })
  } catch (err) {
    return NextResponse.json(
      { msg: "Unexpected server error", err },
      { status: 500 }
    )
  }
}
