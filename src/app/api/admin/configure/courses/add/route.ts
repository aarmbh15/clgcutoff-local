import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const reqData = await request.json()
    const supabase = createAdminSupabaseClient()

    // 1. Check if course already exists
    const { data: existing, error: selectError } = await supabase
      .from("course_type_and_courses")
      .select("id, text, type")
      .eq("text", reqData.course)
      .eq("type", reqData.courseType)
      .maybeSingle()

    if (selectError) {
      return NextResponse.json(
        { msg: "Failed to check existing course", error: selectError },
        { status: 400 }
      )
    }

    if (existing) {
      return NextResponse.json(
        { msg: "Course already exists!", data: existing },
        { status: 200 }
      )
    }

    // 2. Insert new course
    const { data: insertData, error: insertError } = await supabase
      .from("course_type_and_courses")
      .insert({ type: reqData.courseType, text: reqData.course })
      .select()
      .maybeSingle()

    if (insertError || isEmpty(insertData)) {
      return NextResponse.json(
        { msg: "Failed to insert data", error: insertError },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: insertData,
      msg: "Course added successfully.",
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 }
    )
  }
}
