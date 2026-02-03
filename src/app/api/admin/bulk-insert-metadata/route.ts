

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const {
      quotas,         // [{ text, courseType }]
      subQuotas,      // [{ text, quotaName, courseType }]
      categories,     // [{ text, quotaName, courseType }]
      subCategories,  // [{ text, categoryName, quotaName, courseType }]
      counsellingTypeId,
      stateCode
    } = await req.json();

    const logs: string[] = [];
    const results: any = {};
// console.log( quotas,         // [{ text, courseType }]
//       subQuotas,      // [{ text, quotaName, courseType }]
//       categories,     // [{ text, quotaName, courseType }]
//       subCategories,  // [{ text, categoryName, quotaName, courseType }]
//       counsellingTypeId,
//       stateCode)




    // 1. Upsert quotas and build a map: quotaName|courseType -> id
    const quotaKeyToId: Record<string, number> = {};
    if (quotas?.length) {

      // console.log("Quotas: ",quotas)
      const { data, error } = await supabase.from("quota_types").upsert(
        quotas.map((q: any) => ({
          text: q.text,
          courseType: q.courseType,
          counselling_type_id: counsellingTypeId,
          state_code: stateCode,
        })),
        { onConflict: "text,courseType,counselling_type_id,state_code" }
      ).select();
// const { data, error }  = await supabase.from("quota_types").upsert(
//   quotas.map((q: any) => ({
//     text: q.text,
//     courseType: q.courseType,
//     counselling_type_id: counsellingTypeId,
//     state_code: stateCode,
//   })),
//   { onConflict: "text,courseType,counselling_type_id,state_code" }
// );
      if (error) {
        logs.push(`❌ Quota insert error: ${error.message}`);
        results.quotas = { error: error.message };
      } else {
        logs.push(`✅ Quota upserted: ${data?.length || 0} rows`);
        // console.log(`✅ Quota upserted: ${data?.length || 0} rows`);
        results.quotas = { insertedOrUpdated: data?.length || 0, rows: data };
        for (const q of data) {
          quotaKeyToId[`${q.text}|${q.courseType}`] = q.id;
        }
      }
    }

    // 2. Upsert subQuotas (need quota_type_id)
    const subQuotaKeyToId: Record<string, number> = {};
    if (subQuotas?.length) {
      const subQuotaRows = subQuotas.map((sq: any) => ({
        text: sq.text,
        quota_type_id: quotaKeyToId[`${sq.quotaName}|${sq.courseType}`],
      })).filter((sq:{text:string,quota_type_id:number}) => sq.quota_type_id);

      const { data, error } = await supabase.from("sub_quotas").upsert(
        subQuotaRows,
        { onConflict: "text,quota_type_id" }
      ).select();

      if (error) {
        logs.push(`❌ Sub-Quota insert error: ${error.message}`);
        results.subQuotas = { error: error.message };
      } else {
        logs.push(`✅ Sub-Quota upserted: ${data?.length || 0} rows`);
        // console.log(`✅ Sub-Quota upserted: ${data?.length || 0} rows`);
        results.subQuotas = { insertedOrUpdated: data?.length || 0, rows: data };
        for (const sq of data) {
          subQuotaKeyToId[`${sq.text}|${sq.quota_type_id}`] = sq.id;
        }
      }
    }


    // console.log(quotaKeyToId)
    // 3. Upsert categories (need quota_type_id)
    const categoryKeyToId: Record<string, number> = {};
    if (categories?.length) {
      const categoryRows = categories.map((cat: any) => ({
        text: cat.text,
        quota_type_id: quotaKeyToId[`${cat.quotaName}|${cat.courseType}`],
      })).filter((cat:{text:string,quota_type_id:number}) => cat.quota_type_id);

      const { data, error } = await supabase.from("categories").upsert(
        categoryRows,
        { onConflict: "text,quota_type_id" }
      ).select();

      if (error) {
        logs.push(`❌ Category insert error: ${error.message}`);
        results.categories = { error: error.message };
      } else {
        logs.push(`✅ Category upserted: ${data?.length || 0} rows`);
        // console.log(`✅ Category upserted: ${data?.length || 0} rows`);
        results.categories = { insertedOrUpdated: data?.length || 0, rows: data };
        for (const cat of data) {
          categoryKeyToId[`${cat.text}|${cat.quota_type_id}`] = cat.id;
        }
      }
    }

    // 4. Upsert subCategories (need category_id)
    if (subCategories?.length) {
      const subCategoryRows = subCategories.map((sc: any) => ({
        text: sc.text,
        category_id: categoryKeyToId[`${sc.categoryName}|${quotaKeyToId[`${sc.quotaName}|${sc.courseType}`]}`],
      })).filter((sc:{text:string,category_id:number}) => sc.category_id);

      const { data, error } = await supabase.from("sub_categories").upsert(
        subCategoryRows,
        { onConflict: "text,category_id" }
      ).select();

      if (error) {
        logs.push(`❌ Sub-Category insert error: ${error.message}`);
        results.subCategories = { error: error.message };
      } else {
        logs.push(`✅ Sub-Category upserted: ${data?.length || 0} rows`);
      //  console.log(`✅ Sub-Category upserted: ${data?.length || 0} rows`);
        results.subCategories = { insertedOrUpdated: data?.length || 0, rows: data };
      }
    }

    return NextResponse.json({
      success: true,
      msg: "Bulk metadata inserted/updated.",
      logs,
      results
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}