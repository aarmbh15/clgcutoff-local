

import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

type AddPriceRow = {
  item?: { name: string; code: string }
  price: number
  type: string
  isBulkAdd?: boolean
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
    const body: AddPriceRow = await req.json()

    if (typeof body?.price !== "number" || !body?.type) {
      return NextResponse.json(
        { error: "Missing required price or type field" },
        { status: 400 }
      )
    }


    // Bulk add for all states
    if (body.isBulkAdd) {
      // Get all existing codes for this type
      const { data: existingRows, error: fetchError } = await supabase
        .from("price")
        .select("id, item, type, price")
        .eq("type",body.type)
      if (fetchError) {
        return NextResponse.json(
          { error: fetchError.message, details: fetchError.details },
          { status: 500 }
        )
      }
      const existingCodes = new Set(
          (existingRows || []).map((row: any) => row.item)
        )
        
        // console.log(existingRows)
      // Only add states that don't already exist for this type
      const toInsert = indianStates
        .filter((state) => !existingCodes.has(state.name))
        .map((state) => ({
          item: state.name,
          price: body.price,
          type: body.type,
        }))

      if (toInsert.length === 0) {
        return NextResponse.json({
          success: true,
          msg: "All states already have a price for this type.",
          inserted: 0,
        })
      }

      const { error: insertError } = await supabase
        .from("price")
        .insert(toInsert)

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message, details: insertError.details },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        msg: `Added prices for ${toInsert.length} states.`,
        inserted: toInsert.length,
      })
    }

    // Single add
    if (!body.item  || !body.price|| !body.type) {
      return NextResponse.json(
        { error: "Missing item (state) for single add" },
        { status: 400 }
      )
    }

    // Check if already exists
    const { data: existing, error: fetchError } = await supabase
      .from("price")
      .select("id")
      .eq("type", body.type)
      .eq("item", body.item)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message, details: fetchError.details },
        { status: 500 }
      )
    }

    if (existing) {
      return NextResponse.json(
        { error: "Price already exists for this state and type" },
        { status: 409 }
      )
    }

    // Insert new row
    const { error: insertError } = await supabase
      .from("price")
      .insert({
        item: body.item.name,
        price: body.price,
        type: body.type,
      })

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message, details: insertError.details },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      msg: "Price added successfully for state",
    })
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}