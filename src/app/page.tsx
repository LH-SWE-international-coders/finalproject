// "use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const orders = [
  {
    id: 1,
    title: "Friday Night Dinner",
    host: "Alice",
    status: "Open",
    cutoffTime: "2023-05-20T18:00:00",
    totalItems: 15,
    participants: 4,
  },
  {
    id: 2,
    title: "Weekend Groceries",
    host: "Bob",
    status: "Closed",
    cutoffTime: "2023-05-19T22:00:00",
    totalItems: 30,
    participants: 6,
  },
  // Add more sample orders here
]

export default function Home() {
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
      <Tabs defaultValue="all" className='items-center'>
        <TabsList className='flex overflow-x-auto pl-10 phone:pl-0 phone:inline phone:overflow-visible'>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{order.title}</CardTitle>
                  <Badge variant={order.status === "Open" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
                <CardDescription>Hosted by {order.host}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Cut-off time: {new Date(order.cutoffTime).toLocaleString()}</p>
                <p>Total items: {order.totalItems}</p>
                <p>Participants: {order.participants}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/order/${order.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        {/* Add content for other tabs */}
      </Tabs>
      {/* <CreateGroupOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      /> */}
      
    </div>
  )
}

