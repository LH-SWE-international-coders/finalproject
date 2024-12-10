'use client'

import { use } from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { AddEditItemModal } from '@/components/add-edit-item-modal'
import Link from 'next/link'

type Params = Promise<{ id: string }>;

export default function OrderDetails(props: { params: Params }) {
    const params = use(props.params);

    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

    // Mock data
    const order = {
        id: params.id,
        title: "Friday Night Dinner",
        host: "Alice",
        status: "Open",
        cutoffTime: "2023-05-20T18:00:00",
        participants: [
            { name: "Alice", contribution: 25.5 },
            { name: "Bob", contribution: 15.75 },
            { name: "Charlie", contribution: 20.0 },
        ],
        items: [
            { name: "Pizza", quantity: 2, price: 15.0, contributors: ["Alice", "Bob"] },
            { name: "Soda", quantity: 3, price: 2.5, contributors: ["Charlie"] },
            { name: "Salad", quantity: 1, price: 8.0, contributors: ["Alice"] },
        ],
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">{order.title}</h1>
                    <p className="text-muted-foreground">Hosted by {order.host}</p>
                </div>
                <Badge variant={order.status === "Open" ? "default" : "secondary"}>
                    {order.status}
                </Badge>
            </div>
            <div className="bg-muted p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Participants</h2>
                <ul>
                    {order.participants.map((participant) => (
                        <li key={participant.name} className="flex justify-between">
                            <span>{participant.name}</span>
                            <span>${participant.contribution.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Cart</h2>
                    <Button onClick={() => setIsAddItemModalOpen(true)}>Add Item</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Contributors</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map((item) => (
                            <TableRow key={item.name}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell>{item.contributors.join(", ")}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm">Edit</Button>
                                    <Button variant="ghost" size="sm">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {order.host === "Alice" && (
                <div className="flex justify-end space-x-4">
                    <Button variant="outline">Invite Participants</Button>
                    <Button variant="outline">Set Cut-Off Time</Button>
                    <Button variant="outline">Close Order</Button>
                    <Button>Submit Order</Button>
                    <Button asChild>
                        <Link href={`/order/${params.id}/summary`}>View Order Summary</Link>
                    </Button>
                </div>
            )}
            <AddEditItemModal
                isOpen={isAddItemModalOpen}
                onClose={() => setIsAddItemModalOpen(false)}
                participants={order.participants.map(p => p.name)}
            />
        </div>
    )
}

