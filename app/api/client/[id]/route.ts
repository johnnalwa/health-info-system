// app/api/client/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const clientId = context.params.id;

  if (!clientId) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();

    // First get the client details
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (clientError) {
      console.error("Error fetching client:", clientError);
      throw clientError;
    }

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get the client's enrolled programs
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("client_programs")
      .select(`
        id,
        enrollment_date,
        status,
        notes,
        program:programs(
          id, 
          name, 
          description, 
          status
        )
      `)
      .eq("client_id", clientId)
      .order('enrollment_date', { ascending: false });

    if (enrollmentsError) {
      console.error("Error fetching enrollments:", enrollmentsError);
      // Return client without programs if enrollment fetch fails
      return NextResponse.json({
        ...client,
        programs: [],
      });
    }

    // Format the programs data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const programs = (enrollments || []).map((enrollment: any) => ({
      id: enrollment.program?.id || '',
      name: enrollment.program?.name || '',
      description: enrollment.program?.description || '',
      status: enrollment.program?.status || '',
      enrollment_date: enrollment.enrollment_date || '',
      enrollment_status: enrollment.status || '',
      notes: enrollment.notes || '',
    }));

    // Return client with programs
    return NextResponse.json({
      ...client,
      programs,
    });
  } catch (error) {
    console.error("Error fetching client details:", error);
    return NextResponse.json(
      { error: "Failed to fetch client details" },
      { status: 500 }
    );
  }
}
