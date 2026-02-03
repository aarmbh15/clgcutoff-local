import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { msg: "Missing 'id' in request" },
        { status: 400 }
      )
    }

    const supabase = createAdminSupabaseClient()

    // Check if item exists
    const { data: existing, error: fetchError } = await supabase
      .from("course_type_and_courses")
      .select("id")
      .eq("id", id)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json(
        { msg: "Error checking existing data", error: fetchError },
        { status: 500 }
      )
    }

    if (!existing) {
      return NextResponse.json(
        { msg: "Item not found" },
        { status: 404 }
      )
    }

    // Proceed to delete
    const { error: deleteError } = await supabase
      .from("course_type_and_courses")
      .delete()
      .eq("id", id)

    if (deleteError) {
      return NextResponse.json(
        { msg: "Failed to delete item", error: deleteError },
        { status: 500 }
      )
    }

    return NextResponse.json({ msg: "Item deleted successfully" })
  } catch (err) {
    return NextResponse.json(
      { msg: "Unexpected error", err },
      { status: 500 }
    )
  }
}
