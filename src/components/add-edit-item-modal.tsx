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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, ProductPrice } from "@/lib/interfaces";
import { useUser } from "@/lib/hooks/useUser";

interface AddEditItemModalProps {
  orderId: number;
  isOpen: boolean;
  onClose: () => void;
  item?: {
    name: string;
    quantity: number;
    price: number;
    contributors: string[];
  };
}

export function AddEditItemModal({
  orderId,
  isOpen,
  onClose,
  item,
}: AddEditItemModalProps) {
  const [quantity, setQuantity] = useState(item?.quantity.toString() || "1");
  const [chosenProduct, setChosenProduct] = useState<ProductPrice>();
  const [productPrices, setProductPrices] = useState<ProductPrice[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { user, loading, error } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/productPrices`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch product prices: ${response.statusText}`
          );
        }

        const data: ProductPrice[] = await response.json();
        setProductPrices(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching product prices:", err.message);
          setFetchError(err.message);
        } else {
          setFetchError("An unexpected error occurred.");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFetchLoading(true);
    setFetchError(null); // Reset error state

    try {
      const response = await fetch(
        `/api/orderItems/${orderId}/${chosenProduct?.product_id}/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: parseInt(quantity, 10), // send the quantity to be added or updated
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save OrderItem");
      }

      const data = await response.json();
      alert("Order Item saved successfully!");
    } catch (error: any) {
      setFetchError(error.message);
      console.error("Error:", error);
    } finally {
      setFetchLoading(false); // Stop loading after the request
      window.location.reload(); // Refreshes the page
      onClose();
    }
  };

  if (loading || fetchLoading) return <div>Loading...</div>;
  if (error || fetchError) return <div>Error: {fetchError}</div>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Item Name</Label>
              <Select
                onValueChange={(value) => setChosenProduct(JSON.parse(value))} // Set the chosen product when a value is selected
                value={chosenProduct ? JSON.stringify(chosenProduct) : ""} // Set the selected value to reflect chosenProduct
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {productPrices.map((productPrice) => (
                    <SelectItem
                      key={productPrice.product_id}
                      value={JSON.stringify(productPrice)} // Convert the object to a string to use it as a value
                    >
                      {productPrice.products.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={chosenProduct?.cost || ""}
                disabled
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
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
