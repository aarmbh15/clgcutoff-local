import { createUserSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createUserSupabaseClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { message: "Login to continue.", error },
        { status: 401 },
      )
    }

    const phoneProvider = user.identities?.find(
      (identity) => identity.provider === "phone",
    )

    if (!phoneProvider) {
      return NextResponse.json(
        { message: "Access denied: Not a phone login user" },
        { status: 403 },
      )
    }

    return NextResponse.json({ message: "User logged in with phone", user })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}
