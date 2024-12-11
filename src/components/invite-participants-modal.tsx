import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface InviteParticipantModalProps {
  orderId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteParticipantModal({
  orderId,
  isOpen,
  onClose,
}: InviteParticipantModalProps) {
  const [studentId, setStudentId] = useState<string>(""); // For the participant's student ID
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await fetch("/api/orderParticipants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          student_id: studentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to invite participant");
      }

      const data = await response.json();
      alert("Participant added successfully!");
      window.location.reload(); // Refreshes the page
      onClose(); // Close modal after success
    } catch (error: any) {
      setError(
        error.message || "An error occurred while adding the participant."
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Participant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Invite Participant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
