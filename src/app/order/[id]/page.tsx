"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddEditItemModal } from "@/components/add-edit-item-modal";
import { InviteParticipantModal } from "../../../components/invite-participants-modal";
import { OrderItem, GroupOrder, OrderRecord } from "../../../lib/interfaces";
import { useUser } from "@/lib/hooks/useUser";

type Params = Promise<{ id: string }>;

interface AggregatedProduct {
  product_id: number;
  description: string;
  total_quantity: number;
  total_price: number;
  contributors: string[]; // List of student names or IDs
}

interface ParticipantStats {
  student_id: string;
  name: string;
  total_expenditure: number;
}

function filterOrderItemsByStudentId(
  orderItems: OrderItem[],
  studentId: string
): OrderItem[] {
  return orderItems.filter((item) => item.student_id === studentId);
}

function aggregateProductQuantities(
  orderItems: OrderItem[]
): AggregatedProduct[] {
  const productMap: Map<
    number,
    {
      description: string;
      total_quantity: number;
      total_price: number;
      contributors: Set<string>; // A Set to avoid duplicate contributors
    }
  > = new Map();

  orderItems.forEach((item) => {
    const { product_id, products, quantity, student_id, students } = item;
    const { description } = products;
    const cost = products.product_prices[0]?.cost || 0;

    // If product already exists in the map, accumulate values
    if (productMap.has(product_id)) {
      const product = productMap.get(product_id)!;
      product.total_quantity += quantity;
      product.total_price += cost * quantity;
      product.contributors.add(students.name); // Add contributor (student name) to the set
    } else {
      // If product doesn't exist, create a new entry
      productMap.set(product_id, {
        description,
        total_quantity: quantity,
        total_price: cost * quantity,
        contributors: new Set([students.name]), // Add first contributor
      });
    }
  });

  // Convert map to an array of AggregatedProduct objects
  const result: AggregatedProduct[] = [];
  productMap.forEach((value, key) => {
    result.push({
      product_id: key,
      description: value.description,
      total_quantity: value.total_quantity,
      total_price: value.total_price,
      contributors: Array.from(value.contributors), // Convert Set to Array
    });
  });

  return result;
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return ""; // Handle if the date is undefined or null
  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString("en-GB"); // 'en-GB' formats date as DD/MM/YYYY
};

function aggregateParticipantStats(
  groupOrders: GroupOrder[],
  orderItems: OrderItem[]
): ParticipantStats[] {
  const statsMap: Map<string, ParticipantStats> = new Map();

  groupOrders.forEach((record) => {
    const studentId = record.student_id;
    statsMap.set(studentId, {
      student_id: studentId,
      name: record.students.name,
      total_expenditure: 0,
    });
  });

  orderItems.forEach((item) => {
    const { student_id, quantity, product_id } = item;
    const productPrice = item.products.product_prices[0]; // Assuming the latest price is the first entry

    if (productPrice) {
      const price = productPrice.cost;
      const expenditure = price * quantity;

      // If the student already exists in the map, update their stats
      if (statsMap.has(student_id)) {
        const existingStats = statsMap.get(student_id)!;
        existingStats.total_expenditure += expenditure;
      } else {
        // If the student is not yet in the map, create a new entry
        const studentName = item.students.name;
        statsMap.set(student_id, {
          student_id,
          name: studentName,
          total_expenditure: expenditure,
        });
      }
    }
  });

  const result: ParticipantStats[] = [];
  statsMap.forEach((value, key) => {
    result.push({
      student_id: key,
      name: value.name,
      total_expenditure: value.total_expenditure,
    });
  });

  // Convert the map to an array and return it
  return result;
}

export default function OrderDetails(props: { params: Params }) {
  const params = use(props.params);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] =
    useState(false);

  const order_id = params.id;
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderRecord, setOrderRecord] = useState<OrderRecord>();
  const [aggregatedProducts, setAggregatedProducts] = useState<
    AggregatedProduct[]
  >([]);
  const [participantStats, setParticipantStats] = useState<ParticipantStats[]>(
    []
  );
  const [loadingItems, setLoadingItems] = useState<boolean>(true);
  const [loadingRecord, setLoadingRecord] = useState<boolean>(true);

  const [fetchError, setFetchError] = useState<string | null>(null);
  const { user, loading: userLoading, error: userError } = useUser(); // Using the useUser hook

  useEffect(() => {
    // If user is not loaded or order_id is missing, do not proceed
    if (userLoading || !user || !order_id) {
      return; // Early exit until user is available and order_id is valid
    }

    // Fetch Order Items
    const fetchOrderItems = async () => {
      try {
        setLoadingItems(true);

        const response = await fetch(`/api/orderItems/${order_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order items");
        }

        const data_order_items = await response.json();
        const aggregatedResult = aggregateProductQuantities(data_order_items);
        setAggregatedProducts(aggregatedResult);

        const groupResponse = await fetch(`/api/orderParticipants/${order_id}`);
        if (!groupResponse.ok) {
          throw new Error("Failed to fetch group order participants");
        }

        const data_participants = await groupResponse.json();
        const participantStats = aggregateParticipantStats(
          data_participants,
          data_order_items
        );
        setParticipantStats(participantStats);

        const filteredOrderItems = filterOrderItemsByStudentId(
          data_order_items,
          user.id
        );
        setOrderItems(filteredOrderItems);
      } catch (error: any) {
        setFetchError(error.message);
      } finally {
        setLoadingItems(false);
      }
    };

    // Fetch Order Record
    const fetchOrderRecord = async () => {
      try {
        setLoadingRecord(true);

        const response = await fetch(`/api/orderRecord/${order_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order record");
        }

        const data = await response.json();
        setOrderRecord(data);
      } catch (error: any) {
        setFetchError(error.message);
      } finally {
        setLoadingRecord(false);
      }
    };

    // Start fetching once the user is loaded and order_id is valid
    fetchOrderItems();
    fetchOrderRecord();
  }, [user, userLoading, order_id]); // Re-run when user, userLoading, or order_id changes

  // Handle loading states
  if (userLoading || loadingItems || loadingRecord) {
    return <div>Loading...</div>; // Show loading state until user and data are ready
  }

  // Handle errors (if any)
  if (fetchError || userError) {
    return <div>Error: {fetchError || userError}</div>; // Show error if fetching fails
  }

  const handleDelete = async (productId: number) => {
    try {
      const response = await fetch("/api/deleteOrderItem", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: parseInt(order_id, 10),
          product_id: productId,
          student_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete order item");
      }

      const data = await response.json();
      alert("Order item deleted successfully!");

      const updatedItems = orderItems.filter(
        (item) =>
          item.order_id !== parseInt(order_id, 10) ||
          item.product_id !== productId ||
          item.student_id !== user.id
      );
      setOrderItems(updatedItems);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete order item");
    }
  };

  const closeOrder = async (orderId: number) => {
    try {
      const response = await fetch("/api/orderRecord", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!response.ok) {
        throw new Error("Failed to close the order");
      }

      const data = await response.json();
      alert("Order closed successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while closing the order");
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-full lg:max-w-none">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Order ID: {order_id}
          </h1>
          <p className="text-muted-foreground">
            Hosted by {orderRecord?.students?.name}
          </p>
          <p className="text-muted-foreground">
            Expected {formatDate(orderRecord?.expected_order_date)}
          </p>
        </div>
        <Badge
          variant={orderRecord?.status === "Open" ? "default" : "secondary"}
          className="mt-2 sm:mt-0"
        >
          {orderRecord?.status}
        </Badge>
      </div>

      {/* Participants Section */}
      <div className="bg-muted p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Participants</h2>
        <ul className="space-y-2">
          {participantStats.map((participant) => (
            <li key={participant.student_id} className="flex justify-between">
              <span>{participant.name}</span>
              <span>${participant.total_expenditure.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* My Order Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">My Orders</h2>
          {orderRecord?.status === "open" && (
            <Button
              onClick={() => setIsAddItemModalOpen(true)}
              className="mt-2 sm:mt-0"
            >
              Add Item
            </Button>
          )}
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                {/* <TableHead>Contributors</TableHead> */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell>{item.products.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    $
                    {(
                      item.products.product_prices[0].cost * item.quantity
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {/* <Button variant="ghost" size="sm">
                      Edit
                    </Button> */}
                    {orderRecord?.status === "open" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.product_id)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Cart Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Group Order Summary
          </h2>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Contributors</TableHead>
                {/* <TableHead>Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {aggregatedProducts.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.total_quantity}</TableCell>
                  <TableCell>${item.total_price.toFixed(2)}</TableCell>
                  <TableCell>{item.contributors.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Host Actions */}
      {orderRecord?.host_student_id === user.id &&
        orderRecord?.status === "open" && (
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsAddParticipantModalOpen(true)}
            >
              Invite Participants
            </Button>
            <Button onClick={() => closeOrder(orderRecord?.id)}>
              Close Order
            </Button>
          </div>
        )}

      {/* Add/Edit Item Modal */}
      <AddEditItemModal
        orderId={orderRecord?.id}
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
      />
      <InviteParticipantModal
        orderId={orderRecord?.id}
        isOpen={isAddParticipantModalOpen}
        onClose={() => setIsAddParticipantModalOpen(false)}
      />
    </div>
  );
}
