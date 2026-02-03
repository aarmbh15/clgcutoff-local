import {
  createAdminSupabaseClient,
  createUserSupabaseClient,
} from "@/lib/supabase"
import { isEmpty, isExpired } from "@/utils/utils"
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

const getFilterValues = (param: string[] | string | null): string[] => {
  if (!param) return []

  if (Array.isArray(param)) {
    return param
      .map((item) => item.trim())
      .filter((item) => item && item !== "null" && item !== "undefined")
  }

  return param
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && item !== "null" && item !== "undefined")
}

// Helper: clean rank - valid positive numbers, else Infinity (worst)
function cleanRank(val: any): number {
  const num = Number(val)
  return isNaN(num) || num <= 0 ? Infinity : num
}

// Helper: clean mark - valid positive numbers, else -Infinity (worst)
function cleanMark(val: any): number {
  const num = Number(val)
  return isNaN(num) || num <= 0 ? -Infinity : num
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Pagination parameters
  let page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "20")
  // Search and filter parameters
  const rank = parseInt(searchParams.get("rank") || "0")
  const stateCode = searchParams.get("stateCode") || ""
  const state = searchParams.get("state") || ""
  const rankType = searchParams.get("rankType")?.toString()?.toUpperCase() || ""
  const courseType =
    searchParams.get("courseType")?.toString()?.toUpperCase() || ""
  const course = searchParams.get("course") || ""
  const quota = searchParams.get("quota") || ""
  const category = searchParams.get("category") || ""

  // Get filter values arrays
  const categoryFilter = getFilterValues(searchParams.getAll("category[]"))
  const instituteTypeFilter = getFilterValues(
    searchParams.getAll("instituteType[]"),
  )
  const quotaFilter = getFilterValues(searchParams.getAll("quota[]"))
  const courseFilter = getFilterValues(searchParams.getAll("course[]"))

  const feeFrom = parseInt(searchParams.get("feeFrom") || "0")
  const feeToRaw = searchParams.get("feeTo")
  const feeTo = feeToRaw === null ? Infinity : parseInt(feeToRaw)

  const tableName = getTableName(stateCode)
  const supabase = createAdminSupabaseClient()

  const isPurchase = await checkPurchases(state, course, courseType, rank)

  if (!isPurchase) {
    page = 1
  }

  // Build Supabase query with filters
  let query = supabase
    .from(tableName)
    .select("*")
    .order("created_at", { ascending: false })

  if (courseFilter.length > 0) {
    query = query.in("course", courseFilter)
  } else if (course) {
    if (!course.toLowerCase().includes("all")) {
      query = query.eq("course", course.trim())
    }
  }

  if (courseType) {
    query = query.eq("courseType", courseType)
  }

  if (quotaFilter.length > 0) {
    query = query.in("quota", quotaFilter)
  } else if (quota) {
    query = query.eq("quota", quota)
  }

  if (categoryFilter.length > 0) {
    query = query.in("category", categoryFilter)
  } else if (category) {
    query = query.eq("category", category)
  }

  if (instituteTypeFilter.length > 0) {
    query = query.in("instituteType", instituteTypeFilter)
  }

  if (feeFrom || feeTo !== Infinity) {
    query = query.gte("fees", feeFrom).lte("fees", feeTo)
  }

  // Execute query
  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  const filteredData = data.filter((item, index) => {
    if (rank <= 0) return true

    if (rankType === "RANK") {
      // Prefer current round data first
      const currentFields = [
        item.closingRankR1,
        item.closingRankR2,
        item.closingRankR3,
        item.strayRound,
        item.lastStrayRound,
      ].filter((mark) => mark != null && mark !== "")

      const prevFields = [
        item.prevClosingRankR1,
        item.prevClosingRankR2,
        item.prevClosingRankR3,
        item.prevStrayRound,
        item.prevLastStrayRound,
      ].filter((mark) => mark != null && mark !== "")

      const fieldsToUse = currentFields.length > 0 ? currentFields : prevFields
      if (fieldsToUse.length === 0) return false

      return fieldsToUse.some((mark) => {
        const cleanMarks = cleanMark(mark)
        return cleanMarks > 0 && rank <= cleanMarks
      })
    } else {
      // Marks case
      const currentFields = [
        item.CRR1,
        item.CRR2,
        item.CRR3,
        item.SRR,
        item.lSRR,
      ].filter((mark) => mark != null && mark !== "")

      const prevFields = [
        item.prevCRR1,
        item.prevCRR2,
        item.prevCRR3,
        item.prevSRR,
        item.prevlSRR,
      ].filter((mark) => mark != null && mark !== "")

      const fieldsToUse = currentFields.length > 0 ? currentFields : prevFields
      if (fieldsToUse.length === 0) return false

      return fieldsToUse.some((mark) => {
        const cleanMarks = cleanMark(mark)
        return cleanMarks > 0 && rank >= cleanMarks
      })
    }
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (rankType === "RANK") {
      // Prefer CURRENT ranks if available
      const ranksA = [
        a.lastStrayRound,
        a.strayRound,
        a.closingRankR3,
        a.closingRankR2,
        a.closingRankR1,
      ]
        .map((r) => cleanRank(r))
        .filter((r) => r > 0)

      const ranksB = [
        b.lastStrayRound,
        b.strayRound,
        b.closingRankR3,
        b.closingRankR2,
        b.closingRankR1,
      ]
        .map((r) => cleanRank(r))
        .filter((r) => r > 0)

      const minA =
        ranksA.length > 0
          ? Math.min(...ranksA)
          : Math.min(
              ...[
                a.prevLastStrayRound,
                a.prevStrayRound,
                a.prevClosingRankR3,
                a.prevClosingRankR2,
                a.prevClosingRankR1,
              ]
                .map((r) => cleanRank(r))
                .filter((r) => r > 0),
            )

      const minB =
        ranksB.length > 0
          ? Math.min(...ranksB)
          : Math.min(
              ...[
                b.prevLastStrayRound,
                b.prevStrayRound,
                b.prevClosingRankR3,
                b.prevClosingRankR2,
                b.prevClosingRankR1,
              ]
                .map((r) => cleanRank(r))
                .filter((r) => r > 0),
            )

      return minA - minB // ascending → lower rank = better
    } else {
      // Prefer CURRENT marks if available
      const marksA = [a.lSRR, a.SRR, a.CRR3, a.CRR2, a.CRR1]
        .map((m) => cleanMark(m))
        .filter((m) => m > 0)

      const marksB = [b.lSRR, b.SRR, b.CRR3, b.CRR2, b.CRR1]
        .map((m) => cleanMark(m))
        .filter((m) => m > 0)

      const maxA =
        marksA.length > 0
          ? Math.max(...marksA)
          : Math.max(
              ...[a.prevlSRR, a.prevSRR, a.prevCRR3, a.prevCRR2, a.prevCRR1]
                .map((m) => cleanMark(m))
                .filter((m) => m > 0),
            )

      const maxB =
        marksB.length > 0
          ? Math.max(...marksB)
          : Math.max(
              ...[b.prevlSRR, b.prevSRR, b.prevCRR3, b.prevCRR2, b.prevCRR1]
                .map((m) => cleanMark(m))
                .filter((m) => m > 0),
            )

      return maxB - maxA // descending → higher marks = better
    }
  })

  const responseData = sortedData.map((item) => {
    const baseData = {
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
      ...(stateCode?.toLowerCase() === "all" && { state: item.state }),
    }

    if (isPurchase) {
      return {
        ...baseData,
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
      }
    } else {
      return {
        ...baseData,
        showClosingRankR1: item.closingRankR1
          ? `${item.closingRankR1}/${item.cRR1}`
          : null,
        showClosingRankR2: null,
        showClosingRankR3: null,
        showStrayRound: null,
        showLastStrayRound: null,

        showPrevClosingRankR1: item.prevClosingRankR1
          ? `${item.prevClosingRankR1}/${item.prevCRR1}`
          : null,
        showPrevClosingRankR2: null,
        showPrevClosingRankR3: null,
        showPrevStrayRound: null,
        showPrevLastStrayRound: null,
      }
    }
  })

  let totalItems
  let totalPages
  let paginatedData

  if (isPurchase) {
    totalItems = responseData.length
    totalPages = Math.ceil(totalItems / pageSize)
    paginatedData = responseData.slice((page - 1) * pageSize, page * pageSize)
  } else {
    totalItems = responseData.length
    totalPages = 1
    paginatedData = responseData.slice(0, 5)
  }
  // console.log(paginatedData)
  return NextResponse.json({
    data: paginatedData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
    isPurchase,
  })
}

async function checkPurchases(
  state: any,
  course: string,
  courseType: string,
  rank: number,
) {
  const supabaseUser = createUserSupabaseClient()

  const {
    data: { user },
  } = await supabaseUser.auth.getUser()
  let isPurchase = false
  if (user) {
    const { data: userPurchases, error: purchasesError } = await supabaseUser
      .from("purchase")
      .select("*")
      .eq("phone", user.phone)
      .eq("payment_type", "RANK_COLLEGE_PREDICTOR")

    if (purchasesError) {
      console.error("Supabase error:", purchasesError.message)
      return NextResponse.json(
        {
          error: "Failed to fetch user purchases",
          details: purchasesError.message,
        },
        { status: 500 },
      )
    }

    // console.log("Purchase: ", userPurchases)
    if (userPurchases && userPurchases?.length > 0) {
      for (let i = 0; i < userPurchases.length; i++) {
        const purchase = userPurchases[i]

        if (
          purchase.payment_type === "RANK_COLLEGE_PREDICTOR" &&
          !isExpired(purchase.created_at, 6) &&
          isPredictorPurchased(purchase.college_predictor_details, {
            state,
            rank,
            course,
            courseType,
          })
        ) {
          isPurchase = true
          break
        }
      }
    }
  }
  return isPurchase
}

function isPredictorPurchased(purchase: any, data: any) {
  const { course, rank, state, courseType } = data
  // console.log(purchase,data)
  if (purchase?.course === "All Course") {
    return (
      purchase?.state === state &&
      purchase?.rank === String(rank) &&
      purchase?.courseType === courseType
    )
  }
  return (
    purchase?.state === state &&
    purchase?.rank === String(rank) &&
    purchase?.course === course &&
    purchase?.courseType === courseType
  )
}

