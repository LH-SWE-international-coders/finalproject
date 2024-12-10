import Link from 'next/link'
import { Bell, Home, ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
    return (
        <nav className="sticky top-0 px-10 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="hidden font-bold sm:inline-block">
                        Shared Grocery
                    </span>
                </Link>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <Button variant="ghost" className="w-9 px-0">
                            <Home className="h-4 w-4" />
                            <span className="sr-only">Home</span>
                        </Button>
                        <Button variant="ghost" className="w-9 px-0">
                            <ShoppingCart className="h-4 w-4" />
                            <span className="sr-only">My Orders</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-9 px-0">
                                    <Bell className="h-4 w-4" />
                                    <span className="sr-only">Notifications</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    New order: Friday Night Dinner
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Weekend Groceries order closed
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" className="w-9 px-0">
                            <User className="h-4 w-4" />
                            <span className="sr-only">Profile</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

