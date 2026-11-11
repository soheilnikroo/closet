import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TextField } from "./text-field.js";

describe("accessible fields", () => {
  it("keeps a visible search label and fallback placeholder when a caller passes undefined", () => {
    render(<TextField type="search" label="Search your closet" placeholder={undefined} />);
    expect(screen.getByText("Search your closet")).toBeVisible();
    expect(screen.getByRole("searchbox", { name: "Search your closet" })).toHaveAttribute(
      "placeholder",
      "Search your closet",
    );
  });
  it("gives repeated labels distinct IDs and connects errors and external descriptions", () => {
    render(
      <>
        <p id="hint">Use a short name</p>
        <TextField label="Name" errorText="Name is required" aria-describedby="hint" />
        <TextField label="Name" />
      </>,
    );
    const fields = screen.getAllByRole("textbox", { name: /Name/ });
    expect(fields[0]?.id).not.toBe(fields[1]?.id);
    expect(fields[0]).toHaveAccessibleDescription("Use a short name Name is required");
    expect(fields[0]).toHaveAttribute("aria-invalid", "true");
  });
});
