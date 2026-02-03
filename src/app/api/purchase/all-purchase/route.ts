import { createUserSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

// app/api/purchase/all-purchase/route.ts
export const dynamic = "force-dynamic"; 
export const revalidate = 0;

// Get User Packages details
export async function GET(request: NextRequest) {

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

