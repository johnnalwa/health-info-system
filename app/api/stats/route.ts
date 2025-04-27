// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    // Get client count
    const { count: clientCount, error: clientError } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true });

    if (clientError) throw clientError;

    // Get active programs count
    const { count: programCount, error: programError } = await supabase
      .from("programs")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (programError) throw programError;

    // Get enrollments count
    const { count: enrollmentCount, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true });

    if (enrollmentError) throw enrollmentError;

    return NextResponse.json({
      clientCount: clientCount || 0,
      programCount: programCount || 0,
      enrollmentCount: enrollmentCount || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
