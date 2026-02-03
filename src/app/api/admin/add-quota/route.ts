// import { createAdminSupabaseClient } from "@/lib/supabase"
// import { NextRequest, NextResponse } from "next/server"

// export async function POST(request: NextRequest) {
//   try {
//     const reqData = await request.json()
//     const supabase = createAdminSupabaseClient()

//     const {
//       name,                     // e.g., "DEF"
//       counselling_type_id,      // e.g., 1
//       state_code,               // e.g., "UP" (optional, required if state counselling)
//       is_common = false         // optional boolean flag
//     } = reqData

//     if (!name || (!is_common && !counselling_type_id && !state_code)) {
//       return NextResponse.json(
//         { msg: "Missing required fields for quota insert" },
//         { status: 400 }
//       )
//     }

//     // ✅ Check if quota already exists
//     const { data: existingQuota, error: checkError } = await supabase
//       .from("quota_types")
//       .select("id")
//       .eq("name", name)
//       .eq("counselling_type_id", counselling_type_id || null)
//       .eq("state_code", state_code || null)
//       .maybeSingle()

//     if (checkError) {
//       console.error("Error checking quota:", checkError)
//       return NextResponse.json(
//         { msg: "Error checking existing quota", error: checkError },
//         { status: 500 }
//       )
//     }

//     if (existingQuota) {
//       return NextResponse.json(
//         { msg: "Quota already exists", id: existingQuota.id },
//         { status: 200 }
//       )
//     }

//     // ✅ Insert new quota
//     const { data, error } = await supabase
//       .from("quota_types")
//       .insert({
//         name,
//         counselling_type_id: is_common ? null : counselling_type_id,
//         state_code: is_common ? null : state_code,
//         // is_common,
//       })
//       .select()
//       .single()

//     if (error) {
//       console.error("Insert error:", error)
//       return NextResponse.json(
//         { msg: "Failed to insert quota", error },
//         { status: 400 }
//       )
//     }

//     return NextResponse.json({
//       msg: "Quota inserted successfully",
//       data
//     })
//   } catch (err) {
//     console.error("Unexpected error:", err)
//     return NextResponse.json(
//       { msg: "Something went wrong", err },
//       { status: 500 }
//     )
//   }
// }





import { createAdminSupabaseClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqData = await request.json();
    const supabase = createAdminSupabaseClient();

    const {
      name,
      counselling_type_id,
      state_code,
      is_common = false,
      courseType
    } = reqData;

    if (!name || (!is_common && !counselling_type_id && !state_code)) {
      return NextResponse.json(
        { msg: "Missing required fields for quota insert" },
        { status: 400 }
      );
    }

    // 🔍 Check if quota already exists
    const { data: existingQuota, error: checkError } = await supabase
      .from("quota_types")
      .select("id")
      .eq("text", name)
      .eq("counselling_type_id", counselling_type_id || null)
      .eq("state_code", state_code || null)
      .maybeSingle();

    if (checkError) {
      // console.log(checkError)
      return NextResponse.json(
        { msg: "Error checking existing quota", error: checkError },
        { status: 500 }
      );
    }

    if (existingQuota) {
      return NextResponse.json(
        {
          msg: "Quota already exists",
          data: existingQuota, // ✅ send as `data` so frontend stays consistent
        },
        { status: 200 } // ✅ Don't send 400 — it’s not an error!
      );
    }

    // 🟢 Insert new quota
    const { data, error } = await supabase
      .from("quota_types")
      .insert({
        text:name,
        counselling_type_id: is_common ? null : counselling_type_id,
        courseType:courseType,
        state_code: is_common ? null : state_code,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { msg: "Failed to insert quota", error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      msg: "Quota inserted successfully",
      data
    });
  } catch (err) {
    return NextResponse.json(
      { msg: "Unexpected error", err },
      { status: 500 }
    );
  }
}

