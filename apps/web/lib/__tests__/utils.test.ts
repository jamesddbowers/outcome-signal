import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility function", () => {
  it("merges class names correctly", () => {
    const result = cn("px-4", "py-2");
    expect(result).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    const result = cn("base-class", false && "hidden", "visible");
    expect(result).toBe("base-class visible");
  });

  it("merges Tailwind classes without conflicts", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("handles empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("handles undefined and null values", () => {
    const result = cn("base", undefined, null, "other");
    expect(result).toBe("base other");
  });

  it("handles arrays of classes", () => {
    const result = cn(["px-2", "py-2"], "text-sm");
    expect(result).toBe("px-2 py-2 text-sm");
  });
});
