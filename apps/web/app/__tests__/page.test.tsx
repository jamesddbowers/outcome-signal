import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../page";

describe("HomePage", () => {
  it("renders welcome message", () => {
    render(<Page />);
    expect(
      screen.getByText("Welcome to OutcomeSignal")
    ).toBeInTheDocument();
  });

  it("renders application description", () => {
    render(<Page />);
    expect(
      screen.getByText(/AI-powered product planning and documentation platform/)
    ).toBeInTheDocument();
  });

  it("displays tech stack information", () => {
    render(<Page />);
    expect(
      screen.getByText(/Next.js 14 with App Router/)
    ).toBeInTheDocument();
    expect(screen.getByText(/shadcn\/ui Scaled Theme/)).toBeInTheDocument();
  });

  it("renders as main element", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("main")).toBeInTheDocument();
  });
});
