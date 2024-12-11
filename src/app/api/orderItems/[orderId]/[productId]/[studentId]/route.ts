import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Import your Prisma client

/*
   Example POST Payload:
   {
     "quantity": 5
   }
*/

export async function POST(
  req: NextRequest,
  {
    params,
  }: { params: { orderId: string; productId: string; studentId: string } }
) {
  const { orderId, productId, studentId } = params;
  const { quantity } = await req.json(); // Get the quantity from the request body

  try {
    // Check if the OrderItem already exists
    const existingOrderItem = await db.order_items.findFirst({
      where: {
        order_id: Number(orderId),
        product_id: Number(productId),
        student_id: String(studentId),
      },
    });

    if (existingOrderItem) {
      // If the OrderItem exists, update its quantity
      const updatedOrderItem = await db.order_items.update({
        where: {
          order_id_product_id_student_id: {
            order_id: existingOrderItem.order_id,
            product_id: existingOrderItem.product_id,
            student_id: existingOrderItem.student_id,
          },
        },
        data: { quantity: existingOrderItem.quantity + quantity },
      });

      return NextResponse.json(updatedOrderItem, { status: 200 }); // Return updated OrderItem
    } else {
      // If the OrderItem doesn't exist, create a new one
      const newOrderItem = await db.order_items.create({
        data: {
          order_id: Number(orderId),
          product_id: Number(productId),
          student_id: String(studentId),
          quantity,
        },
      });

      return NextResponse.json(newOrderItem, { status: 201 }); // Return newly created OrderItem
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error while processing the order item" },
      { status: 500 }
    );
  }
}

// Handle invalid HTTP methods
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
