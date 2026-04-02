import { createUserSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { phone } = body

//     const supabase = createUserSupabaseClient()

//     const { data, error } = await supabase.auth.signInWithOtp({
//       phone,
//     })

//     if (error) {
//       return NextResponse.json(
//         {
//           msg: "Failed to send OTP",
//           error,
//         },
//         { status: 400 },
//       )
//     }

//     return NextResponse.json({
//       msg: "OTP sent successful",
//       data,
//     })
//   } catch (err) {
//     console.error(err)
//     return NextResponse.json(
//       { err, msg: "Something went wrong!" },
//       { status: 400 },
//     )
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body
const phoneNormalized = phone?.trim()
    // ✅ DEV BYPASS
    if (process.env.NODE_ENV === "development") {
  if (
    phoneNormalized === "+919876543210" ||
    phoneNormalized === "9876543210"
  ) {
    return NextResponse.json({
      msg: "OTP sent successful (DEV MODE)",
      data: {
        phone: phoneNormalized,
        otp: "123456",
      },
    })
  }
}

    const supabase = createUserSupabaseClient()

    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    })

    if (error) {
      return NextResponse.json(
        {
          msg: "Failed to send OTP",
          error,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      msg: "OTP sent successful",
      data,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}
