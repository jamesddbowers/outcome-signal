import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "../page";

// Mock Clerk
const mockUseUser = vi.fn();

vi.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
}));

describe("Dashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("renders welcome message with user's first name", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "John",
        primaryEmailAddress: { emailAddress: "john@example.com" },
      },
      isLoaded: true,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Welcome back, John!/i)).toBeInTheDocument();
  });

  it("displays dashboard heading with user's name", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Jane",
      },
      isLoaded: true,
    });

    render(<Dashboard />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Welcome back, Jane!");
  });

  it("displays initiative list placeholder section", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Alice",
      },
      isLoaded: true,
    });

    render(<Dashboard />);
    expect(screen.getByText("Your Initiatives")).toBeInTheDocument();
  });

  it("displays empty state message for initiatives", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Bob",
      },
      isLoaded: true,
    });

    render(<Dashboard />);
    expect(
      screen.getByText("No initiatives yet. Create your first initiative in Epic 2!")
    ).toBeInTheDocument();
  });

  it("displays Create Initiative button in disabled state", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Charlie",
      },
      isLoaded: true,
    });

    render(<Dashboard />);

    const createButton = screen.getByRole("button", { name: /create initiative/i });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toBeDisabled();
    expect(createButton).toHaveTextContent("Create Initiative (Coming Soon)");
  });

  it("has proper ARIA label on Create Initiative button", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "David",
      },
      isLoaded: true,
    });

    render(<Dashboard />);

    const createButton = screen.getByRole("button", { name: /create initiative/i });
    expect(createButton).toHaveAttribute("aria-label", "Create initiative - coming soon");
  });

  it("displays descriptive subtitle text", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Emma",
      },
      isLoaded: true,
    });

    render(<Dashboard />);
    expect(
      screen.getByText(/Manage your initiatives and drive outcomes with AI-powered document generation/i)
    ).toBeInTheDocument();
  });

  it("renders with proper heading hierarchy", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Frank",
      },
      isLoaded: true,
    });

    render(<Dashboard />);

    // Main heading (h1)
    const mainHeading = screen.getByRole("heading", { level: 1 });
    expect(mainHeading).toBeInTheDocument();

    // Section heading (Your Initiatives) - should be in CardTitle
    expect(screen.getByText("Your Initiatives")).toBeInTheDocument();
  });

  it("uses Card component for initiative list", () => {
    mockUseUser.mockReturnValue({
      user: {
        firstName: "Grace",
      },
      isLoaded: true,
    });

    render(<Dashboard />);

    // Card component should render with proper structure
    expect(screen.getByText("Your Initiatives")).toBeInTheDocument();
    expect(screen.getByText(/No initiatives yet/i)).toBeInTheDocument();
  });
});
