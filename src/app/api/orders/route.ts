import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        // Replace this with your authentication mechanism to retrieve the current user ID.
        // For example, using cookies or headers to fetch logged-in user details:
        const studentId = req.cookies.get("userStudentId")?.value;

        if (!studentId) {
            return NextResponse.json(
                { error: "User is not authenticated or Student ID is missing" },
                { status: 401 }
            );
        }

        // Fetch all order_records associated with the participant in group_orders
        const orders = await db.order_records.findMany({
            where: {
                group_orders: {
                    some: {
                        student_id: studentId, // Match the current user's ID
                    },
                },
            },
            include: {
                group_orders: {
                    include: {
                        students: true, // Include participant details
                    },
                },
                order_items: {
                    include: {
                        products: true, // Include product details if needed
                    },
                },
            },
        });

        if (orders.length === 0) {
            return NextResponse.json(
                { message: "No orders found for the current user" },
                { status: 404 }
            );
        }

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
