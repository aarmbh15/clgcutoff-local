import { createAdminSupabaseClient,createUserSupabaseClient} from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
function getTableName(stateCode?: string | null): string {
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    if(stateCode==="all")
     return `college_table_all_india`
    return `college_table_${stateCode.toUpperCase()}`
  }
  return "college_table_all_india"
}
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const instituteName = searchParams.get("instituteName")?.trim()
  const courseType = searchParams.get("courseType")?.trim()
  const course = searchParams.get("course")?.trim()
  const dataCheckMode = searchParams.get("dataCheckMode")
  const stateCode = searchParams.get("stateCode")
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "20")
  const filterState = searchParams.get("filterState")
  const instituteType = searchParams.get("instituteType")


  // console.log("State Code: ",stateCode)
  const state = searchParams.get("state")

  const supabase = createAdminSupabaseClient()
const tableName = getTableName(stateCode)


  // ✅ Step 1: Fetch unique college count using your PL/pgSQL function
  const { data: uniqueCountData, error: uniqueCountError } =
    await supabase.rpc("get_unique_colleges_data", {
      p_table_name: tableName,
      p_course_type: courseType,
      p_course:
        courseType?.toUpperCase().includes("UG") && course
          ? course
          : null,
      // p_institute_type: college.instituteType,
      // p_state: stateCode === "all" ? null : college.state || null,
    });

  if (uniqueCountError) {
    console.error("Error fetching unique college count:", uniqueCountError);
  }

  const totalFilteredCount =
    uniqueCountData?.total_table_count || uniqueCountData?.unique_college_count || 0;


  const { data: selectedYear, error: yearsError } = await supabase
    .from("dropdown_options")
    .select("*")
    .eq("type", "CONFIG_YEAR")
    .single()

  if (yearsError) {
    return NextResponse.json(
      {
        msg: "Failed to get year config",
        error: yearsError,
        data: selectedYear,
      },
      { status: 400 },
    )
  }

  // const latestYears = selectedYear.text
  //   ?.split("-")
  //   .map((item: string) => item.trim())
// console.log("tablename and instituteName",tableName,instituteName)
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
  // const {data:resData,error:err} = await supabase
  //   .from(tableName)
  //   .select("*")
  //   .ilike("instituteName", `%${instituteName}%`)
  //   .eq("courseType", courseType)

  // const { data, error } = await query.order("created_at", { ascending: false })

    // Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.order("created_at", { ascending: false }).range(from, to)

  const { data, error, count } = await query
  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  if (dataCheckMode) {
    const hasData = data?.length > 0
    return NextResponse.json({ hasData,totalTableCount: totalFilteredCount ?? 0 })
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

        showClosingRankR1:(item.closingRankR1 ? `${item.closingRankR1}/${item.cRR1}` :null),
        showClosingRankR2:(item.closingRankR2 ? `${item.closingRankR2}/${item.cRR2}` :null),
        showClosingRankR3:(item.closingRankR3 ? `${item.closingRankR3}/${item.cRR3}` :null),
        showStrayRound: (item.strayRound ? `${item.strayRound }/${item.sRR}` :null),
        showLastStrayRound: (item.lastStrayRound ? `${item.lastStrayRound}/${item.slRR}` :null),
        
        showPrevClosingRankR2:(item.prevClosingRankR1 ? `${item.prevClosingRankR1}/${item.prevCRR1}` :null),
        showPrevClosingRankR1:(item.prevClosingRankR2 ? `${item.prevClosingRankR2}/${item.prevCRR2}` :null),
        showPrevClosingRankR3:(item.prevClosingRankR3 ? `${item.prevClosingRankR3}/${item.prevCRR3}` :null),
        showPrevStrayRound: (item.strayRound ? `${item.strayRound}/${item.prevSRR}` :null),
        showPrevLastStrayRound: (item.lastStrayRound ? `${item.lastStrayRound}/${item.prevlSRR}` :null),
         ...((stateCode === "all" ||stateCode === "All" )&& { state: item.state }) 
      
    }))

  const totalItems = count || 0
  const totalPages = Math.ceil(totalItems / pageSize)
  // Return all merged data
  return NextResponse.json({
    data: cleanData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
    totalTableCount: totalFilteredCount ?? 0 
  })
}

