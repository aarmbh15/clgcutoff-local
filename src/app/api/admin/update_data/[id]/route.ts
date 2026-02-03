import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

const na = ["NA", "N/A"]
 
function getTableName(stateCode?: string | null): string {
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    if(stateCode.toLowerCase()==="all")
    {
      return "college_table_all_india"
    }
    return `college_table_${stateCode.toUpperCase()}`
  }
  return "college_table_all_india"
}
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
      const { searchParams } = new URL(request.url)
    const id = params.id
  const stateCode = searchParams.get("stateCode")
  const {stateCode:fallBackStatusCode,...updateData} = await request.json()
  const tableName =  getTableName(stateCode||fallBackStatusCode)





    if (!id) {
      return NextResponse.json(
        { msg: "ID is required for updating data" },
        { status: 400 },
      )
    }

    const supabase = createAdminSupabaseClient()

    const rankFields = [
  { check: "closingRankR1", assign: "cRR1" },
  { check: "closingRankR2", assign: "cRR2" },
  { check: "closingRankR3", assign: "cRR3" },
  { check: "strayRound", assign: "sRR" },
  { check: "lastStrayRound", assign: "lSRR" },
  { check: "prevClosingRankR1", assign: "prevCRR1" },
  { check: "prevClosingRankR2", assign: "prevCRR2" },
  { check: "prevClosingRankR3", assign: "prevCRR3" },
  { check: "prevStrayRound", assign: "prevSRR" },
  { check: "prevLastStrayRound", assign: "prevlSRR" },
]

rankFields.forEach(({ check, assign }) => {
  const rawValue = updateData?.[check]
  const value =
    typeof rawValue === "string" || typeof rawValue === "number"
      ? String(rawValue).toUpperCase()
      : ""

  updateData[assign] = na.includes(value) ? null : updateData?.[assign] ?? null
})
    // updateData.cRR1 = na.includes(updateData?.closingRankR1.toUpperCase())
    //   ? null
    //   : updateData?.cRR1

    // updateData.cRR2 = na.includes(updateData?.closingRankR2.toUpperCase())
    //   ? null
    //   : updateData?.cRR2

    // updateData.cRR3 = na.includes(updateData?.closingRankR3.toUpperCase())
    //   ? null
    //   : updateData?.cRR3

    // updateData.sRR = na.includes(updateData?.strayRound.toUpperCase())
    //   ? null
    //   : updateData?.sRR

    // updateData.lSRR = na.includes(updateData?.lastStrayRound.toUpperCase())
    //   ? null
    //   : updateData?.lSRR
// console.log("UPdated: ",updateData)
    const { error, data } = await supabase
      .from(tableName)
      .update(updateData)
      .eq("id", id)
      .select()

    if (error || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Failed to update data", error, data },
        { status: 400 },
      )
    }

    return NextResponse.json({ msg: "Data updated successfully.", data })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { msg: "Something went wrong!", error: err },
      { status: 400 },
    )
  }
}

