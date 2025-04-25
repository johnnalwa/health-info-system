import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");
    const programId = searchParams.get("program");

    const supabase = createServerSupabaseClient();

    let query = supabase.from("clients").select("*");

    if (searchTerm) {
      query = query.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,contact_number.ilike.%${searchTerm}%`
      );
    }

    if (programId) {
      // Get client IDs enrolled in the specified program
      const { data: enrollments } = await supabase
        .from("client_programs")
        .select("client_id")
        .eq("program_id", programId);

      if (enrollments && enrollments.length > 0) {
        const clientIds = enrollments.map((e) => e.client_id);
        query = query.in("id", clientIds);
      } else {
        // No clients enrolled in this program
        return NextResponse.json([]);
      }
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const client = await request.json();

    const { data, error } = await supabase
      .from("clients")
      .insert([client])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
