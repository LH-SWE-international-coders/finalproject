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
import { Prisma } from "@prisma/client"; // Import Prisma types

// Define a type for orders with included relations
type OrderWithRelations = Prisma.order_recordsGetPayload<{
  include: {
    group_orders: {
      include: {
        students: true;
      };
    };
    order_items: {
      include: {
        products: true;
      };
    };
  };
}>;


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
    throw new Error("User is not authenticated");
  }

  const userStudentId = user.id;
  console.log(userStudentId)

  // Fetch orders directly from the database
  const orders: OrderWithRelations[] = await db.order_records.findMany({
    where: {
      group_orders: {
        some: {
          student_id: userStudentId, // Match the logged-in user's ID
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
          products: true, // Include product details
        },
      },
    },
  });

  return (
    <div className="space-y-6 px-2">
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
                  <CardTitle>{order.type || "Unknown Title"}</CardTitle>
                  <Badge variant={order.status === "open" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
                <CardDescription>
                  Hosted by {order.group_orders[0]?.students.name || "Unknown"}
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
    </div>
  );
}
