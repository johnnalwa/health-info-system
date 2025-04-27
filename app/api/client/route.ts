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
      const { data: enrollments } = await supabase
        .from("client_programs")
        .select("client_id")
        .eq("program_id", programId);

      if (enrollments && enrollments.length > 0) {
        const clientIds = enrollments.map((e) => e.client_id);
        query = query.in("id", clientIds);
      } else {
        return NextResponse.json([]);
      }
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json(data || []);
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

    // Validate required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "date_of_birth",
      "gender",
      "contact_number",
      "address",
    ];
    const missingFields = requiredFields.filter((field) => !client[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (client.email && !client.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate date_of_birth format and range
    const birthDate = new Date(client.date_of_birth);
    const today = new Date();
    if (isNaN(birthDate.getTime()) || birthDate > today) {
      return NextResponse.json(
        { error: "Invalid date of birth" },
        { status: 400 }
      );
    }

    // Validate gender
    if (!["male", "female", "other"].includes(client.gender.toLowerCase())) {
      return NextResponse.json(
        { error: "Gender must be 'male', 'female', or 'other'" },
        { status: 400 }
      );
    }

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
