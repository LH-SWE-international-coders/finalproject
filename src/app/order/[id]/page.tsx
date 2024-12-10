'use client';

import { use } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AddEditItemModal } from '@/components/add-edit-item-modal';

type Params = Promise<{ id: string }>;

export default function OrderDetails(props: { params: Params }) {
    const params = use(props.params);

    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

    // Mock data
    const order = {
        id: params.id,
        title: 'Friday Night Dinner',
        host: 'Alice',
        status: 'Open',
        cutoffTime: '2023-05-20T18:00:00',
        participants: [
            { name: 'Alice', contribution: 25.5 },
            { name: 'Bob', contribution: 15.75 },
            { name: 'Charlie', contribution: 20.0 },
        ],
        items: [
            { name: 'Pizza', quantity: 2, price: 15.0, contributors: ['Alice', 'Bob'] },
            { name: 'Soda', quantity: 3, price: 2.5, contributors: ['Charlie'] },
            { name: 'Salad', quantity: 1, price: 8.0, contributors: ['Alice'] },
        ],
    };

    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-full lg:max-w-none">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">{order.title}</h1>
                    <p className="text-muted-foreground">Hosted by {order.host}</p>
                </div>
                <Badge variant={order.status === 'Open' ? 'default' : 'secondary'} className="mt-2 sm:mt-0">
                    {order.status}
                </Badge>
            </div>

            {/* Participants Section */}
            <div className="bg-muted p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Participants</h2>
                <ul className="space-y-2">
                    {order.participants.map((participant) => (
                        <li key={participant.name} className="flex justify-between">
                            <span>{participant.name}</span>
                            <span>${participant.contribution.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Cart Section */}
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold">Cart</h2>
                    <Button onClick={() => setIsAddItemModalOpen(true)} className="mt-2 sm:mt-0">
                        Add Item
                    </Button>
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
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.name}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                    <TableCell>{item.contributors.join(', ')}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Host Actions */}
            {order.host === 'Alice' && (
                <div className="flex flex-wrap gap-2 justify-end">
                    <Button variant="outline">Invite Participants</Button>
                    <Button variant="outline">Set Cut-Off Time</Button>
                    <Button >Close Order</Button>
                    {/* <Button>Submit Order</Button>
                    <Button asChild>
                        <Link href={`/order/${params.id}/summary`}>View Order Summary</Link>
                    </Button> */}
                </div>
            )}

            {/* Add/Edit Item Modal */}
            <AddEditItemModal
                isOpen={isAddItemModalOpen}
                onClose={() => setIsAddItemModalOpen(false)}
                participants={order.participants.map((p) => p.name)}
            />
        </div>
    );
}
