// Helper functions for fetching order-related data

import {
  AggregatedProduct,
  GroupOrder,
  OrderItem,
  OrderRecord,
  ParticipantStats,
} from "@/lib/interfaces";

import {
  aggregateParticipantStats,
  aggregateProductQuantities,
  filterOrderItemsByStudentId,
} from "./functions";

export async function fetchData<T>(
  url: string,
  errorMessage: string
): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchOrderItems(
  orderId: string,
  userId: string,
  setLoadingItems: (loading: boolean) => void,
  setAggregatedProducts: (products: AggregatedProduct[]) => void,
  setParticipantStats: (stats: ParticipantStats[]) => void,
  setOrderItems: (items: OrderItem[]) => void,
  setFetchError: (error: string) => void
): Promise<void> {
  try {
    setLoadingItems(true);

    // Fetch and process order items
    const dataOrderItems = await fetchData<OrderItem[]>(
      `/api/orderItems/${orderId}`,
      "Failed to fetch order items"
    );
    const aggregatedResult = aggregateProductQuantities(dataOrderItems);
    setAggregatedProducts(aggregatedResult);

    // Fetch and process group participants
    const dataParticipants = await fetchData<GroupOrder[]>(
      `/api/orderParticipants/${orderId}`,
      "Failed to fetch group order participants"
    );
    const participantStats = aggregateParticipantStats(
      dataParticipants,
      dataOrderItems
    );
    setParticipantStats(participantStats);

    // Filter order items by student ID
    const filteredOrderItems = filterOrderItemsByStudentId(
      dataOrderItems,
      userId
    );
    setOrderItems(filteredOrderItems);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during fetching order items";
    setFetchError(errorMessage);
  } finally {
    setLoadingItems(false);
  }
}

export async function fetchOrderRecord(
  orderId: string,
  setLoadingRecord: (loading: boolean) => void,
  setOrderRecord: (record: OrderRecord) => void,
  setFetchError: (error: string) => void
): Promise<void> {
  try {
    setLoadingRecord(true);

    // Fetch order record
    const data = await fetchData<OrderRecord>(
      `/api/orderRecord/${orderId}`,
      "Failed to fetch order record"
    );
    setOrderRecord(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during fetching order record";
    setFetchError(errorMessage);
  } finally {
    setLoadingRecord(false);
  }
}

export async function handleDelete(
  productId: number,
  orderId: string,
  userId: string
): Promise<void> {
  try {
    const response = await fetch("/api/orderItems", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: parseInt(orderId, 10),
        product_id: productId,
        student_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete order item");
    }

    await response.json();
    alert("Order item deleted successfully!");
    window.location.reload();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during deleting the order item";
    console.error("Error deleting item:", error);
    alert(errorMessage);
  }
}

export async function closeOrder(orderId: number): Promise<void> {
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

    await response.json();
    alert("Order closed successfully");
    window.location.reload();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during closing the order";
    console.error("Error:", error);
    alert(errorMessage);
  }
}
