// app/api/client/[id]/route.ts

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const clientId = params.id;

  try {
    const supabase = createServerSupabaseClient();

    // First get the client details
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (clientError) throw clientError;

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get the client's enrolled programs with join to programs table
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("client_programs")
      .select(
        `
        id,
        enrollment_date,
        status,
        notes,
        program:programs(id, name, description, status)
        `
      )
      .eq("client_id", clientId);

    if (enrollmentsError) throw enrollmentsError;

    // Format the programs data
    const programs = enrollments.map((enrollment) => ({
      id: enrollment.program.id,
      name: enrollment.program.name,
      description: enrollment.program.description,
      status: enrollment.program.status,
      enrollment_date: enrollment.enrollment_date,
      enrollment_status: enrollment.status,
      notes: enrollment.notes,
    }));

    // Return client with programs
    return NextResponse.json({
      ...client,
      programs,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client details" },
      { status: 500 }
    );
  }
}
