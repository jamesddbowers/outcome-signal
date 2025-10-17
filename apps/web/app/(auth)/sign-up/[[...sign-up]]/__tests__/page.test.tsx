import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SignUpPage from "../page";

// Mock Clerk
vi.mock("@clerk/nextjs", () => ({
  SignUp: () => <div data-testid="clerk-sign-up">Sign Up Component</div>,
}));

describe("SignUpPage", () => {
  it("renders SignUp component correctly", () => {
    const { getByTestId } = render(<SignUpPage />);
    expect(getByTestId("clerk-sign-up")).toBeInTheDocument();
  });

  it("renders within centered container", () => {
    const { container } = render(<SignUpPage />);
    const wrapper = container.querySelector("div");
    expect(wrapper).toHaveClass("flex", "min-h-screen", "items-center", "justify-center");
  });
});
