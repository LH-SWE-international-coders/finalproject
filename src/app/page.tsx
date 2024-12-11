import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { GroupOrder } from "@/lib/interfaces"; // Import types
import { redirect } from "next/navigation";

export default async function Home() {
  // Initialize Supabase client
  const supabase = await createClient();

  // Fetch the currently logged-in user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Handle errors or unauthenticated state
  if (error || !user) {
    redirect("/login");
  }

  const userStudentId = user.id;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${userStudentId}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await res.json();

    console.log(data);

    // Check if the 'orders' field is an empty object or undefined
    const ordersExist = data.length > 0;

    return (
      <div className="space-y-6 px-2">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl px-2 font-bold">Group Orders</h1>
          <Button>
            <Link href="/new_order">Create Order</Link>
          </Button>
        </div>
        <Tabs defaultValue="all" className="items-center">
          <TabsList className="flex overflow-x-auto pl-10 phone:pl-0 phone:inline phone:overflow-visible">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {/* Only render orders if they exist */}
            {ordersExist ? (
              data.map((order: GroupOrder) => (
                <Card key={order.order_id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>
                        {order.order_records.description || "Unknown Title"}
                      </CardTitle>
                      <Badge
                        variant={
                          order.order_records.status === "open"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.order_records.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Hosted by {order.students.name || "Unknown"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Cut-off time:{" "}
                      {order.order_records.expected_order_date
                        ? new Date(
                            order.order_records.expected_order_date
                          ).toLocaleString()
                        : "Not specified"}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href={`/order/${order.order_id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div>No orders found.</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (e) {
    return <div>Error: {e.message}</div>;
  }
}
