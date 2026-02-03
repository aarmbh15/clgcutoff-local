
// import { NextRequest, NextResponse } from "next/server"
// import { createAdminSupabaseClient } from "@/lib/supabase"

// export async function GET(request: NextRequest) {
//   const supabase = createAdminSupabaseClient()
//   const { searchParams } = new URL(request.url)

// const stateCodeParam = searchParams.get('stateCode')||null;
// const stateCode = stateCodeParam && stateCodeParam !== 'null' ? stateCodeParam : null;

// const tableName = stateCode
//   ? `college_table_${stateCode}`
//   : 'college_table_all_india';


// const { data, error } = await supabase
//   .from(tableName)
//  .select('quota, "subQuota", category, "subCategory", "courseType"')
// // console.log("Table",tableName,data)

//   if (error) {
//     console.error("Supabase Error:", error)
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//   }

//   return NextResponse.json({ success: true, data })
// }




import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

/**
 * Helper to fetch all rows from Supabase in chunks (scalable)
 */
async function fetchAllRows(supabase: any, tableName: string, columns: string, chunkSize = 1000) {
  let allData: any[] = []
  let from = 0
  let to = chunkSize - 1
  let hasMore = true

  while (hasMore) {
    const { data, error, count } = await supabase
      .from(tableName)
      .select(columns, { count: "exact" }) // count helps us know total rows
      .range(from, to)

    if (error) {
      throw error
    }

    if (data && data.length > 0) {
      allData = [...allData, ...data]
      from += chunkSize
      to += chunkSize
      hasMore = allData.length < (count ?? 0)
    } else {
      hasMore = false
    }
  }

  return allData
}

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient()
  const { searchParams } = new URL(request.url)

  const stateCodeParam = searchParams.get("stateCode") || null
  const stateCode = stateCodeParam && stateCodeParam !== "null" ? stateCodeParam : null

  const tableName = stateCode ? `college_table_${stateCode}` : "college_table_all_india"

  try {
    const data = await fetchAllRows(
      supabase,
      tableName,
      `quota, "subQuota", category, "subCategory", "courseType"`
    )

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Supabase Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
