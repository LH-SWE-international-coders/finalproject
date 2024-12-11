import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Prisma client import

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = await params;

  // Validate that orderId is provided and is a valid number
  if (!orderId || isNaN(Number(orderId))) {
    return NextResponse.json(
      { error: "order_id is required and must be a valid number." },
      { status: 400 }
    );
  }

  try {
    // Fetch group_orders for the given orderId, including students
    const groupOrders = await db.group_orders.findMany({
      where: {
        order_id: Number(orderId), // Ensure valid casting
      },
      include: {
        students: true, // Include related students
      },
    });

    // Return the group orders with a 200 response
    return NextResponse.json(groupOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching group order participants:", error);
    return NextResponse.json(
      { error: "Failed to fetch group order participants." },
      { status: 500 }
    );
  }
}

// Handle invalid HTTP methods
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
