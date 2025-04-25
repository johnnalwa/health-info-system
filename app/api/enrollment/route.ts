// app/api/enrollment/route.ts

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const enrollment = await request.json();

    const { data, error } = await supabase
      .from("client_programs")
      .insert([
        {
          client_id: enrollment.client_id,
          program_id: enrollment.program_id,
          enrollment_date: new Date().toISOString(),
          status: "active",
          notes: enrollment.notes || "",
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error enrolling client:", error);
    return NextResponse.json(
      { error: "Failed to enroll client in program" },
      { status: 500 }
    );
  }
}
