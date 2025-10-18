import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardLayout from "../layout";

// Mock Clerk
const mockSignOut = vi.fn();
const mockUseUser = vi.fn();
const mockUseClerk = vi.fn();

vi.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
  useClerk: () => mockUseClerk(),
}));

describe("DashboardLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseClerk.mockReturnValue({ signOut: mockSignOut });
  });

  it("shows loading state when user data is loading", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: false,
    });

    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Test Content")).not.toBeInTheDocument();
  });

  it("shows not authenticated message when user is null", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: true,
    });

    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText("Not authenticated")).toBeInTheDocument();
    expect(screen.queryByText("Test Content")).not.toBeInTheDocument();
  });

  it("renders layout with user information when authenticated", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "John",
        lastName: "Doe",
      },
      isLoaded: true,
    });

    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText("OutcomeSignal")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders children components within the layout", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Jane",
      },
      isLoaded: true,
    });

    render(
      <DashboardLayout>
        <div data-testid="child-content">Child Component</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("displays user's first name in the header", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Alice",
      },
      isLoaded: true,
    });

    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders Sign Out button with proper aria-label", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Bob",
      },
      isLoaded: true,
    });

    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("aria-label", "Sign out of your account");
  });

  it("calls signOut when logout button is clicked", async () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Charlie",
      },
      isLoaded: true,
    });

    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      // Clerk handles redirect automatically after signOut
    });
  });

  it("renders header with application logo/title", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "David",
      },
      isLoaded: true,
    });

    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("OutcomeSignal");
  });

  it("has proper semantic HTML structure", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Emma",
      },
      isLoaded: true,
    });

    const { container } = render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("main")).toBeInTheDocument();
  });
});
