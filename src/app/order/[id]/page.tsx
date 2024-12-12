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
import {
  OrderItem,
  OrderRecord,
  ParticipantStats,
  AggregatedProduct,
} from "../../../lib/interfaces";
import { formatDate } from "@/utils/helpers/functions";
import {
  fetchOrderItems,
  fetchOrderRecord,
  handleDelete,
  closeOrder,
} from "@/utils/helpers/asyncFunctions";
import { useUser } from "@/lib/hooks/useUser";

type Params = Promise<{ id: string }>;

// Total delivery fee (hardcoded)
const totalDeliveryFee = 5;

export default function OrderDetails(props: { params: Params }) {
  const params = use(props.params);
  const order_id = params.id;

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] =
    useState(false);
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

  const { user, loading: userLoading, error: userError } = useUser();

  useEffect(() => {
    // If user is not loaded or order_id is missing, do not proceed
    if (userLoading || !user || !order_id) {
      return;
    }

    // Start fetching once the user is loaded and order_id is valid
    fetchOrderItems(
      order_id,
      user.id,
      setLoadingItems,
      setAggregatedProducts,
      setParticipantStats,
      setOrderItems,
      setFetchError
    );
    fetchOrderRecord(order_id, setLoadingRecord, setOrderRecord, setFetchError);
  }, [user, userLoading, order_id]);

  // Handle loading states
  if (userLoading || loadingItems || loadingRecord) {
    return <div>Loading...</div>;
  }

  // Handle errors (if any)
  if (fetchError || userError) {
    return <div>Error: {fetchError || userError}</div>;
  }

  // Calculate total expenditure from all participants
  const totalExpenditure = participantStats.reduce(
    (sum, participant) => sum + participant.total_expenditure,
    0
  );

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-full lg:max-w-none">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {orderRecord?.description}
          </h1>
          <p className="text-muted-foreground">
            Hosted by {orderRecord?.students?.name}
          </p>
          <p className="text-muted-foreground">
            Expected Order Date:{" "}
            {orderRecord?.expected_order_date
              ? formatDate(orderRecord.expected_order_date)
              : "not specified"}
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
        <ul>
          {participantStats.map((participant) => {
            // Calculate the participant's share of the delivery fee
            const participantDeliveryFee =
              totalExpenditure > 0
                ? (participant.total_expenditure / totalExpenditure) *
                  totalDeliveryFee
                : 0;

            return (
              <li key={participant.student_id} className="flex justify-between">
                <span>{participant.name}</span>
                <span>
                  ${participant.total_expenditure.toFixed(2)} + $
                  {participantDeliveryFee.toFixed(2)} = $
                  {(
                    participant.total_expenditure + participantDeliveryFee
                  ).toFixed(2)}
                </span>
              </li>
            );
          })}
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
                        onClick={() =>
                          handleDelete(
                            item.product_id,
                            order_id,
                            user?.id ?? ""
                          )
                        }
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

      {/* Delivery Fee Breakdown Table */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Delivery Fee Breakdown
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Expenditure</TableHead>
                <TableHead>Delivery Fee Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantStats.map((participant) => {
                const participantDeliveryFee =
                  totalExpenditure > 0
                    ? (participant.total_expenditure / totalExpenditure) *
                      totalDeliveryFee
                    : 0;
                return (
                  <TableRow key={participant.student_id}>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>
                      ${participant.total_expenditure.toFixed(2)}
                    </TableCell>
                    <TableCell>${participantDeliveryFee.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Host Actions */}
      {orderRecord?.host_student_id === user?.id &&
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
        orderId={orderRecord?.id ?? -1}
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
      />
      <InviteParticipantModal
        orderId={orderRecord?.id ?? -1}
        isOpen={isAddParticipantModalOpen}
        onClose={() => setIsAddParticipantModalOpen(false)}
      />
    </div>
  );
}
