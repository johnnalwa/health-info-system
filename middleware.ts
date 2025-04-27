
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple pass-through middleware - no authentication required
export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

// No routes to match - middleware is essentially disabled
export const config = {
  matcher: []
};
