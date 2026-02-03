import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const reqData = await request.json()

    if (!Array.isArray(reqData) || reqData?.length === 0) {
      return NextResponse.json(
        { msg: "Invalid input. Expected a non-empty array." },
        { status: 400 },
      )
    }

    const supabase = createAdminSupabaseClient()

    const { error, data } = await supabase
      .from("dropdown_options")
      .insert(reqData)
      .select()

    if (error || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Failed to insert data", error, data },
        { status: 400 },
      )
    }

    return NextResponse.json({
      data,
      msg: "Dropdown options added successfully.",
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}
