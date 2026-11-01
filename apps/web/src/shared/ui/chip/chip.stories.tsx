import type { Meta, StoryObj } from "@storybook/react-vite";

import { Chip } from "./chip.js";

const meta = {
  title: "Design System/Chip",
  component: Chip,
  args: {
    children: "Casual",
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    selected: true,
  },
};
