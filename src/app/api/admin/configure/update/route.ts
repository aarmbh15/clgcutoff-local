import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { id, text } = await request.json()
    const supabase = createAdminSupabaseClient()

    const { error, data } = await supabase
      .from("dropdown_options")
      .update({ text })
      .eq("id", id)
      .select()

    if (error || isEmpty(data))
      return NextResponse.json(
        { msg: "Failed to update", error, data },
        { status: 400 },
      )

    return NextResponse.json({ msg: "Updated successfully" })
  } catch (err) {
    return NextResponse.json(
      { msg: "Something went wrong", err },
      { status: 400 },
    )
  }
}
