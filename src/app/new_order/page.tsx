"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks/useUser";

export default function AddGroupOrder() {
  const [orderDesc, setOrderDesc] = useState<string>("");
  const [expectedOrderDate, setExpectedOrderDate] = useState<string>(""); // Store date as string
  const [fetchError, setFetchError] = useState<string | null>(null); // Error state to track issues

  const { user, loading, error } = useUser();

  // Parse the expected order date from DD/MM/YYYY to a Date object
  const parseDate = (dateStr: string): string | null => {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JavaScript months are zero-indexed (0-11)
      const year = parseInt(parts[2], 10);

      // Check if date is valid
      if (day && month >= 0 && month < 12 && year) {
        return new Date(year, month, day, 12, 0, 0).toISOString();
      }
    }
    return null; // Return null if the date is invalid
  };

  // Handle form submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form from refreshing the page

    // Validation
    if (!user) {
      setFetchError("Host Student ID is required");
      return;
    }

    setFetchError(null); // Reset error message

    try {
      const response = await fetch("/api/orderRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host_student_id: user.id,
          //   description: orderDesc,
          type: "group", // Default type
          status: "open", // Default status
          expected_order_date: parseDate(expectedOrderDate),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      alert("Order and group order created successfully!");
      console.log("Order created:", data);
      window.location.href = "/"; // Navigate to the home page
    } catch (error: any) {
      console.error("Error:", error);
      setFetchError(
        error.message || "An error occurred while creating the order"
      );
    }
  };

  if (fetchError) return <div>Error: {fetchError}</div>;

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Create New Group Order</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="orderDesc">Order Name</label>
          <Textarea
            id="orderDesc"
            placeholder="Enter order description"
            value={orderDesc}
            onChange={(e) => setOrderDesc(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <label htmlFor="expectedOrderDate">
            Expected Order Date (DD/MM/YYYY)
          </label>
          <Textarea
            id="expectedOrderDate"
            placeholder="Enter expected order date"
            value={expectedOrderDate}
            onChange={(e) => setExpectedOrderDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deliveryAddress">Delivery Address</Label>
          <Textarea
            id="deliveryAddress"
            placeholder="Enter delivery address"
            required
          />
        </div>

        <div className="flex space-x-4">
          <Button type="submit">Create Group Order</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
