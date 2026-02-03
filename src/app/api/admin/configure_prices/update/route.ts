import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

type PriceRow = {
  id: string
  price: number
  type: string
  isBulkUpdate: boolean
}


const indianStates = [
  { name: "Andhra Pradesh", code: "AP" },
  { name: "Arunachal Pradesh", code: "AR" },
  { name: "Assam", code: "AS" },
  { name: "Bihar", code: "BR" },
  { name: "Chhattisgarh", code: "CG" },
  { name: "Goa", code: "GA" },
  { name: "Gujarat", code: "GJ" },
  { name: "Haryana", code: "HR" },
  { name: "Himachal Pradesh", code: "HP" },
  { name: "Jharkhand", code: "JH" },
  { name: "Karnataka", code: "KA" },
  { name: "Kerala", code: "KL" },
  { name: "Madhya Pradesh", code: "MP" },
  { name: "Maharashtra", code: "MH" },
  { name: "Manipur", code: "MN" },
  { name: "Meghalaya", code: "ML" },
  { name: "Mizoram", code: "MZ" },
  { name: "Nagaland", code: "NL" },
  { name: "Odisha", code: "OR" },
  { name: "Punjab", code: "PB" },
  { name: "Rajasthan", code: "RJ" },
  { name: "Sikkim", code: "SK" },
  { name: "Tamil Nadu", code: "TN" },
  { name: "Telangana", code: "TS" },
  { name: "Tripura", code: "TR" },
  { name: "Uttar Pradesh", code: "UP" },
  { name: "Uttarakhand", code: "UK" },
  { name: "West Bengal", code: "WB" },
  { name: "Andaman and Nicobar Islands", code: "AN" },
  { name: "Chandigarh", code: "CH" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN" },
  { name: "Delhi", code: "DL" },
  { name: "Jammu and Kashmir", code: "JK" },
  { name: "Ladakh", code: "LA" },
  { name: "Lakshadweep", code: "LD" },
  { name: "Puducherry", code: "PY" }
]

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient()
    const body = await req.json()

    // Basic validation
    if (typeof body?.price !== "number") {
      return NextResponse.json(
        { error: "Missing required price field" },
        { status: 400 },
      )
    }

    if (body?.isBulkUpdate) {
      if (!body?.type) {
        return NextResponse.json(
          { error: "Missing type for bulk update" },
          { status: 400 },
        )
      }

      // Update all rows with the given type
      const { error: bulkUpdateError } = await supabase
        .from("price")
        .update({ price: body.price })
        .eq("type", body.type)

      if (bulkUpdateError) {
        return NextResponse.json(
          { error: bulkUpdateError.message, details: bulkUpdateError.details },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        msg: `Bulk updated all prices with type: ${body.type}`,
      })
    } else {
      if (!body?.id) {
        return NextResponse.json(
          { error: "Missing id for single update" },
          { status: 400 },
        )
      }

      // Check if row with given ID exists
      const { data: existing, error: fetchError } = await supabase
        .from("price")
        .select("id")
        .eq("id", body.id)
        .maybeSingle()

      if (fetchError) {
        return NextResponse.json(
          { error: fetchError.message, details: fetchError.details },
          { status: 500 },
        )
      }

      if (!existing) {
        return NextResponse.json(
          { error: "Price entry not found for the given ID" },
          { status: 404 },
        )
      }

      // Update specific row by ID
      const { error: updateError } = await supabase
        .from("price")
        .update({ price: body.price })
        .eq("id", existing.id)

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message, details: updateError.details },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        msg: "Price updated successfully for given ID",
      })
    }
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
