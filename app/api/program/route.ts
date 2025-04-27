// app/api/program/route.ts

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // First get all programs
    const { data: programs, error: programsError } = await supabase
      .from("programs")
      .select("*")
      .order("name");

    if (programsError) throw programsError;

    // Get enrollment counts for each program
    const programsWithEnrollments = await Promise.all(
      programs.map(async (program) => {
        const { count, error: countError } = await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("program_id", program.id);

        if (countError) {
          console.error("Error fetching enrollment count:", countError);
          return { ...program, enrollment_count: 0 };
        }

        return { ...program, enrollment_count: count || 0 };
      })
    );

    return NextResponse.json(programsWithEnrollments);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const program = await request.json();

    const { data, error } = await supabase
      .from("programs")
      .insert([program])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      { error: "Failed to create program" },
      { status: 500 }
    );
  }
}
