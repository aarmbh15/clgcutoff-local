import {
  createAdminSupabaseClient,
  createUserSupabaseClient,
} from "@/lib/supabase"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createUserSupabaseClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error(error?.cause)

      return NextResponse.json(
        { msg: "Logout failed", isAuthenticated: true, error },
        { status: 400 },
      )
    }

    return NextResponse.json({
      msg: "Logout successful",
      isAuthenticated: false,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}

