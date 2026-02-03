import {
  createAdminSupabaseClient,
  createUserSupabaseClient,
} from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
function getTableName(stateCode?: string | null): string {
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    if(stateCode==="all") return "college_table_all_india"
    return `college_table_${stateCode.toUpperCase()}`;
  }
  return "college_table_all_india"
}
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "10")

  if (page < 1 || pageSize < 1) {
    return NextResponse.json(
      { error: "Page and pageSize must be positive integers" },
      { status: 400 },
    )
  }

  let body: any

  try {
    body = await request.json()


    // console.log("Received Data; ",body)
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    )
  }

  const college = body.closingRankCollege
  // console.log("BODY: ",body)
  const stateCode = body.stateCode
    const tableName = getTableName(stateCode)
  if (
    !college?.instituteName ||
    !college?.instituteType ||
    !college?.courseType 
  ) {
    return NextResponse.json(
      {
        error:
          "All fields (instituteName, instituteType, courseType) are required",
      },
      { status: 400 },
    )
  }

  const supabaseUser = createUserSupabaseClient()

// ✅ Step 1: Fetch filtered data (based on courseType and course)
// let countQuery = supabaseUser
//   .from(tableName)
//   .select("instituteName") // only fetch what we need
//   .not("instituteName", "is", null)

// if (college?.courseType) {
//   countQuery = countQuery.eq("courseType", college?.courseType)
// }

// if (college?.courseType?.toUpperCase().includes("UG") && college?.course) {
//   countQuery = countQuery.eq("course", college?.course)
// }

// // ✅ Step 2: Execute the query
// const { data: filteredRows, error: countErrorr } = await countQuery

// if (countErrorr) {
//   console.error("Error fetching filtered rows:", countErrorr.message)
// }

// // ✅ Step 3: Count unique colleges
// const uniqueCollegeNames = new Set(filteredRows?.map(row => row.instituteName))
// // console.log("filteredRows",{uniqueCollegeNames,filteredRows:filteredRows?.length,courseType:college?.courseType,course:college?.course})
// const totalFilteredCount = uniqueCollegeNames.size


// if (college?.instituteName) {
//   countQuery = countQuery.eq("instituteName", college?.instituteName)
// }

// const { count, error: countError } = await countQuery
// if (countError) {
//   console.error("Error fetching filtered count:", countError.message)
// }





  // ✅ Step 1: Fetch unique college count using your PL/pgSQL function
  const { data: uniqueCountData, error: uniqueCountError } =
    await supabaseUser.rpc("get_unique_colleges_data", {
      p_table_name: tableName,
      p_course_type: college.courseType,
      p_course:
        college.courseType?.toUpperCase().includes("UG") && college.course
          ? college.course
          : null,
      // p_institute_type: college.instituteType,
      // p_state: stateCode === "all" ? null : college.state || null,
    });

  if (uniqueCountError) {
    console.error("Error fetching unique college count:", uniqueCountError);
  }

  const totalFilteredCount =
    uniqueCountData?.total_table_count || uniqueCountData?.unique_college_count || 0;

console.log("asdf",totalFilteredCount)
let query = supabaseUser
  .from(tableName)
  .select("*")
  .eq("instituteName", college.instituteName)
  .eq("instituteType", college.instituteType)
  .eq("courseType", college.courseType)
  // .eq("state", college.state)
  // .in("year", latestYears)
  .order("created_at", { ascending: false });
// Only apply course filter if provided
if (college.course && college.course.trim() !== "") {
  query = query.eq("course", college.course.trim());
}

const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

 const cleanData = data &&data.map(item=>
  ({
    id: item.id,
    created_at : item.created_at,
    instituteType:item.instituteType,
    instituteName:item.instituteName,
    quota:item.quota,
    category:item.category,
    course:item.course,
    courseType:item.courseType,
    fees:item.fees,
    subQuota:item.subQuota,
    subCategory:item.subCategory,

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
  ...(stateCode === "all" && { state: item.state }) 
      
    }))
  // })

  // Pagination
  const totalItems = cleanData?.length||0
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedData = cleanData.slice((page - 1) * pageSize, page * pageSize)
// console.log("Data: ",{
//     data: paginatedData,
//     currentPage: page,
//     pageSize,
//     totalItems,
//     totalPages,
//   })
  return NextResponse.json({
    data: paginatedData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
    totalTableCount: totalFilteredCount ?? 0,
  })
}
