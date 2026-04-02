// import { createUserSupabaseClient } from "@/lib/supabase"
// import { NextRequest, NextResponse } from "next/server"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { phone, token } = body

//     const supabase = createUserSupabaseClient()

//     const { data, error } = await supabase.auth.verifyOtp({
//       phone,
//       token,
//       type: "sms",
//     })

//     if (error) {
//       return NextResponse.json(
//         {
//           msg: "Failed to verify OTP",
//           error,
//         },
//         { status: 400 },
//       )
//     }

//     return NextResponse.json({
//       msg: "OTP verification successful",
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


import { createUserSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, token } = body
    const phoneNormalized = phone?.trim()

    // ✅ DEV BYPASS for OTP verification
    // if (process.env.NODE_ENV === "development") {
    //   if (phone === "9876543210" && token === "1234") {
    //     // Simulate a successful verification response:
    //     return NextResponse.json({
    //       msg: "OTP verification successful (DEV MODE)",
    //       data: {
    //         user: {
    //           id: "dev-user-9876543210",
    //           phone,
    //         },
    //         // you can add more dummy user data here if needed
    //       },
    //     })
    //   }
    // }
    if (process.env.NODE_ENV === "development") {
  if (
    (phoneNormalized === "+919876543210" ||
      phoneNormalized === "9876543210") &&
    token === "123456"
  ) {
    return NextResponse.json({
      msg: "OTP verification successful (DEV MODE)",
      data: {
        user: {
          id: "dev-user-9876543210",
          phone: phoneNormalized,
        },
      },
    })
  }
}

    const supabase = createUserSupabaseClient()

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    })

    if (error) {
      return NextResponse.json(
        {
          msg: "Failed to verify OTP",
          error,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      msg: "OTP verification successful",
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