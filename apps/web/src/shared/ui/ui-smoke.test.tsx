import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import {
  Card,
  Chip,
  Fab,
  IconButton,
  Progress,
  SkipLink,
  Snackbar,
  TextField,
  TopAppBar,
} from "@/shared/ui";

describe("shared UI smoke", () => {
  it("renders snackbar, icon button, chip, card, progress, text field, fab, skip link, top bar", async () => {
    const user = userEvent.setup();
    const onChip = vi.fn();
    const onIcon = vi.fn();

    render(
      <MemoryRouter>
        <SkipLink label="Skip" />
        <TopAppBar title="Closet" trailing={<span>trail</span>} />
        <Card elevated>Card body</Card>
        <Chip selected onClick={onChip}>
          Casual
        </Chip>
        <IconButton label="More" selected onClick={onIcon}>
          ···
        </IconButton>
        <Progress value={40} />
        <TextField label="Name" defaultValue="Ada" />
        <Fab label="Add">+</Fab>
        <Snackbar message="Saved" action={<button type="button">Undo</button>} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Card body")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Ada");
    expect(screen.getByRole("link", { name: "Skip" })).toHaveAttribute("href", "#main-content");
    await user.click(screen.getByRole("button", { name: "Casual" }));
    await user.click(screen.getByRole("button", { name: "More" }));
    expect(onChip).toHaveBeenCalled();
    expect(onIcon).toHaveBeenCalled();
  });
});
