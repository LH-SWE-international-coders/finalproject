import React from "react";
import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/navbar";

describe("Navbar", () => {
    it("renders without crashing and displays all navigation items", () => {
        render(<Navbar />);

        // Check if the logo and name are displayed
        expect(screen.getByText("SSH Shared Grocery")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /ssh shared grocery/i })).toBeInTheDocument();

        // Check if the Home button is rendered
        expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /home/i })).toBeInTheDocument();

        // Check if the Profile button is rendered
        expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /profile/i })).toBeInTheDocument();
    });
});
