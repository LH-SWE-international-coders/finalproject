import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/*
Example POST
Headers: Content-Type: application/json
Payload:
{
  "order_id": 6,
  "product_id": 1,
  "student_id": "123",
  "quantity": 5
}
*/

export async function POST(req: NextRequest) {
  try {
    const { order_id, product_id, student_id, quantity } = await req.json();

    // Validate payload
    if (!order_id || !product_id || !student_id) {
      return NextResponse.json(
        { error: "product_id, student_id, and order_id are required fields." },
        { status: 400 }
      );
    }

    // Create a new order item
    const newOrderItem = await db.order_items.create({
      data: {
        order_id,
        product_id,
        student_id,
        quantity: quantity || 1, // Default quantity to 1 if not provided
      },
    });

    return NextResponse.json(
      {
        message: "Order item created successfully.",
        orderItem: newOrderItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order item:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { order_id, product_id, student_id } = await req.json();

    // Validate input
    if (!order_id || !product_id || !student_id) {
      return NextResponse.json(
        { error: "order_id, product_id, and student_id are required fields." },
        { status: 400 }
      );
    }

    // Delete the order_item from the database
    const deletedOrderItem = await db.order_items.delete({
      where: {
        order_id_product_id_student_id: {
          order_id,
          product_id,
          student_id,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Order item deleted successfully.",
        orderItem: deletedOrderItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting order item:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
