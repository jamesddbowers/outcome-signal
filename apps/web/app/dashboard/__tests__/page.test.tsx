import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "../page";

// Mock Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Clerk
const mockSignOut = vi.fn();
const mockUseUser = vi.fn();
const mockUseClerk = vi.fn();

vi.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
  useClerk: () => mockUseClerk(),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseClerk.mockReturnValue({ signOut: mockSignOut });
  });

  it("shows loading state when user data is loading", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: false,
    });

    render(<Dashboard />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows not authenticated message when user is null", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: true,
    });

    render(<Dashboard />);
    expect(screen.getByText("Not authenticated")).toBeInTheDocument();
  });

  it("renders user name when authenticated", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "John",
        primaryEmailAddress: { emailAddress: "john@example.com" },
      },
      isLoaded: true,
    });

    render(<Dashboard />);
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("calls signOut and redirects when sign out button is clicked", async () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "John",
        primaryEmailAddress: { emailAddress: "john@example.com" },
      },
      isLoaded: true,
    });

    render(<Dashboard />);

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("renders dashboard heading", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "John",
        primaryEmailAddress: { emailAddress: "john@example.com" },
      },
      isLoaded: true,
    });

    render(<Dashboard />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
