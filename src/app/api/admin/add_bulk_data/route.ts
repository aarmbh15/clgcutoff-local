
// import { createAdminSupabaseClient } from "@/lib/supabase"
// import { NextRequest, NextResponse } from "next/server"

// type CollegeRow = {
//   instituteName: string
//   instituteType: string
//   course: string
//   quota: string
//   category: string
//   subQuota?: string | null
//   subCategory?: string | null
//   [key: string]: any
// }

// type BatchStats = {
//   batchNum: number
//   inserted: number
//   updated: number
//   failed: number
//   total: number
//   logs: string[]
//   errors: { record: number; error: string; data: CollegeRow }[]
// }

// type SkippedDuplicate = {
//   index: number
//   row: CollegeRow
//   conflictKey: Record<string, any>
// }

// type InvalidRow = {
//   index: number
//   reason: string
//   row: CollegeRow
// }

// function getTableName(stateCode?: string | null): string {
//   if (stateCode) {
//     if (stateCode == "All" || stateCode === "all")
//       return "college_table_all_india"
//     return `college_table_${stateCode.toUpperCase()}`
//   } else {
//     return "college_table_all_india"
//   }
// }

// function cleanAndTrimValue(value: any): any {
//   if (value === "" || value === null || value === undefined) return null
//   if (typeof value === "string") {
//     return value.trim().replace(/\s+/g, " ")
//   }
//   if (!isNaN(Number(value)) && typeof value !== "boolean") {
//     return Number(value)
//   }
//   return value
// }

// function cleanAndTrimObject(obj: Record<string, any>): Record<string, any> {
//   const cleaned: Record<string, any> = {}
//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       cleaned[key] = cleanAndTrimValue(obj[key])
//     }
//   }
//   return cleaned
// }
// // function normalizeForDB(value: string | null | undefined) {
// //   if (value === null || value === undefined || value === '') return null;
// //   return value.trim();
// // }
// // function getConflictKey(row: CollegeRow): Record<string, any> {
// //   const baseKey = {
// //     instituteName: cleanAndTrimValue(row.instituteName),
// //     instituteType: cleanAndTrimValue(row.instituteType),
// //     quota: cleanAndTrimValue(row.quota),
// //     category: cleanAndTrimValue(row.category),
// //     course: cleanAndTrimValue(row.course),
// //     courseType: cleanAndTrimValue(row.courseType),
// //   }

// //   const subQuota = normalizeForDB(row.subQuota)
// //   const subCategory = normalizeForDB(row.subCategory)

// //   if (subQuota && subCategory) {
// //     return { ...baseKey, subQuota, subCategory }
// //   } else if (subQuota) {
// //     return { ...baseKey, subQuota }
// //   } else if (subCategory) {
// //     return { ...baseKey, subCategory }
// //   }
// //   return baseKey
// // }

// function normalizeForConflict(value: string | null | undefined) {
//   // Treat empty string and null as same
//   return !value ? null : value.trim()
// }

// function getConflictKey(row: CollegeRow) {
//   return {
//     instituteName: row.instituteName.trim(),
//     instituteType: row.instituteType.trim(),
//     quota: row.quota.trim(),
//     category: row.category.trim(),
//     course: row.course.trim(),
//     courseType: row.courseType.trim(),
//     subQuota: normalizeForConflict(row.subQuota),
//     subCategory: normalizeForConflict(row.subCategory),
//   }
// }


const updatableRoundFields = [
  "fees",
  "closingRankR1",
  "closingRankR2",
  "closingRankR3",
  "strayRound",
  "lastStrayRound",
  "cRR1",
  "cRR2",
  "cRR3",
  "sRR",
  "lSRR",
  "prevClosingRankR1",
  "prevClosingRankR2",
  "prevClosingRankR3",
  "prevStrayRound",
  "prevLastStrayRound",
  "prevCRR1",
  "prevCRR2",
  "prevCRR3",
  "prevSRR",
  "prevlSRR",
]

async function getRoundUpdateData(
  rawRow: Record<string, any>,
  existing: Record<string, any>,
): Promise<Partial<CollegeRow>> {
  const updateData: Partial<CollegeRow> = {}

  for (const field of updatableRoundFields) {
    if (Object.prototype.hasOwnProperty.call(rawRow, field)) {
      const val = rawRow[field]

      if (val !== null && val !== "" && val !== undefined) {
        // ✅ take new value if provided
        updateData[field as keyof CollegeRow] = cleanAndTrimValue(val)
      } else {
        // ✅ if null/empty → fallback to existing DB value
        if (existing && existing[field] !== undefined) {
          updateData[field as keyof CollegeRow] = existing[field]
        }
      }
    }
  }

  return updateData
}

// // function getConflictKey(row: CollegeRow): Record<string, any> {
// //   const baseKey = {
// //     instituteName: cleanAndTrimValue(row.instituteName),
// //     instituteType: cleanAndTrimValue(row.instituteType),
// //     quota: cleanAndTrimValue(row.quota),
// //     category: cleanAndTrimValue(row.category),
// //     course: cleanAndTrimValue(row.course),
// //     courseType: cleanAndTrimValue(row.courseType),
// //   }
// //   if (row.subQuota && row.subCategory) {
// //     return {
// //       ...baseKey,
// //       subQuota: cleanAndTrimValue(row.subQuota),
// //       subCategory: cleanAndTrimValue(row.subCategory),
// //     }
// //   } else if (row.subQuota) {
// //     return {
// //       ...baseKey,
// //       subQuota: cleanAndTrimValue(row.subQuota),
// //     }
// //   } else if (row.subCategory) {
// //     return {
// //       ...baseKey,
// //       subCategory: cleanAndTrimValue(row.subCategory),
// //     }
// //   }
// //   return baseKey
// // }

// const BATCH_SIZE = 100

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     const { data, counsellingType, stateCode } = body as {
//       data: CollegeRow[]
//       counsellingType: string | number
//       stateCode?: string | null
//     }

//     if (!data?.length) {
//       return NextResponse.json({ error: "No data provided" }, { status: 400 })
//     }
//     if (!counsellingType) {
//       return NextResponse.json(
//         { error: "Missing counsellingType" },
//         { status: 400 },
//       )
//     }

//     let tableName: string
//     try {
//       tableName = getTableName(stateCode)
//     } catch (err) {
//       return NextResponse.json(
//         { error: err instanceof Error ? err.message : String(err) },
//         { status: 400 },
//       )
//     }

//     const supabase = createAdminSupabaseClient()

//     // Deduplicate by conflict key
//     const seen = new Set<string>()
//     const dedupedRows: CollegeRow[] = []
//     const invalidRowsBeforeInsert: InvalidRow[] = []
//     const requiredFields = [
//       "instituteName",
//       "instituteType",
//       "course",
//       "quota",
//       "category",
//       "courseType",
//     ]
//     const skippedDueToDuplicate: SkippedDuplicate[] = []

//     for (let i = 0; i < data.length; i++) {
//       const row = data[i]
//       const cleanedRow = cleanAndTrimObject(row)

//       const missingFields = requiredFields.filter((field) => !cleanedRow[field])
//       if (missingFields.length > 0) {
//         invalidRowsBeforeInsert.push({
//           index: i + 1,
//           reason: `Missing required fields: ${missingFields.join(", ")}`,
//           row,
//         })
//         continue
//       }

//       const conflictKey = getConflictKey(cleanedRow)
//       const key = JSON.stringify(conflictKey)

//       if (!seen.has(key)) {
//         seen.add(key)
//         dedupedRows.push(cleanedRow)
//       } else {
//         skippedDueToDuplicate.push({
//           index: i + 1,
//           row: cleanedRow,
//           conflictKey,
//         })
//         console.warn(
//           `⚠️ Skipped duplicate at index ${i + 1} with conflict key:`,
//           conflictKey,
//         )
//       }
//     }

//     const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE)
//     const allBatchStats: BatchStats[] = []
//     const updatedRows: {
//       index: number
//       row: CollegeRow
//       conflictKey: Record<string, any>
//     }[] = []
//     const insertedRows: {
//       index: number
//       row: CollegeRow
//       conflictKey: Record<string, any>
//     }[] = []

//     for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
//       const startIdx = batchNum * BATCH_SIZE
//       const endIdx = Math.min(startIdx + BATCH_SIZE, dedupedRows.length)
//       const batchRows = dedupedRows.slice(startIdx, endIdx)

//       let inserted = 0
//       let updated = 0
//       let failed = 0
//       const logs: string[] = []
//       const errors: { record: number; error: string; data: CollegeRow }[] = []

//       for (let i = 0; i < batchRows.length; i++) {
//         const row = batchRows[i]
//         const recordNum = startIdx + i + 1
//         const logPrefix = `Batch ${batchNum + 1} - Record ${recordNum}/${dedupedRows.length}`

//         try {
//           const conflictKey = getConflictKey(row)
//           const cleanData: CollegeRow = Object.fromEntries(
//             Object.entries(row)
//               .filter(([key]) => key !== "id")
//               .map(([key, value]) => [key, cleanAndTrimValue(value)]),
//           ) as CollegeRow;
// //           const cleanData: CollegeRow = {
// //   ...row,
// //   subQuota: normalizeForDB(row.subQuota),
// //   subCategory: normalizeForDB(row.subCategory),
// //   ...Object.fromEntries(
// //     Object.entries(row)
// //       .filter(([key]) => key !== "id" && key !== "subQuota" && key !== "subCategory")
// //       .map(([key, value]) => [key, cleanAndTrimValue(value)])
// //   ),
// // }
// // console.log(conflictKey,i)
// // console.log({subCategory:conflictKey.subCategory,subQuota:conflictKey.subQuota})
//           // Try to find existing record by unique key
//           const { data: existing } = await supabase
//             .from("college_table_test")
//             .select("*")
//             .match(conflictKey)
//             .maybeSingle()
            
//           if (existing?.id) {
//             console.log(existing)
//             const roundUpdateData = await getRoundUpdateData(row, existing)

//             if (Object.keys(roundUpdateData).length > 0) {
//               const { error } = await supabase
//                 .from("college_table_test")
//                 .update(roundUpdateData)
//                 .eq("id", existing.id)

//               if (error) throw error

//               const msg = `${logPrefix} - ✅ UPDATED ROUNDS DATA: ${JSON.stringify(conflictKey)}`
//               updated++
//               logs.push(msg)
//               updatedRows.push({ index: recordNum, row, conflictKey })
//               console.log(msg)
//             } else {
//               const msg = `${logPrefix} - ⚠️ No valid round fields provided, skipping update`
//               logs.push(msg)
//               console.log(msg)
//             }
//           } else {
//             // Insert new record
//             const { error } = await supabase.from("college_table_test").insert(cleanData)

//             if (error) throw error

//             const msg = `${logPrefix} - 🆕 INSERTED: ${JSON.stringify((conflictKey))}`
//             inserted++
//             logs.push(msg)
//             insertedRows.push({ index: recordNum, row, conflictKey })
//             console.log(msg)
//           }
//         } catch (error: any) {
//           failed++
//           const errorMsg =
//             error instanceof Error
//               ? error.message
//               : typeof error === "object" && error !== null
//                 ? JSON.stringify(error)
//                 : String(error)

//           const failMsg = `${logPrefix} - ❌ Failed: ${errorMsg}`
//           logs.push(failMsg)
//           errors.push({
//             record: recordNum,
//             error: errorMsg,
//             data: row,
//           })

//           console.error(failMsg)
//         }
//       }

//       // Batch summary
//       const batchStats: BatchStats = {
//         batchNum: batchNum + 1,
//         inserted,
//         updated,
//         failed,
//         total: batchRows.length,
//         logs,
//         errors,
//       }

//       allBatchStats.push(batchStats)
//       console.log(`\n📦 Batch ${batchNum + 1} Summary:`)
//       console.log(`🆕 Inserted: ${inserted}`)
//       console.log(`🔄 Updated: ${updated}`)
//       console.log(`❌ Failed: ${failed}`)
//       console.log(`📋 Total in Batch: ${batchRows.length}`)
//     }

//     // Final summary
//     const totalInserted = allBatchStats.reduce((sum, b) => sum + b.inserted, 0)
//     const totalUpdated = allBatchStats.reduce((sum, b) => sum + b.updated, 0)
//     const totalFailed = allBatchStats.reduce((sum, b) => sum + b.failed, 0)

//     console.log("\n📊 Final Summary:")
//     console.log(`🆕 Inserted: ${totalInserted}`)
//     console.log(`🔄 Updated: ${totalUpdated}`)
//     console.log(`❌ Failed: ${totalFailed}`)
//     console.log(`📋 Total Processed: ${dedupedRows.length}`)

//     return NextResponse.json({
//       success: totalFailed === 0,
//       inserted: totalInserted,
//       updated: totalUpdated,
//       failed: totalFailed,
//       total: dedupedRows.length,
//       batchStats: allBatchStats,
//       skippedDueToDuplicate,
//       updatedRows,
//       insertedRows,
//       invalidBeforeInsert: invalidRowsBeforeInsert,
//     })
//   } catch (err: any) {
//     console.error("💥 Server-level error:", err)
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Server error",
//         details: err instanceof Error ? err.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }








// import { createAdminSupabaseClient } from "@/lib/supabase"
// import { NextRequest, NextResponse } from "next/server"

// type CollegeRow = {
//   instituteName: string
//   instituteType: string
//   course: string
//   quota: string
//   category: string
//   subQuota?: string | null
//   subCategory?: string | null
//   [key: string]: any
// }

// type BatchStats = {
//   batchNum: number
//   inserted: number
//   updated: number
//   failed: number
//   total: number
//   logs: string[]
//   errors: { record: number; error: string; data: CollegeRow }[]
// }

// type SkippedDuplicate = {
//   index: number
//   row: CollegeRow
//   conflictKey: Record<string, any>
// }

// type InvalidRow = {
//   index: number
//   reason: string
//   row: CollegeRow
// }

// function getTableName(stateCode?: string | null): string {
//   if (stateCode) {
//     if (stateCode == "All" || stateCode === "all")
//       return "college_table_all_india"
//     return `college_table_${stateCode.toUpperCase()}`
//   } else {
//     return "college_table_all_india"
//   }
// }

// function cleanAndTrimValue(value: any): any {
//   if (value === "" || value === null || value === undefined) return null
//   if (typeof value === "string") {
//     return value.trim().replace(/\s+/g, " ")
//   }
//   if (!isNaN(Number(value)) && typeof value !== "boolean") {
//     return Number(value)
//   }
//   return value
// }

// function cleanAndTrimObject(obj: CollegeRow): CollegeRow {
//   const cleaned: CollegeRow = {
//     instituteName: "",
//     instituteType: "",
//     course: "",
//     quota: "",
//     category: "",
//     subQuota: null,
//     subCategory: null,
//   }
//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       cleaned[key as keyof CollegeRow] = cleanAndTrimValue(obj[key])
//     }
//   }
//   return cleaned
// }
// function normalizeForConflict(value: string | null | undefined) {
//   // Treat empty string and null as same
//   return !value ? null : value.trim()
// }

// function getConflictKeyDB(row: CollegeRow) {
//   const baseKey = {
//     instituteName: cleanAndTrimValue(row.instituteName),
//     instituteType: cleanAndTrimValue(row.instituteType),
//     quota: cleanAndTrimValue(row.quota),
//     category: cleanAndTrimValue(row.category),
//     course: cleanAndTrimValue(row.course),
//     courseType: cleanAndTrimValue(row.courseType),
//   }

//   // Only include subQuota/subCategory if they exist and are part of the constraint
//   if (row.subQuota && row.subCategory) {
//     return {
//       ...baseKey,
//       subQuota: normalizeForConflict(row.subQuota),
//       subCategory: normalizeForConflict(row.subCategory),
//     }
//   } else if (row.subQuota) {
//     return {
//       ...baseKey,
//       subQuota: normalizeForConflict(row.subQuota),
//     }
//   } else if (row.subCategory) {
//     return {
//       ...baseKey,
//       subCategory: normalizeForConflict(row.subCategory),
//     }
//   }
//   return baseKey
// }

// function getConflictKey(row: CollegeRow): Record<string, any> {
//   const baseKey = {
//     instituteName: cleanAndTrimValue(row.instituteName),
//     instituteType: cleanAndTrimValue(row.instituteType),
//     quota: cleanAndTrimValue(row.quota),
//     category: cleanAndTrimValue(row.category),
//     course: cleanAndTrimValue(row.course),
//     courseType: cleanAndTrimValue(row.courseType),
//     subQuota: cleanAndTrimValue(row.subQuota),
//     subCategory: cleanAndTrimValue(row.subCategory),

//   }

// return baseKey;
// }

// const BATCH_SIZE = 100

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     const { data, counsellingType, stateCode } = body as {
//       data: CollegeRow[]
//       counsellingType: string | number
//       stateCode?: string | null
//     }

//     if (!data?.length) {
//       return NextResponse.json({ error: "No data provided" }, { status: 400 })
//     }
//     if (!counsellingType) {
//       return NextResponse.json(
//         { error: "Missing counsellingType" },
//         { status: 400 }
//       )
//     }

//     let tableName: string
//     try {
//       tableName = getTableName(stateCode)
//     } catch (err) {
//       return NextResponse.json(
//         { error: err instanceof Error ? err.message : String(err) },
//         { status: 400 }
//       )
//     }

//     const supabase = createAdminSupabaseClient()

//     // Deduplicate by conflict key
//     const seen = new Set<string>()
//     const dedupedRows: CollegeRow[] = []
//     const invalidRowsBeforeInsert: InvalidRow[] = []
//     const requiredFields = [
//       "instituteName",
//       "instituteType",
//       "course",
//       "quota",
//       "category",
//       "courseType"
//     ]
//     const skippedDueToDuplicate: SkippedDuplicate[] = []

//     for (let i = 0; i < data.length; i++) {
//       const row = data[i]
//       const cleanedRow = cleanAndTrimObject(row)

//       const missingFields = requiredFields.filter((field) => !cleanedRow[field])
//       if (missingFields.length > 0) {
//         invalidRowsBeforeInsert.push({
//           index: i + 1,
//           reason: `Missing required fields: ${missingFields.join(", ")}`,
//           row,
//         })
//         continue
//       }

//       const conflictKey = getConflictKeyDB(cleanedRow)
//       const key = JSON.stringify(conflictKey)

//       if (!seen.has(key)) {
//         seen.add(key)
//         dedupedRows.push(cleanedRow)
//       } else {
//         skippedDueToDuplicate.push({
//           index: i + 1,
//           row: cleanedRow,
//           conflictKey,
//         })
//         console.warn(
//           `⚠️ Skipped duplicate at index ${i + 1} with conflict key:`,
//           conflictKey
//         )
//       }
//     }

//     const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE)
//     const allBatchStats: BatchStats[] = []
//     const updatedRows: { index: number; row: CollegeRow; conflictKey: Record<string, any> }[] = []
//     const insertedRows: { index: number; row: CollegeRow; conflictKey: Record<string, any> }[] = []

//     for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
//       const startIdx = batchNum * BATCH_SIZE
//       const endIdx = Math.min(startIdx + BATCH_SIZE, dedupedRows.length)
//       const batchRows = dedupedRows.slice(startIdx, endIdx)

//       let inserted = 0
//       let updated = 0
//       let failed = 0
//       const logs: string[] = []
//       const errors: { record: number; error: string; data: CollegeRow }[] = []

//       for (let i = 0; i < batchRows.length; i++) {
//         const row = batchRows[i]
//         const recordNum = startIdx + i + 1
//         const logPrefix = `Batch ${batchNum + 1} - Record ${recordNum}/${dedupedRows.length}`

//         try {
//           const conflictKey = getConflictKey(row)
//           const cleanData: CollegeRow = Object.fromEntries(
//             Object.entries(row)
//               .filter(([key]) => key !== "id")
//               .map(([key, value]) => [key, cleanAndTrimValue(value)])
//           ) as CollegeRow

//           // Try to find existing record by unique key
//           const { data: existing } = await supabase
//             .from(tableName)
//             .select("id")
//             .match(conflictKey)
//             .maybeSingle()

//           if (existing?.id) {
//                  const roundUpdateData = await getRoundUpdateData(row, existing)

//             // Update existing record
//             const { error } = await supabase
//               .from(tableName)
//               .update(roundUpdateData)
//               .eq("id", existing.id)

//             if (error) throw error

//             const msg = `${logPrefix} - ✅ UPDATED: ${JSON.stringify(conflictKey)}`
//             updated++
//             logs.push(msg)
//             updatedRows.push({ index: recordNum, row, conflictKey })
//             console.log(msg)
//           } else {
//             // Insert new record
//             const { error } = await supabase.from(tableName).insert(cleanData)

//             if (error) throw error

//             const msg = `${logPrefix} - 🆕 INSERTED: ${JSON.stringify(conflictKey)}`
//             inserted++
//             logs.push(msg)
//             insertedRows.push({ index: recordNum, row, conflictKey })
//             console.log(msg)
//           }
//         } catch (error: any) {
//           failed++
//           const errorMsg =
//             error instanceof Error
//               ? error.message
//               : typeof error === "object" && error !== null
//                 ? JSON.stringify(error)
//                 : String(error)

//           const failMsg = `${logPrefix} - ❌ Failed: ${errorMsg}`
//           logs.push(failMsg)
//           errors.push({
//             record: recordNum,
//             error: errorMsg,
//             data: row,
//           })

//           console.error(failMsg)
//         }
//       }

//       // Batch summary
//       const batchStats: BatchStats = {
//         batchNum: batchNum + 1,
//         inserted,
//         updated,
//         failed,
//         total: batchRows.length,
//         logs,
//         errors,
//       }

//       allBatchStats.push(batchStats)
//       console.log(`\n📦 Batch ${batchNum + 1} Summary:`)
//       console.log(`🆕 Inserted: ${inserted}`)
//       console.log(`🔄 Updated: ${updated}`)
//       console.log(`❌ Failed: ${failed}`)
//       console.log(`📋 Total in Batch: ${batchRows.length}`)
//     }

//     // Final summary
//     const totalInserted = allBatchStats.reduce((sum, b) => sum + b.inserted, 0)
//     const totalUpdated = allBatchStats.reduce((sum, b) => sum + b.updated, 0)
//     const totalFailed = allBatchStats.reduce((sum, b) => sum + b.failed, 0)

//     console.log("\n📊 Final Summary:")
//     console.log(`🆕 Inserted: ${totalInserted}`)
//     console.log(`🔄 Updated: ${totalUpdated}`)
//     console.log(`❌ Failed: ${totalFailed}`)
//     console.log(`📋 Total Processed: ${dedupedRows.length}`)

//     return NextResponse.json({
//       success: totalFailed === 0,
//       inserted: totalInserted,
//       updated: totalUpdated,
//       failed: totalFailed,
//       total: dedupedRows.length,
//       batchStats: allBatchStats,
//       skippedDueToDuplicate,
//       updatedRows,
//       insertedRows,
//       invalidBeforeInsert: invalidRowsBeforeInsert,
//     })
//   } catch (err: any) {
//     console.error("💥 Server-level error:", err)
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Server error",
//         details: err instanceof Error ? err.message : "Unknown error",
//       },
//       { status: 500 }
//     )
//   }
// }


import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

type CollegeRow = {
  instituteName: string
  instituteType: string
  course: string
  quota: string
  category: string
  courseType: string
  subQuota?: string | null
  subCategory?: string | null
  [key: string]: any
}

type BatchStats = {
  batchNum: number
  inserted: number
  updated: number
  failed: number
  total: number
  logs: string[]
  errors: { record: number; error: string; data: CollegeRow }[]
}

type SkippedDuplicate = {
  index: number
  row: CollegeRow
  conflictKey: Record<string, any>
}

type InvalidRow = {
  index: number
  reason: string
  row: CollegeRow
}

function getTableName(stateCode?: string | null): string {
  if (stateCode) {
    if (stateCode == "All" || stateCode === "all")
      return "college_table_all_india"
    return `college_table_${stateCode.toUpperCase()}`
  } else {
    return "college_table_all_india"
  }
}

function cleanAndTrimValue(value: any): any {
  if (value === "" || value === null || value === undefined) return null
  if (typeof value === "string") {
    return value.trim().replace(/\s+/g, " ")
  }
  if (!isNaN(Number(value)) && typeof value !== "boolean") {
    return Number(value)
  }
  return value
}

function cleanAndTrimObject(obj: CollegeRow): CollegeRow {
  const cleaned: CollegeRow = {
    instituteName: "",
    instituteType: "",
    course: "",
    quota: "",
    category: "",
    courseType: "",
    subQuota: null,
    subCategory: null,
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cleaned[key as keyof CollegeRow] = cleanAndTrimValue(obj[key])
    }
  }
  return cleaned
}

// Get the correct conflict key based on your conditional indexes
function getConflictKey(row: CollegeRow): Record<string, any> {
  const baseKey = {
    instituteName: cleanAndTrimValue(row.instituteName),
    instituteType: cleanAndTrimValue(row.instituteType),
    quota: cleanAndTrimValue(row.quota),
    category: cleanAndTrimValue(row.category),
    course: cleanAndTrimValue(row.course),
    courseType: cleanAndTrimValue(row.courseType),
  }

  const hasSubQuota = row.subQuota !== undefined && row.subQuota !== null && row.subQuota !== ''
  const hasSubCategory = row.subCategory !== undefined && row.subCategory !== null && row.subCategory !== ''

  // Match your conditional index structure
  if (hasSubQuota && hasSubCategory) {
    return {
      ...baseKey,
      subQuota: cleanAndTrimValue(row.subQuota),
      subCategory: cleanAndTrimValue(row.subCategory)
    }
  } else if (hasSubQuota) {
    return {
      ...baseKey,
      subQuota: cleanAndTrimValue(row.subQuota)
    }
  } else if (hasSubCategory) {
    return {
      ...baseKey,
      subCategory: cleanAndTrimValue(row.subCategory)
    }
  } else {
    return baseKey
  }
}

// Add the missing getRoundUpdateData function
// async function getRoundUpdateData(newRow: CollegeRow, existingRecord: any) {
//   // Extract round-specific data from the new row that should be updated
//   const updateData: any = {};
  
//   // Add all the round-specific fields that should be updated
//   const roundFields = [
//     'round1OpeningRank', 'round1ClosingRank',
//     'round2OpeningRank', 'round2ClosingRank', 
//     'round3OpeningRank', 'round3ClosingRank',
//     'round4OpeningRank', 'round4ClosingRank',
//     'round5OpeningRank', 'round5ClosingRank',
//     'round6OpeningRank', 'round6ClosingRank',
//     'round7OpeningRank', 'round7ClosingRank',
//     // Add any other round-specific fields here
//   ];
  
//   for (const field of roundFields) {
//     if (newRow[field] !== undefined && newRow[field] !== null) {
//       updateData[field] = cleanAndTrimValue(newRow[field]);
//     }
//   }
  
//   return updateData;
// }

const BATCH_SIZE = 100

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, counsellingType, stateCode } = body as {
      data: CollegeRow[]
      counsellingType: string | number
      stateCode?: string | null
    }

    if (!data?.length) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }
    if (!counsellingType) {
      return NextResponse.json(
        { error: "Missing counsellingType" },
        { status: 400 }
      )
    }

    let tableName: string
    try {
      tableName = getTableName(stateCode)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : String(err) },
        { status: 400 }
      )
    }

    const supabase = createAdminSupabaseClient()

    // Deduplicate by conflict key
    const seen = new Set<string>()
    const dedupedRows: CollegeRow[] = []
    const invalidRowsBeforeInsert: InvalidRow[] = []
    const requiredFields = [
      "instituteName",
      "instituteType",
      "course",
      "quota",
      "category",
      "courseType"
    ]
    const skippedDueToDuplicate: SkippedDuplicate[] = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const cleanedRow = cleanAndTrimObject(row)

      const missingFields = requiredFields.filter((field) => !cleanedRow[field])
      if (missingFields.length > 0) {
        invalidRowsBeforeInsert.push({
          index: i + 1,
          reason: `Missing required fields: ${missingFields.join(", ")}`,
          row,
        })
        continue
      }

      const conflictKey = getConflictKey(cleanedRow)
      const key = JSON.stringify(conflictKey)

      if (!seen.has(key)) {
        seen.add(key)
        dedupedRows.push(cleanedRow)
      } else {
        skippedDueToDuplicate.push({
          index: i + 1,
          row: cleanedRow,
          conflictKey,
        })
        console.warn(
          `⚠️ Skipped duplicate at index ${i + 1} with conflict key:`,
          conflictKey
        )
      }
    }

    const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE)
    const allBatchStats: BatchStats[] = []
    const updatedRows: { index: number; row: CollegeRow; conflictKey: Record<string, any> }[] = []
    const insertedRows: { index: number; row: CollegeRow; conflictKey: Record<string, any> }[] = []

    for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
      const startIdx = batchNum * BATCH_SIZE
      const endIdx = Math.min(startIdx + BATCH_SIZE, dedupedRows.length)
      const batchRows = dedupedRows.slice(startIdx, endIdx)

      let inserted = 0
      let updated = 0
      let failed = 0
      const logs: string[] = []
      const errors: { record: number; error: string; data: CollegeRow }[] = []

      for (let i = 0; i < batchRows.length; i++) {
        const row = batchRows[i]
        const recordNum = startIdx + i + 1
        const logPrefix = `Batch ${batchNum + 1} - Record ${recordNum}/${dedupedRows.length}`

        try {
          const conflictKey = getConflictKey(row)
          const cleanData: CollegeRow = Object.fromEntries(
            Object.entries(row)
              .filter(([key]) => key !== "id")
              .map(([key, value]) => [key, cleanAndTrimValue(value)])
          ) as CollegeRow

          // Build the query with proper NULL handling for conditional indexes
          let query = supabase
            .from(tableName)
            .select("id")
            .eq("instituteName", conflictKey.instituteName)
            .eq("instituteType", conflictKey.instituteType)
            .eq("quota", conflictKey.quota)
            .eq("category", conflictKey.category)
            .eq("course", conflictKey.course)
            .eq("courseType", conflictKey.courseType)

          // Handle NULL values properly for conditional indexes
          if (conflictKey.subQuota !== undefined && conflictKey.subQuota !== null) {
            query = query.eq("subQuota", conflictKey.subQuota)
          } else {
            query = query.is("subQuota", null)
          }

          if (conflictKey.subCategory !== undefined && conflictKey.subCategory !== null) {
            query = query.eq("subCategory", conflictKey.subCategory)
          } else {
            query = query.is("subCategory", null)
          }

          const { data: existing, error: queryError } = await query.maybeSingle()

          if (queryError) throw queryError

          if (existing?.id) {
            const roundUpdateData = await getRoundUpdateData(row, existing)

            // Update existing record
            const { error: updateError } = await supabase
              .from(tableName)
              .update(roundUpdateData)
              .eq("id", existing.id)

            if (updateError) throw updateError

            const msg = `${logPrefix} - ✅ UPDATED: ${JSON.stringify(conflictKey)}`
            updated++
            logs.push(msg)
            updatedRows.push({ index: recordNum, row, conflictKey })
            // console.log(msg)
          } else {
            // Insert new record
            const { error: insertError } = await supabase.from(tableName).insert(cleanData)

            if (insertError) throw insertError

            const msg = `${logPrefix} - 🆕 INSERTED: ${JSON.stringify(conflictKey)}`
            inserted++
            logs.push(msg)
            insertedRows.push({ index: recordNum, row, conflictKey })
            // console.log(msg)
          }
        } catch (error: any) {
          failed++
          const errorMsg =
            error instanceof Error
              ? error.message
              : typeof error === "object" && error !== null
                ? JSON.stringify(error)
                : String(error)

          const failMsg = `${logPrefix} - ❌ Failed: ${errorMsg}`
          logs.push(failMsg)
          errors.push({
            record: recordNum,
            error: errorMsg,
            data: row,
          })

          console.error(failMsg)
        }
      }

      // Batch summary
      const batchStats: BatchStats = {
        batchNum: batchNum + 1,
        inserted,
        updated,
        failed,
        total: batchRows.length,
        logs,
        errors,
      }

      allBatchStats.push(batchStats)
      // console.log(`\n📦 Batch ${batchNum + 1} Summary:`)
      // console.log(`🆕 Inserted: ${inserted}`)
      // console.log(`🔄 Updated: ${updated}`)
      // console.log(`❌ Failed: ${failed}`)
      // console.log(`📋 Total in Batch: ${batchRows.length}`)
    }

    // Final summary
    const totalInserted = allBatchStats.reduce((sum, b) => sum + b.inserted, 0)
    const totalUpdated = allBatchStats.reduce((sum, b) => sum + b.updated, 0)
    const totalFailed = allBatchStats.reduce((sum, b) => sum + b.failed, 0)

    // console.log("\n📊 Final Summary:")
    // console.log(`🆕 Inserted: ${totalInserted}`)
    // console.log(`🔄 Updated: ${totalUpdated}`)
    // console.log(`❌ Failed: ${totalFailed}`)
    // console.log(`📋 Total Processed: ${dedupedRows.length}`)

    return NextResponse.json({
      success: totalFailed === 0,
      inserted: totalInserted,
      updated: totalUpdated,
      failed: totalFailed,
      total: dedupedRows.length,
      batchStats: allBatchStats,
      skippedDueToDuplicate,
      updatedRows,
      insertedRows,
      invalidBeforeInsert: invalidRowsBeforeInsert,
    })
  } catch (err: any) {
    console.error("💥 Server-level error:", err)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}