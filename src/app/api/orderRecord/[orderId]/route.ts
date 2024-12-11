import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Prisma client import

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  // Validate that orderId is provided and is a valid number
  if (!orderId || isNaN(Number(orderId))) {
    return NextResponse.json(
      { error: "order_id is required." },
      { status: 400 }
    );
  }

  try {
    // Fetch the order record for the given orderId, including associated students
    const orderRecord = await db.order_records.findUnique({
      where: {
        id: Number(orderId),
      },
      include: {
        students: true, // Include associated students
      },
    });

    if (!orderRecord) {
      return NextResponse.json(
        { error: "Order record not found." },
        { status: 404 }
      );
    }

    // Return the order record with a 200 response
    return NextResponse.json(orderRecord, { status: 200 });
  } catch (error) {
    console.error("Error fetching order record:", error);
    return NextResponse.json(
      { error: "Failed to fetch order record." },
      { status: 500 }
    );
  }
}

// Handle invalid HTTP methods
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
