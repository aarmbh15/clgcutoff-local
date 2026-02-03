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
    if (stateCode === "All"||stateCode === "all") return "college_table_all_india"
    return `college_table_${stateCode.toUpperCase()}`
  }
  return "college_table_all_india"
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "10")
  const instituteName = searchParams.get("instituteName")
  const stateCode = searchParams.get("stateCode")
  const courseType = searchParams.get("courseType")
  const filterState = searchParams.get("filterState")
  const instituteType = searchParams.get("instituteType")

  const supabase = createAdminSupabaseClient()
  const tableName = getTableName(stateCode)
// console.log("GET DATA: ",tableName,stateCode)

// Pagination
// const from = (page - 1) * pageSize
// const to = from + pageSize - 1

// First run count query separately to avoid "Requested range not satisfiable"
// const { count } = await supabase.from(tableName).select("*", { count: "exact", head: true })

// if (!count || from >= count) {
//   return NextResponse.json({
//     data: [],
//     currentPage: page,
//     pageSize,
//     totalItems: count || 0,
//     totalPages: Math.ceil((count || 0) / pageSize),
//   })
// }
  // Build query
  let query = supabase.from(tableName).select("*", { count: "exact" })

  if (instituteName) {
   query = query.ilike("instituteName", `%${instituteName}%`)
  }
  if (courseType) {
    query = query.eq("courseType", courseType)
  }
  if (instituteType) {
    query = query.eq("instituteType", instituteType)
  }
  if (filterState) {
    query = query.eq("state", filterState)
  }

  // Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
query = query.order("created_at", { ascending: false }).range(from, to)

  const { data,count, error } = await query
console.log(data?.length,count)
  if (error) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: 500 }
    )
  }

  const cleanData =
    data?.map((item) => ({
      id: item.id,
      created_at: item.created_at,
      instituteType: item.instituteType,
      instituteName: item.instituteName,
      quota: item.quota,
      category: item.category,
      course: item.course,
      courseType: item.courseType,
      fees: item.fees,
      subQuota: item.subQuota,
      subCategory: item.subCategory,

      showClosingRankR1: item.closingRankR1
        ? `${item.closingRankR1}/${item.cRR1}`
        : null,
      showClosingRankR2: item.closingRankR2
        ? `${item.closingRankR2}/${item.cRR2}`
        : null,
      showClosingRankR3: item.closingRankR3
        ? `${item.closingRankR3}/${item.cRR3}`
        : null,
      showStrayRound: item.strayRound
        ? `${item.strayRound}/${item.sRR}`
        : null,
      showLastStrayRound: item.lastStrayRound
        ? `${item.lastStrayRound}/${item.lSRR}`
        : null,

      showPrevClosingRankR1: item.prevClosingRankR1
        ? `${item.prevClosingRankR1}/${item.prevCRR1}`
        : null,
      showPrevClosingRankR2: item.prevClosingRankR2
        ? `${item.prevClosingRankR2}/${item.prevCRR2}`
        : null,
      showPrevClosingRankR3: item.prevClosingRankR3
        ? `${item.prevClosingRankR3}/${item.prevCRR3}`
        : null,
      showPrevStrayRound: item.prevStrayRound
        ? `${item.prevStrayRound}/${item.prevSRR}`
        : null,
      showPrevLastStrayRound: item.prevLastStrayRound
        ? `${item.prevLastStrayRound}/${item.prevlSRR}`
        : null,
          ...((stateCode === "all"||stateCode === "All") && { state: item.state }) 
    })) || []

  const totalItems = count || 0
  const totalPages = Math.ceil(totalItems / pageSize)
  return NextResponse.json({
    data: cleanData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  })
}