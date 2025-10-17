import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SignInPage from "../page";

// Mock Clerk
vi.mock("@clerk/nextjs", () => ({
  SignIn: () => <div data-testid="clerk-sign-in">Sign In Component</div>,
}));

describe("SignInPage", () => {
  it("renders SignIn component correctly", () => {
    const { getByTestId } = render(<SignInPage />);
    expect(getByTestId("clerk-sign-in")).toBeInTheDocument();
  });

  it("renders within centered container", () => {
    const { container } = render(<SignInPage />);
    const wrapper = container.querySelector("div");
    expect(wrapper).toHaveClass("flex", "min-h-screen", "items-center", "justify-center");
  });
});
