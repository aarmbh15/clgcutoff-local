import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const item = searchParams.get("item")

    if (!type) {
      return NextResponse.json(
        { msg: "Missing 'type' in query params" },
        { status: 400 },
      )
    }

    const supabase = createAdminSupabaseClient()
// console.log(type,item)
    let query = supabase.from("price").select("*").eq("type", type)

    if (item) {
      query = query.eq("item", item)
      const { data, error } = await query.maybeSingle()
// console.log("Data: ",data,error)
      if (error) {
        return NextResponse.json(
          { msg: "Failed to fetch data", error },
          { status: 400 },
        )
      }

        if (!data) {
    return NextResponse.json(
      { msg: "No matching record found", data: null },
      { status: 404 }
    )
  }
      return NextResponse.json({ data, msg: "price fetched successfully" })
    } else {
      query = query.order("item", { ascending: true })
      const { data, error } = await query

      if (error) {
        return NextResponse.json(
          { msg: "Failed to fetch data", error },
          { status: 400 },
        )
      }
console.log(data,item,type)
      return NextResponse.json({ data, msg: "prices fetched successfully" })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}

