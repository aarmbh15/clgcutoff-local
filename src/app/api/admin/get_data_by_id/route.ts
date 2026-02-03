import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
function getTableName(stateCode?: string | null): string {
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    if(stateCode.toLowerCase()==="all"){

      return "college_table_all_india"
    }
    return `college_table_${stateCode.toUpperCase()}`
  }
  return "college_table_all_india"
}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const stateCode = searchParams.get("stateCode")
const tableName = getTableName(stateCode)
 
    if (!id || !stateCode) {
      return NextResponse.json({ msg: "ID and State are required" }, { status: 400 })
    }

    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json(
        { msg: "Failed to fetch data", error },
        { status: 400 },
      )
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { msg: "Something went wrong!", err },
      { status: 400 },
    )
  }
}
