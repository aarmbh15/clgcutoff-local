// import { createAdminSupabaseClient } from "@/lib/supabase";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const supabase = createAdminSupabaseClient();
//   const { name, category_id } = await req.json();

//   if (!name || !category_id) {
//     return NextResponse.json({ msg: "Name and category_id are required" }, { status: 400 });
//   }

//   const { data, error } = await supabase
//     .from("sub_categories")
//     .insert({ name, category_id })
//     .select()
//     .maybeSingle();

//   if (error && error.code === "23505") {
//     return NextResponse.json({ msg: "Sub-category already exists" }, { status: 200 });
//   } else if (error) {
//     return NextResponse.json({ msg: "Error inserting sub-category", error }, { status: 500 });
//   }

//   return NextResponse.json({ msg: "Sub-category inserted successfully", data });
// }

import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, category_id } = await request.json();

    if (!name || !category_id) {
      return NextResponse.json({ msg: "Name and category_id are required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();

    // 🔍 Check if sub-category already exists
    const { data: existing, error: checkError } = await supabase
      .from("sub_categories")
      .select("id")
      .eq("text", name)
      .eq("category_id", category_id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ msg: "Error checking sub-category", error: checkError }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ msg: "Sub-category already exists", id: existing.id }, { status: 200 });
    }

    // 🚀 Insert sub-category
    const { data, error } = await supabase
      .from("sub_categories")
      .insert({ text:name, category_id })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ msg: "Failed to insert sub-category", error }, { status: 500 });
    }

    return NextResponse.json({ msg: "Sub-category inserted", data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ msg: "Something went wrong", err }, { status: 500 });
  }
}
