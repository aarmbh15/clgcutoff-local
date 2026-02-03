// import { createAdminSupabaseClient } from "@/lib/supabase";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const supabase = createAdminSupabaseClient();
//   const { name, quota_type_id } = await req.json();

//   if (!name || !quota_type_id) {
//     return NextResponse.json({ msg: "Name and quota_type_id are required" }, { status: 400 });
//   }

//   const { data, error } = await supabase
//     .from("categories")
//     .insert({ name, quota_type_id })
//     .select()
//     .maybeSingle();

//   if (error && error.code === "23505") {
//     return NextResponse.json({ msg: "Category already exists" }, { status: 200 });
//   } else if (error) {
//     return NextResponse.json({ msg: "Error inserting category", error }, { status: 500 });
//   }

//   return NextResponse.json({ msg: "Category inserted successfully", data });
// }


import { createAdminSupabaseClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabaseClient();
  const { name, quota_type_id } = await req.json();

  if (!name || !quota_type_id) {
    return NextResponse.json(
      { msg: "Name and quota_type_id are required" },
      { status: 400 }
    );
  }

  // 🔍 Check if category already exists
  const { data: existing, error: checkError } = await supabase
    .from("categories")
    .select("id")
    .eq("text", name)
    .eq("quota_type_id", quota_type_id)
    .maybeSingle();

  if (checkError) {
    return NextResponse.json(
      { msg: "Error checking existing category", error: checkError },
      { status: 500 }
    );
  }

  if (existing) {
    return NextResponse.json(
      { msg: "Category already exists", data:existing },
      { status: 200 }
    );
  }

  // 🚀 Insert new category
  const { data, error: insertError } = await supabase
    .from("categories")
    .insert({ text:name, quota_type_id })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { msg: "Error inserting category", error: insertError },
      { status: 500 }
    );
  }

  return NextResponse.json({
    msg: "Category inserted successfully",
    data
  });
}
