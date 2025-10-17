import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import RootLayout, { metadata } from "../layout";

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "mocked-inter" }),
}));

// Mock Clerk
vi.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="clerk-provider">{children}</div>
  ),
}));

describe("RootLayout", () => {
  it("renders with ClerkProvider", () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    );
    expect(getByTestId("clerk-provider")).toBeInTheDocument();
    expect(getByTestId("test-child")).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    );
    expect(container.querySelector('[data-testid="test-child"]')).toBeInTheDocument();
  });

  it("applies Inter font className", () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    const body = container.querySelector("body");
    expect(body).toHaveClass("mocked-inter");
  });

  it("includes html and body tags", () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    expect(container.querySelector("html")).toBeInTheDocument();
    expect(container.querySelector("body")).toBeInTheDocument();
  });

  it("sets correct language attribute", () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    expect(container.querySelector("html")).toHaveAttribute("lang", "en");
  });
});

describe("Metadata", () => {
  it("exports correct metadata title", () => {
    expect(metadata.title).toBe("OutcomeSignal");
  });

  it("exports correct metadata description", () => {
    expect(metadata.description).toBe(
      "AI-powered product planning and documentation"
    );
  });
});
