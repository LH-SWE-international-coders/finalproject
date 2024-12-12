import Link from "next/link";
import { Bell, Home, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  return (
    <nav className="sticky z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 sm:px-10">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6" />
          <span className="hidden text-lg font-bold sm:inline-block">
            SSH Shared Grocery
          </span>
        </Link>

        {/* Navigation Icons */}
        <div className="flex space-x-4">
          {/* Home Icon */}
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>

          {/* User Profile Icon */}
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
