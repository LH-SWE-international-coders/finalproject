import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Query distinct product prices, sorted by descending timestamp
    const productPrices = await db.product_prices.findMany({
      distinct: ["product_id"], // Ensure distinct product IDs
      orderBy: {
        date: "desc", // Sort by the most recent date first
      },
      include: {
        products: true, // Include associated products
      },
    });

    if (productPrices.length === 0) {
      return NextResponse.json(
        { message: "No product prices found" },
        { status: 404 }
      );
    }

    return NextResponse.json(productPrices, { status: 200 });
  } catch (error) {
    console.error("Error fetching product prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch product prices" },
      { status: 500 }
    );
  }
}
