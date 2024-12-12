import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Import your Prisma client

/*
   Example GET Payload (query params):
   {
     orderId: "123"
   }
*/

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  try {
    // Check if orderId is valid
    if (!orderId || isNaN(Number(orderId))) {
      return NextResponse.json(
        { error: "order_id is required and must be a valid number" },
        { status: 400 }
      );
    }

    console.log("Fetching order_items for orderId:", orderId);

    const orderItems = await db.order_items.findMany({
      where: {
        order_id: Number(orderId), // Ensure valid casting
      },
      include: {
        students: true,
        products: {
          include: {
            product_prices: {
              orderBy: {
                date: "desc", // This orders the prices by the most recent date
              },
              take: 1, // Take the most recent price only
            },
          },
        },
      },
    });

    return NextResponse.json(orderItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching order_items:", error);
    return NextResponse.json(
      { error: "Failed to fetch order items." },
      { status: 500 }
    );
  }
}

// Handle invalid HTTP methods
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
