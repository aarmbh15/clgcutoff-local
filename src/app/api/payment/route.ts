import { createUserSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const reqData = await request.json()

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        reqData,
        msg: "Data Not inserted In Dev Mode",
      })
    }

    const supabase = createUserSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    reqData.phone = user?.phone

    const { error, data } = await supabase
      .from("payment")
      .insert(reqData)
      .select()

    if (error || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Failed to insert data", error, data },
        { status: 400 },
      )
    }

    return NextResponse.json({ data, msg: "Data inserted successfully." })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { msg: "Something went wrong", err },
      { status: 500 },
    )
  }
}

