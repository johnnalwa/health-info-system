import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const programId = params.id;

  try {
    const supabase = createServerSupabaseClient();

    // Get the program details
    const { data: program, error: programError } = await supabase
      .from("programs")
      .select("*")
      .eq("id", programId)
      .single();

    if (programError) throw programError;

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Get enrollment count for the program
    const { count: enrollmentCount, error: countError } = await supabase
      .from("client_programs")
      .select("*", { count: "exact", head: true })
      .eq("program_id", programId);

    if (countError) {
      console.error("Error fetching enrollment count:", countError);
      return NextResponse.json(program);
    }

    return NextResponse.json({
      ...program,
      enrollment_count: enrollmentCount || 0,
    });
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      { error: "Failed to fetch program details" },
      { status: 500 }
    );
  }
}
