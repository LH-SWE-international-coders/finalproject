import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface AddEditItemModalProps {
    isOpen: boolean
    onClose: () => void
    participants: string[]
    item?: {
        name: string
        quantity: number
        price: number
        contributors: string[]
    }
}

export function AddEditItemModal({ isOpen, onClose, participants, item }: AddEditItemModalProps) {
    const [name, setName] = useState(item?.name || '')
    const [quantity, setQuantity] = useState(item?.quantity.toString() || '1')
    const [price, setPrice] = useState(item?.price.toString() || '')
    const [contributors, setContributors] = useState<string[]>(item?.contributors || [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Item Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="contributors">Contributors</Label>
                            <Select
                                onValueChange={(value) => setContributors(value ? [value] : [])}
                                value={contributors[0]}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select contributor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {participants.map((participant) => (
                                        <SelectItem key={participant} value={participant}>
                                            {participant}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

