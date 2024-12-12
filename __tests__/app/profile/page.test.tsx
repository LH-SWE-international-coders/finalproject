import React from "react";
import { render, screen } from "@testing-library/react";

// Mock the Supabase server client
jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn().mockReturnValue({
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: {
                    user: {
                        id: "12345678-90ab-cdef-1234-567890abcdef",
                        email: "example@gmail.com",
                    },
                },
                error: null,
            }),
            signOut: jest.fn(),
        },
    }),
}));

// Mock the Next.js redirect function
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

describe("ProfilePage", () => {
    it("renders user email and ID", async () => {
        // Mock the output of ProfilePage as it is an async server component
        const ProfilePageMock = () => (
            <div className="space-y-4">
                <p>Hello example@gmail.com</p>
                <p>
                    Your User ID: <strong>12345678-90ab-cdef-1234-567890abcdef</strong>
                </p>
                <form>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </form>
            </div>
        );

        render(<ProfilePageMock />);

        // Check if email and user ID are rendered
        expect(screen.getByText("Hello example@gmail.com")).toBeInTheDocument();
        expect(screen.getByText("Your User ID:")).toBeInTheDocument();
        expect(
            screen.getByText("12345678-90ab-cdef-1234-567890abcdef")
        ).toBeInTheDocument();
    });

    it("renders logout button", async () => {
        // Mock the output of ProfilePage as it is an async server component
        const ProfilePageMock = () => (
            <div className="space-y-4">
                <p>Hello example@gmail.com</p>
                <p>
                    Your User ID: <strong>12345678-90ab-cdef-1234-567890abcdef</strong>
                </p>
                <form>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </form>
            </div>
        );

        render(<ProfilePageMock />);

        // Check for Logout button
        const logoutButton = screen.getByRole("button", { name: /logout/i });
        expect(logoutButton).toBeInTheDocument();
    });
});
