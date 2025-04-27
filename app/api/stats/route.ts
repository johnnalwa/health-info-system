// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    console.log("Fetching statistics from database...");

    // Get client count
    const { count: clientCount, error: clientError } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true });

    if (clientError) {
      console.error("Error fetching client count:", clientError);
      throw clientError;
    }

    // Get programs count (all programs, not just active)
    const { count: programCount, error: programError } = await supabase
      .from("programs")
      .select("*", { count: "exact", head: true });

    if (programError) {
      console.error("Error fetching program count:", programError);
      throw programError;
    }

    // Get enrollments count from client_programs table
    const { count: enrollmentCount, error: enrollmentError } = await supabase
      .from("client_programs")
      .select("*", { count: "exact", head: true });

    if (enrollmentError) {
      console.error("Error fetching enrollment count:", enrollmentError);
      throw enrollmentError;
    }

    const stats = {
      clientCount: clientCount || 0,
      programCount: programCount || 0,
      enrollmentCount: enrollmentCount || 0,
    };

    console.log("Statistics retrieved:", stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
