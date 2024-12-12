import { order_records } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Prisma client import

export async function PATCH(req: NextRequest) {
  try {
    const { order_id } = await req.json();

    // Validate input
    if (!order_id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch the order to check its current status
    const order = await db.order_records.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "closed") {
      return NextResponse.json(
        { error: "Order is already closed" },
        { status: 400 }
      );
    }

    // Update the order status to 'closed'
    const updatedOrder = await db.order_records.update({
      where: { id: order_id },
      data: { status: "closed" },
    });

    return NextResponse.json(
      {
        message: "Order closed successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error closing order:", error);
    return NextResponse.json(
      { error: "An error occurred while closing the order" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      host_student_id,
      // description,
      type,
      status,
      expected_order_date,
      order_date,
      delivery_date,
    }: Partial<order_records> = await req.json(); // Parse request body

    // Validate `host_student_id`
    if (!host_student_id || typeof host_student_id !== "string") {
      return NextResponse.json(
        {
          error: "`host_student_id` is required and must be a valid string.",
        },
        { status: 400 }
      );
    }

    // Create a new order record
    const newOrder = await db.order_records.create({
      data: {
        host_student_id,
        // description: description || "",
        type: type || "individual", // Fallback to default value
        status: status || "open", // Fallback to default value
        expected_order_date: expected_order_date
          ? new Date(expected_order_date)
          : null,
        order_date: order_date ? new Date(order_date) : null,
        delivery_date: delivery_date ? new Date(delivery_date) : null,
      },
    });

    const { id: order_id } = newOrder; // Extract the `order_id` from the new order

    // Create a group order with role always set as "Host"
    const newGroupOrder = await db.group_orders.create({
      data: {
        order_id, // Link to the created order
        student_id: host_student_id, // Link to `student_id`
        role: "Host", // Always set the role as "host"
      },
    });

    // Send success response
    return NextResponse.json(
      {
        message: "Group order created successfully",
        order: newOrder,
        groupOrder: newGroupOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating group order:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the group order" },
      { status: 500 }
    );
  }
}

// Handle invalid HTTP methods
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
