import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { year } = await request.json()

    const supabase = createAdminSupabaseClient()

    const { error, data } = await supabase
      .from("college_table")
      .delete()
      .eq("year", year)
      .select()

    if (error || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Nothing to delete", error, data },
        { status: 400 },
      )
    }

    return NextResponse.json({ msg: "Records deleted successfully." })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}

