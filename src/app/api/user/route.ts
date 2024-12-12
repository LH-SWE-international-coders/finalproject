import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // Import the Supabase client

export async function GET() {
  try {
    // Initialize Supabase client
    const supabase = await createClient();

    // Fetch the currently logged-in user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Handle errors or unauthenticated state
    if (error || !user) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { user: { id: user.id, email: user.email } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
