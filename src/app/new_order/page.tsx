import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function AddGroupOrder() {
    return (
        <div className="container mx-auto py-2">
            <h1 className="text-3xl font-bold mb-6">Create New Group Order</h1>
            <form className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="orderName">Order Name</Label>
                    <Input id="orderName" placeholder="Enter order name" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter order description" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cutoffTime">Cut-off Time</Label>
                    {/* <DateTimePicker id="cutoffTime" /> */}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Textarea id="deliveryAddress" placeholder="Enter delivery address" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="inviteEmails">Invite Participants (Email addresses)</Label>
                    <Textarea
                        id="inviteEmails"
                        placeholder="Enter email addresses, separated by commas"
                    />
                </div>
                <div className="flex space-x-4">
                    <Button type="submit">Create Group Order</Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href="/">Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}

