import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function OrderSummary({ params }: { params: { id: string } }) {
    // Mock data
    const order = {
        id: params.id,
        title: "Friday Night Dinner",
        totalItems: 6,
        totalCost: 45.25,
        deliveryFee: 5.00,
        participants: [
            {
                name: "Alice",
                items: [
                    { name: "Pizza", quantity: 1, price: 15.0 },
                    { name: "Salad", quantity: 1, price: 8.0 },
                ],
                deliveryFee: 1.67,
                total: 24.67,
            },
            {
                name: "Bob",
                items: [
                    { name: "Pizza", quantity: 1, price: 15.0 },
                ],
                deliveryFee: 1.67,
                total: 16.67,
            },
            {
                name: "Charlie",
                items: [
                    { name: "Soda", quantity: 3, price: 2.5 },
                ],
                deliveryFee: 1.66,
                total: 9.16,
            },
        ],
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{order.title} - Order Summary</h1>
                <Button asChild>
                    <Link href={`/order/${params.id}`}>Back to Order Details</Link>
                </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Order Details</h2>
                <p>Total Items: {order.totalItems}</p>
                <p>Total Cost: ${order.totalCost.toFixed(2)}</p>
                <p>Delivery Fee: ${order.deliveryFee.toFixed(2)}</p>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Individual Contributions</h2>
                {order.participants.map((participant) => (
                    <div key={participant.name} className="mb-6">
                        <h3 className="text-xl font-semibold">{participant.name}</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {participant.items.map((item) => (
                                    <TableRow key={item.name}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>${item.price.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={2}>Delivery Fee</TableCell>
                                    <TableCell>${participant.deliveryFee.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2} className="font-bold">Total</TableCell>
                                    <TableCell className="font-bold">${participant.total.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className="mt-4">
                            <Button>Approve Payment</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

