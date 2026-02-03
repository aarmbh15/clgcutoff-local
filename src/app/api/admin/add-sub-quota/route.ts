

// import { createAdminSupabaseClient } from "@/lib/supabase"
// import { NextRequest, NextResponse } from "next/server"

// // POST /api/sub-quotas
// export async function POST(request: NextRequest) {
//   const supabase = createAdminSupabaseClient();
//   const { name } = await request.json();

//   if (!name) {
//     return NextResponse.json({ msg: "Name is required" }, { status: 400 });
//   }

//   const { data, error } = await supabase
//     .from("sub_quotas")
//     .insert({ name })
//     .select()
//     .maybeSingle();

//   if (error && error.code !== "23505") {
//     return NextResponse.json({ msg: "Error inserting sub_quota", error }, { status: 500 });
//   }

//   return NextResponse.json({
//     msg: "Sub-quota inserted or already exists",
//     data,
//   });
// }


// import { createAdminSupabaseClient } from "@/lib/supabase"
// import { NextRequest, NextResponse } from "next/server"

// export async function POST(request: NextRequest) {
//   const supabase = createAdminSupabaseClient();
//   const { name, quota_type_id } = await request.json();

//   if (!name || !quota_type_id) {
//     return NextResponse.json({ msg: "Name and quota_type_id are required" }, { status: 400 });
//   }

//   const { data, error } = await supabase
//     .from("sub_quotas")
//     .insert({ name, quota_type_id })
//     .select()
//     .maybeSingle();

//   if (error && error.code !== "23505") {
//     return NextResponse.json({ msg: "Error inserting sub_quota", error }, { status: 500 });
//   }

//   return NextResponse.json({
//     msg: "Sub-quota inserted or already exists",
//     data,
//   });
// }


import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, quota_type_id } = await request.json();

    if (!name || !quota_type_id) {
      return NextResponse.json({ msg: "Name and quota_type_id are required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();

    // 🔍 Check if sub-quota already exists for given quota
    const { data: existing, error: checkError } = await supabase
      .from("sub_quotas")
      .select("id")
      .eq("text", name)
      .eq("quota_type_id", quota_type_id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ msg: "Error checking existing sub-quota", error: checkError }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ msg: "Sub-quota already exists", id: existing.id }, { status: 200 });
    }

    // 🚀 Insert sub-quota
    const { data, error } = await supabase
      .from("sub_quotas")
      .insert({text: name, quota_type_id })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ msg: "Failed to insert sub-quota", error }, { status: 500 });
    }

    return NextResponse.json({ msg: "Sub-quota inserted", data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ msg: "Something went wrong", err }, { status: 500 });
  }
}
