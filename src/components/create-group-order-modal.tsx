import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface CreateGroupOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateGroupOrderModal({ isOpen, onClose }: CreateGroupOrderModalProps) {
    const [title, setTitle] = useState('');
    const [host, setHost] = useState('');
    const [cutoffTime, setCutoffTime] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic
        console.log({ title, host, cutoffTime });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Group Order</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Group Order Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Friday Night Dinner"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="host">Host</Label>
                            <Input
                                id="host"
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                                placeholder="Enter host name"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="cutoff-time">Cut-off Time</Label>
                            <Input
                                id="cutoff-time"
                                type="datetime-local"
                                value={cutoffTime}
                                onChange={(e) => setCutoffTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
