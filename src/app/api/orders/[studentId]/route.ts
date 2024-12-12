import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Prisma client import

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;

  // Validate that studentId is provided
  if (!studentId || typeof studentId !== "string") {
    return NextResponse.json(
      { error: "A valid 'studentId' query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch all group_orders for the given studentId including related order_records and students
    const groupOrders = await db.group_orders.findMany({
      where: { student_id: studentId }, // Query for orders based on student_id
      include: {
        order_records: true, // Include related order records
        students: true, // Include related student details
      },
    });

    // If no group orders found, return a 404 response
    if (!groupOrders || groupOrders.length === 0) {
      return NextResponse.json({}, { status: 200 });
    }

    // Return the group orders with a 200 response
    return NextResponse.json(groupOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching group orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch group orders" },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
