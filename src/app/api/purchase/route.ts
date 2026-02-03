import { createUserSupabaseClient } from "@/lib/supabase"
import { paymentType } from "@/utils/static"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const reqData = await request.json()

    const supabase = createUserSupabaseClient()
// console.log("Req data purchagesd: ",reqData)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    reqData.phone = user?.phone

    const { error, data } = await supabase
      .from("purchase")
      .insert(reqData)
      .select()
// console.log("PUshed data; ",reqData,data)
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

// Get User Packages details
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const paymentType = searchParams.get("paymentType")

  try {
    const supabase = createUserSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: userPurchases, error: purchasesError } = await supabase
        .from("purchase")
        .select("*")
        .eq("phone", user.phone)
        .eq("payment_type", paymentType)

      if (purchasesError) {
        console.error("Supabase error:", purchasesError.message)
        return NextResponse.json(
          {
            error: "Failed to fetch user purchases",
            details: purchasesError.message,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        data: userPurchases,
        msg: "User purchases fetched successfully",
      })
    } else {
      return NextResponse.json({
        data: [],
        msg: "User purchases fetched successfully",
      })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { msg: "Something went wrong", err },
      { status: 500 },
    )
  }
}

