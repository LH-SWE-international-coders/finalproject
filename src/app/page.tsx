import { db } from "@/lib/db";
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
import { OrderRecord } from "@/lib/interfaces"; // Import types
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
    redirect('/login');
  }

  const userStudentId = user.id;

  // Fetch orders directly from the database
  const orders = (await db.order_records.findMany({
    where: {
      group_orders: {
        some: {
          student_id: userStudentId,
        },
      },
    },
    include: {
      students: true,
      group_orders: {
        include: {
          students: true,
        },
      },
      order_items: {
        include: {
          products: {
            include: {
              product_prices: true,
            },
          },
        },
      },
    },
  })) as unknown as OrderRecord[];

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
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{order.description || "Unknown Title"}</CardTitle>
                  <Badge variant={order.status === "open" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
                <CardDescription>
                  Hosted by {order.group_orders[0]?.students?.name || "Unknown"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Cut-off time:{" "}
                  {order.expected_order_date
                    ? new Date(order.expected_order_date).toLocaleString()
                    : "Not specified"}
                </p>
                <p>Total items: {order.order_items.length}</p>
                <p>Participants: {order.group_orders.length}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/order/${order.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      {/* <CreateGroupOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      /> */}
      
    </div>
  );
}