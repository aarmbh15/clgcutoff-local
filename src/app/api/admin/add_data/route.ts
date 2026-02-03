// import { createAdminSupabaseClient } from "@/lib/supabase"
// import { isEmpty } from "@/utils/utils"
// import { NextRequest, NextResponse } from "next/server"

// const na = ["NA", "N/A"]

// export async function POST(request: NextRequest) {
//   try {
//     const reqData = await request.json()
//     const supabase = createAdminSupabaseClient()

//     const {
//       instituteName,
//       instituteType,
//       state,
//       course,
//       quota,
//       category,
//       year,
//     } = reqData

//     // Check existing data without .single() to debug
//     const { data: checkData, error: checkError } = await supabase
//       .from("college_table")
//       .select("*")
//       .eq("instituteName", instituteName)
//       .eq("instituteType", instituteType)
//       .eq("state", state)
//       .eq("course", course)
//       .eq("quota", quota)
//       .eq("category", category)
//       .eq("year", Number(year))

//     if (checkError) {
//       console.error("Check query error:", checkError)
//       return NextResponse.json(
//         { msg: "Error checking data", error: checkError },
//         { status: 400 },
//       )
//     }

//     if (checkData?.length > 0) {
//       return NextResponse.json(
//         { msg: "The Data Already Exists!" },
//         { status: 400 },
//       )
//     }

//     // If data already exists, you might want to handle it differently
//     if (checkData && checkData.length > 0) {
//       return NextResponse.json(
//         { msg: "Data already exists", data: checkData },
//         { status: 200 },
//       )
//     }

//     const rankFields = [
//       { check: "closingRankR1", assign: "cRR1" },
//       { check: "closingRankR2", assign: "cRR2" },
//       { check: "closingRankR3", assign: "cRR3" },
//       { check: "strayRound", assign: "sRR" },
//       { check: "lastStrayRound", assign: "lSRR" },
//     ]

//     rankFields.forEach(({ check, assign }) => {
//       const rawValue = reqData?.[check]
//       const value =
//         typeof rawValue === "string" || typeof rawValue === "number"
//           ? String(rawValue).toUpperCase()
//           : ""

//       reqData[assign] = na.includes(value) ? null : reqData?.[assign]
//     })

//     // Insert new data
//     const { error, data } = await supabase
//       .from("college_table")
//       .insert(reqData)
//       .select()

//     if (error || isEmpty(data)) {
//       return NextResponse.json(
//         { msg: "Failed to insert data", error, data },
//         { status: 400 },
//       )
//     }

//     return NextResponse.json({ data, msg: "Data inserted successfully." })
//   } catch (err) {
//     console.error("Unexpected error:", err)
//     return NextResponse.json(
//       { err, msg: "Something went wrong!" },
//       { status: 400 },
//     )
//   }
// }



import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

const na = ["NA", "N/A"]
function getTableName(stateCode?: string | null): string {
// console.log("State Code: ",stateCode)
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    return `college_table_${stateCode.toUpperCase()}`;
  }
  return "college_table_all_india"
}
export async function POST(request: NextRequest) {
  try {
    const {stateCode,...restData} = await request.json()
    const supabase = createAdminSupabaseClient()

    const {
      instituteName,
      instituteType,
      course,
      quota,
      category
    } = restData
const tbaleName = getTableName(stateCode)
    // Check if similar data already exists
const { data: checkData, error: checkError } = await supabase
  .from(tbaleName)
  .select("*")
  .eq("instituteName", instituteName)
  .eq("instituteType", instituteType)
  .eq("course", course)
  .eq("quota", quota)
  .eq("category", category)

if (checkError) {
  console.error("Check query error:", checkError)
  return NextResponse.json(
    { msg: "Error checking data", error: checkError },
    { status: 400 },
  )
}

// Don't insert if already exists
if (checkData?.length > 0) {
  return NextResponse.json(
    { msg: "The Data Already Exists!", data: checkData },
    { status: 200 }, // You can change to 409 (Conflict) if preferred
  )
}


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
  const rawValue = restData?.[check]
  const value =
    typeof rawValue === "string" || typeof rawValue === "number"
      ? String(rawValue).toUpperCase()
      : ""

  restData[assign] = na.includes(value) ? null : restData?.[assign] ?? null
})



    // rankFields.forEach(({ check, assign }) => {
    //   const rawValue = reqData?.[check]
    //   const value =
    //     typeof rawValue === "string" || typeof rawValue === "number"
    //       ? String(rawValue).toUpperCase()
    //       : ""

    //   reqData[assign] = na.includes(value) ? null : reqData?.[assign]
    // })

    // Insert new data
    const { error, data } = await supabase
      .from(tbaleName)
      .insert(restData)
      .select()

    if (error || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Failed to insert data", error, data },
        { status: 400 },
      )
    }

    return NextResponse.json({ data, msg: "Data inserted successfully." })
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}


