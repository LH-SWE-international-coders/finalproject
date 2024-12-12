import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Prisma client import

export async function POST(req: NextRequest) {
  try {
    const { order_id, student_id } = await req.json();

    // Validate payload
    if (!order_id || !student_id) {
      return NextResponse.json(
        { error: "order_id and student_id are required fields." },
        { status: 400 }
      );
    }

    // Create a new group_order with role always set as "Participant"
    const newGroupOrder = await db.group_orders.create({
      data: {
        order_id,
        student_id,
        role: "Participant", // Always set the role to "Participant"
      },
    });

    return NextResponse.json(
      {
        message: "Added to group order successfully.",
        groupOrder: newGroupOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to group order:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// Handle invalid HTTP methods
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
