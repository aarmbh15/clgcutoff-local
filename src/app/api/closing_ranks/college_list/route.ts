// import {
//   createAdminSupabaseClient,
//   createUserSupabaseClient,
// } from "@/lib/supabase"
// import { isExpired } from "@/utils/utils"
// import { addMonths, isBefore, parseISO } from "date-fns"
// import { toZonedTime } from "date-fns-tz"
// import { NextRequest, NextResponse } from "next/server"
// export const dynamic = "force-dynamic"
// function getTableName(stateCode?: string | null): string {
//   if (
//     stateCode &&
//     stateCode !== "null" &&
//     stateCode !== "undefined" &&
//     stateCode !== ""
//   ) {
//     if (stateCode === "all") return `college_table_all_india`
//     return `college_table_${stateCode.toUpperCase()}`
//   }
//   return "college_table_all_india"
// }
// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   const page = parseInt(searchParams.get("page") || "1")
//   const pageSize = parseInt(searchParams.get("size") || "10")
//   const state = searchParams.get("state")?.trim()
//   const filterState = searchParams.get("filterState")?.trim()
//   const courseType = searchParams.get("courseType")?.trim() || ""
//   const course = searchParams.get("course")?.trim() || ""
//   const stateCode = searchParams.get("stateCode")?.trim()
//   const instituteType = searchParams.get("instituteType")?.trim()
//   if (page < 1 || pageSize < 1) {
//     return NextResponse.json(
//       { error: "Page and pageSize must be positive integers" },
//       { status: 400 },
//     )
//   }
//   if (pageSize > 100) {
//     return NextResponse.json(
//       { error: "pageSize cannot exceed 100" },
//       { status: 400 },
//     )
//   }
//   const supabase = createAdminSupabaseClient()
//   const from = (page - 1) * pageSize
//   const to = from + pageSize - 1
//   const tableName = getTableName(stateCode)
//   const { data, error } = await supabase.rpc("get_unique_colleges_data", {
//     p_table_name: tableName,
//     p_course_type: courseType,
//     p_course: course && course !== "" ? course : null,
//     p_institute_type:
//       instituteType && instituteType !== "" ? instituteType : null,
//     p_state: filterState && filterState !== "" ? filterState : null,
//   })
// // console.log("Data: ",data)
//   if (error) {
//     console.error("Supabase  error:", error.message)
//     return NextResponse.json(
//       { error: "Failed to fetch grouped colleges", details: error.message },
//       { status: 500 },
//     )
//   }
//   console.log(data,)
//   let colleges = data || []
//   if (stateCode?.toLowerCase() === "all") {
//     colleges = colleges.sort((a: any, b: any) =>
//       (a.state || "").localeCompare(b.state || ""),
//     )
//   }
//   const res = await checkPurchases(
//     colleges,
//     // filteredData,
//     from,
//     to,
//     state,
//     page,
//     pageSize,
//     course,
//     courseType,
//   )
//   // console.log("Data: ",data?.total_table_count)
//   return NextResponse.json({...res,total_count:data&&data[0].total_table_count||0})
// }
// async function checkPurchases(
//   data: any[],
//   from: number,
//   to: number,
//   state: any,
//   page: number,
//   pageSize: number,
//   course: string,
//   courseType: string,
// ) {
//   const supabaseUser = createUserSupabaseClient()
//   const paginated = data?.slice(from, to + 1)
//   const totalItems = data?.length
//   const totalPages = Math.ceil(totalItems / pageSize)
//   let hiddenData = paginated
//   const {
//     data: { user },
//   } = await supabaseUser.auth.getUser()
//   if (user) {
//     const { data: userPurchases, error: purchasesError } = await supabaseUser
//       .from("purchase")
//       .select("*")
//       .eq("phone", user.phone)
//     if (purchasesError) {
//       console.error("Supabase error:", purchasesError.message)
//       return NextResponse.json(
//         {
//           error: "Failed to fetch user purchases",
//           details: purchasesError.message,
//         },
//         { status: 500 },
//       )
//     }
//     const timeZone = "Asia/Kolkata"
//     const currentDate = toZonedTime(new Date(), timeZone)
//     const hasValidStatePurchase = userPurchases.some((purchase) => {
//       const purchase_state = purchase?.closing_rank_details?.state
//       const purchase_courseType = purchase?.closing_rank_details?.courseType
//       const purchaseDate = parseISO(purchase.created_at)
//       const expiryDate = addMonths(purchaseDate, 6)
//       return (
//         (purchase.payment_type === "STATE_CLOSING_RANK" ||
//           purchase.payment_type === "ALL_INDIA_CLOSING_RANK") &&
//         purchase_state === state &&
//         isBefore(currentDate, expiryDate)
//       )
//     })
//     if (hasValidStatePurchase) {
//       hiddenData = paginated
//       for (let i = 0; i < hiddenData.length; i++) {
//         hiddenData[i].purchased = true
//         hiddenData[i].statePurchased = true
//       }
//     } else {
//       hiddenData = hiddenData.map((college: any) => {
//         const matchingPurchase = userPurchases.find((p) => {
//           const purchaseDate = parseISO(p.created_at)
//           const expiryDate = addMonths(purchaseDate, 6)
//           return (
//             p.payment_type === "SINGLE_COLLEGE_CLOSING_RANK" &&
//             isBefore(currentDate, expiryDate) &&
//             isCollegePurchased(college, p.closing_rank_details)
//           )
//         })
//         return matchingPurchase ? { ...college, purchased: true } : college
//       })
//     }
//   }
//   return {
//     data: hiddenData,
//     currentPage: page,
//     pageSize,
//     totalItems,
//     totalPages,
//   }
// }
// function isCollegePurchased(college: any, userCollege: any) {
//   const { instituteName, instituteType, courseType } = userCollege
//   return (
//     college.instituteName === instituteName &&
//     college.instituteType === instituteType &&
//     college.courseType === courseType
//   )
// }
import {
  createAdminSupabaseClient,
  createUserSupabaseClient,
} from "@/lib/supabase"
import { addMonths, isBefore, parseISO } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function getTableName(stateCode?: string | null): string {
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    if (stateCode.toLowerCase() === "all") return "college_table_all_india"
    return `college_table_${stateCode.toUpperCase()}`
  }
  return "college_table_all_india"
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "10")
  const state = searchParams.get("state")?.trim()
  const filterState = searchParams.get("filterState")?.trim()
  const courseType = searchParams.get("courseType")?.trim() || ""
  const course = searchParams.get("course")?.trim() || ""
  const stateCode = searchParams.get("stateCode")?.trim()
  const instituteType = searchParams.get("instituteType")?.trim()

  if (page < 1 || pageSize < 1)
    return NextResponse.json(
      { error: "Page and pageSize must be positive integers" },
      { status: 400 },
    )

  if (pageSize > 100)
    return NextResponse.json(
      { error: "pageSize cannot exceed 100" },
      { status: 400 },
    )

  const supabase = createAdminSupabaseClient();
  const tableName = getTableName(stateCode)

  // Call the RPC function
  const { data: rpcResult, error } = await supabase.rpc(
    "get_unique_colleges_data",
    {
      p_table_name: tableName,
      p_course_type: courseType || null,
      p_course: course && course !== "" ? course : null,
      p_institute_type:
        instituteType && instituteType !== "" ? instituteType : null,
      p_state: filterState && filterState !== "" ? filterState : null,
    },
  )
  // Call the RPC function
  const { data: rpcResultd, error:err } = await supabase.rpc(
    "get_unique_colleges_data",
    {
      p_table_name: tableName,
      p_course_type: courseType || null,
      p_course: course && course !== "" ? course : null,
    },
  )

  if (error) {
    console.error("Supabase RPC error:", error.message)
    return NextResponse.json(
      { error: "Failed to fetch colleges", details: error.message },
      { status: 500 },
    )
  }

  // rpcResult is a JSON object: { data: [...], total_table_count: number }
  const allData = rpcResult?.data || []
  const totalTableCount = rpcResultd?.total_table_count || 0
console.log("test",totalTableCount)
  // Sort by state if all states
  if (stateCode?.toLowerCase() === "all") {
    allData.sort((a: any, b: any) =>
      (a.state || "").localeCompare(b.state || ""),
    )
  }

  // Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize
  let paginatedData = allData.slice(from, to)

  // Handle purchases
  paginatedData = await markPurchased(paginatedData, state, course, courseType)

  const totalItems = allData.length
  const totalPages = Math.ceil(totalItems / pageSize)

  return NextResponse.json({
    data: paginatedData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
    total_table_count: totalTableCount, // Total rows in table
  })
}

async function markPurchased(
  data: any[],
  state: string | undefined,
  course: string,
  courseType: string,
) {
  const supabaseUser = createUserSupabaseClient()
  const {
    data: { user },
  } = await supabaseUser.auth.getUser()

  if (!user) return data

  const { data: purchases, error } = await supabaseUser
    .from("purchase")
    .select("*")
    .eq("phone", user.phone)

  if (error) {
    console.error("Error fetching user purchases:", error.message)
    return data
  }

  const timeZone = "Asia/Kolkata"
  const currentDate = toZonedTime(new Date(), timeZone)

  return data.map((college) => {
    let purchased = false
    let statePurchased = false

    purchases.forEach((p) => {
      const purchaseDate = parseISO(p.created_at)
      const expiryDate = addMonths(purchaseDate, 6)

      if (isBefore(currentDate, expiryDate)) {
        // if (
        //   (p.payment_type === "STATE_CLOSING_RANK" ||
        //    ( p.payment_type === "ALL_INDIA_CLOSING_RANK") &&
        //     p.closing_rank_details?.state === state)
        // ) {

        if (
          (p.payment_type === "STATE_CLOSING_RANK" ||
            p.payment_type === "ALL_INDIA_CLOSING_RANK") &&
          p.closing_rank_details?.state === state
        ) {
          if (college.courseType?.toUpperCase().includes("UG")) {
            if (
              course &&
              course === p.closing_rank_details.course &&
              courseType &&
              courseType === p.closing_rank_details.courseType
            ) {
              purchased = true
              statePurchased = true
            }
          } else {
            if (
              courseType &&
              courseType === p.closing_rank_details.courseType
            ) {
              purchased = true
              statePurchased = true
            }
          }
        } else if (
          p.payment_type === "SINGLE_COLLEGE_CLOSING_RANK" &&
          isCollegePurchased(college, p.closing_rank_details)
        ) {
          purchased = true
        }
      }
    })

    return { ...college, purchased, statePurchased }
  })
}

function isCollegePurchased(college: any, purchaseDetails: any) {
  if (!purchaseDetails) return false
  return (
    college.instituteName === purchaseDetails.instituteName &&
    college.instituteType === purchaseDetails.instituteType &&
    college.courseType === purchaseDetails.courseType
  )
}

