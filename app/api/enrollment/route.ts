// app/api/enrollment/route.ts

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const enrollment = await request.json();

    // Validate required fields
    if (!enrollment.client_id || !enrollment.program_id) {
      return NextResponse.json(
        { error: "Client ID and Program ID are required" },
        { status: 400 }
      );
    }

    // Check if client exists
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", enrollment.client_id)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Check if program exists
    const { data: program, error: programError } = await supabase
      .from("programs")
      .select("id")
      .eq("id", enrollment.program_id)
      .single();

    if (programError || !program) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 }
      );
    }

    // Check if client is already enrolled in this program
    const { data: existingEnrollment, error: existingError } = await supabase
      .from("client_programs")
      .select("id")
      .eq("client_id", enrollment.client_id)
      .eq("program_id", enrollment.program_id);

    if (!existingError && existingEnrollment && existingEnrollment.length > 0) {
      return NextResponse.json(
        { error: "Client is already enrolled in this program" },
        { status: 409 }
      );
    }

    // Create the enrollment
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

    // Get the program details to return in the response
    const { data: enrolledProgram, error: programDetailsError } = await supabase
      .from("programs")
      .select("*")
      .eq("id", enrollment.program_id)
      .single();

    if (programDetailsError) throw programDetailsError;

    return NextResponse.json({
      enrollment: data[0],
      program: enrolledProgram
    });
  } catch (error) {
    console.error("Error enrolling client:", error);
    return NextResponse.json(
      { error: "Failed to enroll client in program" },
      { status: 500 }
    );
  }
}
