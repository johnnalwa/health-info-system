import { createServerSupabaseClient } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function validateApiRequest(req: NextRequest) {
  // Get the token from the Authorization header
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.split(" ")[1];
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        ),
      };
    }

    return {
      authenticated: true,
      user: data.user,
    };
  } catch {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      ),
    };
  }
}